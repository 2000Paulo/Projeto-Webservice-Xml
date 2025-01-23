// Arquivo: main.js
import RecepcaoLoteRps from './templates/RecepcaoLoteRps.js';
import CancelamentoNfse from './templates/CancelamentoNfse.js';
import SubstituicaoNfse from './templates/SubstituicaoNfse.js';
import ConsultaNfsePorRps from './templates/ConsultaNfsePorRps.js';
import ConsultaLoteRps from './templates/ConsultaLoteRps.js';
import ConsultaPorFaixaNfse from './templates/ConsultaPorFaixaNfse.js';
import ConsultaNfseServicoPrestado from './templates/ConsultaNfseServicoPrestado.js';
import ConsultaNfseServicoTomado from './templates/ConsultaNfseServicoTomado.js';

const xmlTemplates = {
    RecepcaoLoteRps,
    CancelamentoNfse,
    SubstituicaoNfse,
    ConsultaNfsePorRps,
    ConsultaLoteRps,
    ConsultaPorFaixaNfse,
    ConsultaNfseServicoPrestado,
    ConsultaNfseServicoTomado,
};

document.getElementById('xmlForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const xmlType = document.getElementById('xmlType').value;
    const xmlFile = document.getElementById('xmlFile').files[0];

    if (!xmlType) {
        displayResult('Por favor, selecione um tipo de XML.', 'error');
        return;
    }

    if (!xmlFile) {
        displayResult('Por favor, carregue um arquivo XML.', 'error');
        return;
    }

    const fileExtension = xmlFile.name.split('.').pop().toLowerCase();
    if (fileExtension !== 'xml') {
        displayResult('Erro: O arquivo carregado não é um XML válido. Por favor, carregue um arquivo com a extensão .xml.', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const parser = new DOMParser();
        const rawXml = e.target.result.trim();
        const closureErrors = checkTagClosure(rawXml);

        if (closureErrors.length > 0) {
            displayValidationResult(closureErrors);
            return;
        }

        const userXml = parser.parseFromString(rawXml, 'text/xml');

        const parserError = userXml.getElementsByTagName('parsererror')[0];
        if (parserError) {
            displayResult(`Erro de parsing no XML: ${parserError.textContent}`, 'error');
            return;
        }

        // Validação de divergência de método
        const rootNode = userXml.documentElement.localName;
        if (!validateMethod(rootNode, xmlType)) {
            displayResult(
                `Erro: O tipo de XML selecionado (${xmlType}) não corresponde ao método detectado no XML carregado (${rootNode}).`,
                'error'
            );
            return;
        }

        try {
            const errors = compareXml(userXml, xmlType, rawXml);
            const resultContainer = document.getElementById('result');
            resultContainer.innerHTML = '';

            if (errors.length > 0) {
                const uniqueErrors = [...new Set(errors)];
                const errorList = document.createElement('ul');
                uniqueErrors.forEach(error => {
                    const listItem = document.createElement('li');
                    listItem.textContent = error;
                    errorList.appendChild(listItem);
                });
                resultContainer.appendChild(errorList);
                resultContainer.className = 'error';
            } else {
                resultContainer.textContent = 'O arquivo XML está em conformidade com o modelo de referência.';
                resultContainer.className = 'success';
            }
        } catch (err) {
            displayResult(`Erro ao comparar XML: ${err.message}`, 'error');
        }
    };

    reader.onerror = () => {
        displayResult('Erro ao carregar o arquivo XML. Verifique se ele está acessível.', 'error');
    };

    reader.readAsText(xmlFile);
});

function validateMethod(rootNode, xmlType) {
    const expectedRoots = {
        RecepcaoLoteRps: 'EnviarLoteRpsEnvio',
        CancelamentoNfse: 'CancelarNfseEnvio',
        SubstituicaoNfse: 'SubstituirNfseEnvio',
        ConsultaNfsePorRps: 'ConsultarNfsePorRpsEnvio',
        ConsultaLoteRps: 'ConsultarLoteRpsEnvio',
        ConsultaPorFaixaNfse: 'ConsultarNfseFaixaEnvio',
        ConsultaNfseServicoPrestado: 'ConsultarNfseServicoPrestadoEnvio',
        ConsultaNfseServicoTomado: 'ConsultarNfseServicoTomadoEnvio',
    };

    return expectedRoots[xmlType] === rootNode;
}

function displayResult(message, type) {
    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = message;
    resultContainer.className = type === 'error' ? 'result error' : 'result success';
}

function checkTagClosure(rawXml) {
    const errors = [];
    const tagStack = [];
    const tagRegex = /<\/?([a-zA-Z0-9_\-:]+)[^>]*>/g;
    let match;

    while ((match = tagRegex.exec(rawXml)) !== null) {
        const tagName = match[1];
        const isClosingTag = match[0].startsWith('</');
        const lineNumber = rawXml.substring(0, match.index).split('\n').length;

        if (isClosingTag) {
            if (tagStack.length === 0 || tagStack[tagStack.length - 1].name !== tagName) {
                // Adiciona erro de fechamento incorreto e retorna
                errors.push(`Erro na estrutura XML: Verifique a abertura e fechamento das tags. A tag encontrada na linha ${lineNumber} não corresponde à estrutura esperada definida no manual do webservice.`);
                return errors; // Retorna imediatamente após encontrar um erro
            } else {
                // Remove a tag correspondente da pilha
                tagStack.pop();
            }
        } else {
            if (!match[0].endsWith('/>')) {
                // Adiciona a tag aberta na pilha
                tagStack.push({ name: tagName, line: lineNumber });
            }
        }
    }
    return errors;
}

function displayValidationResult(errors) {
    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = '';

    if (errors.length > 0) {
        const errorList = document.createElement('ul');
        errors.forEach(error => {
            const listItem = document.createElement('li');
            listItem.textContent = error;
            errorList.appendChild(listItem);
        });
        resultContainer.appendChild(errorList);
        resultContainer.className = 'error';
    }
}

function compareXml(userXml, method, rawXml) {
    const templateXml = new DOMParser().parseFromString(xmlTemplates[method], 'text/xml');
    const errors = [];

    function getLineFromRawXml(tag, rawXml, value) {
        const tagRegex = new RegExp(`<${tag}[^>]*>(.*?)<\\/${tag}>`, 'g');
        let match;
        let line = 'desconhecida';
    
        // Iterar por todas as ocorrências da tag
        while ((match = tagRegex.exec(rawXml)) !== null) {
            if (match[1].trim() === value.trim()) {
                const index = match.index;
                const lines = rawXml.substring(0, index).split('\n');
                line = lines.length;
                break;
            }
        }
    
        return line;
    }

    function validateNode(node1, node2, path = '') {
        if (!node1) {
            const isOptional = node2.hasAttribute('optional') && node2.getAttribute('optional') === 'true';
            if (!isOptional) {
                const fullPath = `${path}/${node2.localName}`;
                errors.push(`A tag obrigatória <${node2.localName}> está ausente no caminho ${fullPath}.`);
            }
            return;
        }
        const type = node2.getAttribute('type');
        const value = node1.textContent.trim();
        const line = getLineFromRawXml(node1.localName, rawXml, value);
        const length = parseInt(node2.getAttribute('length'), 10);
        const maxLength = parseInt(node2.getAttribute('maxlength'), 10);
        const isOptional = node2.getAttribute('optional') === 'true';
    
        // Validação de tipo
        if (type === 'N') {
            if (!/^\d+(\.\d+)?$/.test(value)) {
                errors.push(`Erro na tag <${node1.localName}> na linha ${line}: Esperado valor numérico. Encontrado: "${value}".`);
            } else if (parseFloat(value) <= 0) {
                errors.push(`Erro na tag <${node1.localName}> na linha ${line}: O valor deve ser maior que 0. Encontrado: "${value}".`);
            }
        } else if (type === 'C' && typeof value !== 'string') {
            errors.push(`Erro na tag <${node1.localName}> na linha ${line}: Esperado valor de caracteres. Encontrado: "${value}".`);
        } else if (type === 'T' && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            errors.push(`Erro na tag <${node1.localName}> na linha ${line}: Esperado valor de data no formato YYYY-MM-DD. Encontrado: "${value}".`);
        }
    
        // Validação de comprimento fixo para CPF, CNPJ e Número da Nota
        if (
            (node2.localName === 'Cpf' && length && value.length !== length) ||
            (node2.localName === 'Cnpj' && length && value.length !== length) ||
            (node2.localName === 'NumeroNfse' && length && value.length !== length && type === 'N') ||
            (node2.localName === 'NumeroNfseInicial' && length && value.length !== length && type === 'N') ||
            (node2.localName === 'NumeroNfseFinal' && length && value.length !== length && type === 'N') ||
            (node2.localName === 'Numero' && length && value.length !== length && type === 'N')
            
        ) {
            errors.push(`Erro na tag <${node1.localName}> na linha ${line}: O valor deve ter exatamente ${length} caracteres. Encontrado: "${value}".`);
        }

        // Validação de comprimento máximo para outras tags
        if (maxLength && value.length > maxLength) {
            if (isOptional) {
                warnings.push(`Aviso na tag <${node1.localName}> na linha ${line}: O valor excede ${maxLength} caracteres permitidos. Encontrado: "${value}".`);
            } else {
                errors.push(`Erro na tag <${node1.localName}> na linha ${line}: O valor excede ${maxLength} caracteres permitidos. Encontrado: "${value}".`);
            }
        }
    
        // Validação dos filhos
        const children1 = Array.from(node1.children);
        const children2 = Array.from(node2.children);
    
        children2.forEach(child => {
            const matchingChild = children1.find(c => c.localName === child.localName);
            validateNode(matchingChild, child, `${path}/${child.localName}`);
        });
    }
    

    validateNode(userXml.documentElement, templateXml.documentElement);
    return errors;
}

