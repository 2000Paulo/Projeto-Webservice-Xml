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

    const reader = new FileReader();
    reader.onload = function (e) {
        const parser = new DOMParser();
        const userXml = e.target.result.trim();
        const xmlDoc = parser.parseFromString(userXml, 'text/xml');

        const parserError = xmlDoc.getElementsByTagName('parsererror')[0];
        if (parserError) {
            displayResult(`Formato Enviado Invalido`, 'error');
            return;
        }

        const rootNode = xmlDoc.documentElement.localName;
        const expectedRootNode = xmlTemplates[xmlType].template.match(/<([a-zA-Z0-9]+)\s/)[1];

        if (rootNode !== expectedRootNode) {
            displayResult(`O método selecionado (${xmlType}) não corresponde ao XML importado (${rootNode}).`, 'error');
            return;
        }

        try {
            const errors = compareXml(xmlDoc, xmlType);

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

function displayResult(message, type) {
    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = message;
    resultContainer.className = type === 'error' ? 'result error' : 'result success';
}

function compareXml(userXml, method) {
    const templateXml = new DOMParser().parseFromString(xmlTemplates[method].template, 'text/xml');
    const errors = [];

    function validateNode(node1, node2, path = '') {
        if (!node1) {
            const isOptional = node2.hasAttribute('optional') && node2.getAttribute('optional') === 'true';
            if (!isOptional) {
                errors.push(`Tag obrigatória ausente: ${path}`);
            }
            return;
        }

        // Verificar namespace
        if (node1.namespaceURI !== node2.namespaceURI) {
            errors.push(`Namespace incorreto na tag ${path}: esperado "${node2.namespaceURI}", encontrado "${node1.namespaceURI}"`);
            return;
        }
        if (node1.localName === 'CpfCnpj') {
          const cpfNode = node1.querySelector('Cpf');
          const cnpjNode = node1.querySelector('Cnpj');
  
          if (!cpfNode && !cnpjNode) {
              errors.push(`A tag ${path} deve conter pelo menos uma das tags <Cnpj> ou <Cpf>. Nenhuma foi encontrada.`);
          } else {
              // Validar <Cpf>
              if (cpfNode) {
                  const cpfValue = cpfNode.textContent.trim();
                  const cpfLength = cpfValue.length;
                  if (!/^\d{11}$/.test(cpfValue)) {
                      errors.push(`A tag <Cpf> dentro de ${path} deve conter exatamente 11 números. Contém ${cpfLength}.`);
                  }
              }
  
              // Validar <Cnpj>
              if (cnpjNode) {
                  const cnpjValue = cnpjNode.textContent.trim();
                  const cnpjLength = cnpjValue.length;
                  if (!/^\d{14}$/.test(cnpjValue)) {
                      errors.push(`A tag <Cnpj> dentro de ${path} deve conter exatamente 14 números. Contém ${cnpjLength}.`);
                  }
              }
          }
      }
        // Verificar atributos de tipo e tamanho
        const type = node2.getAttribute('type');
        const maxlength = parseInt(node2.getAttribute('maxlength'), 10);
        const decimalPlaces = parseInt(node2.getAttribute('decimalPlaces'), 10);

        if (type && maxlength) {
            const content = node1.textContent.trim();

            if (type === 'N') { // Numérico
              if (!/^\d+(\.\d+)?$/.test(content)) {
                  errors.push(`A tag ${path} deve conter apenas números no formato correto.`);
              }
          
              const [integerPart, fractionPart = ''] = content.split('.');
              const integerLength = integerPart.length;
              const fractionLength = fractionPart.length;
          
              // Validar comprimento da parte inteira
              if (integerLength > 15) {
                  errors.push(`A tag ${path} excede o número máximo permitido de 15 dígitos na parte inteira. Contém ${integerLength}.`);
              }
          
              // Validar comprimento da parte decimal
              if (decimalPlaces && fractionLength > decimalPlaces) {
                  errors.push(`A tag ${path} excede o número máximo de casas decimais permitido (${decimalPlaces}). Contém ${fractionLength}.`);
              } else if (decimalPlaces === 0 && fractionLength > 0) {
                  errors.push(`A tag ${path} não deve conter casas decimais.`);
              }
          }else if (type === 'C') { // Caractere
                if (content.length > maxlength) {
                    errors.push(`A tag ${path} excede o tamanho máximo permitido de ${maxlength} caracteres.`);
                }
            }
        }

        // Verificar tags filhas
        const children1 = Array.from(node1.children);
        const children2 = Array.from(node2.children);

        children2.forEach(child => {
            const matchingChild = children1.find(
                c => c.localName === child.localName && c.namespaceURI === child.namespaceURI
            );
            validateNode(matchingChild, child, `${path}/${child.localName}`);
        });

        // Verificar conteúdo obrigatório
        if (node2.textContent.trim() && !node1.textContent.trim()) {
            errors.push(`A tag ${path} está presente, mas não possui valor obrigatório.`);
        }
    }

    validateNode(userXml.documentElement, templateXml.documentElement);
    return errors;
}

const xmlTemplates = {
  "RecepcaoLoteRps": {
    template: `<?xml version="1.0" encoding="UTF-8"?>
    <EnviarLoteRpsEnvio xmlns="http://www.abrasf.org.br/ABRASF/arquivos/nfse.xsd">
      <LoteRps>
        <NumeroLote type="N" length="15">123456</NumeroLote>
        <Prestador>
          <CpfCnpj>
            <Cnpj type="N" length="14" optional="true">12345678000199</Cnpj>
            <Cpf type="N" length="11" optional="true">12345678910</Cpf>
          </CpfCnpj>
          <InscricaoMunicipal type="C" length="15" optional="true">123456</InscricaoMunicipal>
        </Prestador>
        <QuantidadeRps type="N" length="4">1</QuantidadeRps>
        <ListaRps>
          <Rps>
            <InfDeclaracaoPrestacaoServico>
              <Rps optional="true">
                <IdentificacaoRps>
                  <Numero type="N" length="15">123456</Numero>
                  <Serie type="C" length="5">RPS</Serie>
                  <Tipo type="N" length="1">1</Tipo>
                </IdentificacaoRps>
                <DataEmissao type="T">2023-01-01</DataEmissao>
                <Status type="N" length="1">1</Status>
                <RpsSubstituido optional="true">
                  <Numero type="N" length="15">123456</Numero>
                  <Serie type="C" length="5">RPS</Serie>
                  <Tipo type="N" length="1">1</Tipo>
                </RpsSubstituido>
              </Rps>
              <Competencia type="T">2023-01-01</Competencia>
              <Servico>
                <Valores>
                  <ValorServicos type="N" maxlength="15" decimalPlaces="2">100.00</ValorServicos>
                  <ValorDeducoes type="N" maxlength="15" decimalPlaces="2" optional="true">0.00</ValorDeducoes>
                  <ValorPis type="N" maxlength="15" decimalPlaces="2" optional="true">0.00</ValorPis>
                  <ValorCofins type="N" maxlength="15" decimalPlaces="2" optional="true">0.00</ValorCofins>
                  <ValorInss type="N" maxlength="15" decimalPlaces="2" optional="true">0.00</ValorInss>
                  <ValorIr type="N" maxlength="15" decimalPlaces="2" optional="true">0.00</ValorIr>
                  <ValorCsll type="N" maxlength="15" decimalPlaces="2" optional="true">0.00</ValorCsll>
                  <OutrasRetencoes type="N" maxlength="15" decimalPlaces="2" optional="true">0.00</OutrasRetencoes>
                  <ValTotTributos type="N" maxlength="15" decimalPlaces="2" optional="true">0.00</ValTotTributos>
                  <ValorIss type="N" maxlength="15" decimalPlaces="2" optional="true">5.00</ValorIss>
                  <Aliquota type="N" maxlength="4,2" optional="true">2.00</Aliquota>
                  <DescontoIncondicionado type="N" maxlength="15" decimalPlaces="2" optional="true">0.00</DescontoIncondicionado>
                  <DescontoCondicionado type="N" maxlength="15" decimalPlaces="2" optional="true">0.00</DescontoCondicionado>
                </Valores>
                <IssRetido type="N" length="1">1</IssRetido>
                <ResponsavelRetencao type="N" length="1" optional="true">1</ResponsavelRetencao>
                <ItemListaServico type="C" length="5">1401</ItemListaServico>
                <CodigoCnae type="N" length="7" optional="true">1234567</CodigoCnae>
                <CodigoTributacaoMunicipio type="C" length="20" optional="true">1234</CodigoTributacaoMunicipio>
                <CodigoNbs type="C" length="9" optional="true">123456789</CodigoNbs>
                <Discriminacao type="C" length="2000">Descrição detalhada do serviço prestado</Discriminacao>
                <CodigoMunicipio type="N" length="7">3302700</CodigoMunicipio>
                <CodigoPais type="N" length="4" optional="true">1058</CodigoPais>
                <ExigibilidadeISS type="N" length="2">1</ExigibilidadeISS>
                <IdentifNaoExigibilidade type="C" length="4" optional="true">1234</IdentifNaoExigibilidade>
                <MunicipioIncidencia type="N" length="7" optional="true">3302700</MunicipioIncidencia>
                <NumeroProcesso type="C" length="30" optional="true">1234567890</NumeroProcesso>
              </Servico>
              <Prestador>
                <CpfCnpj>
                  <Cnpj type="N" length="14" optional="true">12345678000199</Cnpj>
                  <Cpf type="N" length="11" optional="true">12345678910</Cpf>
                </CpfCnpj>
                <InscricaoMunicipal type="C" length="15" optional="true">03069133</InscricaoMunicipal>
              </Prestador>
              <TomadorServico optional="true">
                <IdentificacaoTomador optional="true">
                  <CpfCnpj>
                    <Cnpj type="N" length="14" optional="true">12345678000199</Cnpj>
                    <Cpf type="N" length="11" optional="true">12345678910</Cpf>
                  </CpfCnpj>
                  <InscricaoMunicipal type="C" length="15" optional="true">123456</InscricaoMunicipal>
                </IdentificacaoTomador>
                <NifTomador>tsNif[Opcional]</NifTomador>
                <RazaoSocial type="C" length="150" optional="true">Nome do Tomador</RazaoSocial>
                <Endereco>
                  <Endereco type="C" length="255">Rua Exemplo</Endereco>
                  <Numero type="C" length="60">123</Numero>
                  <Complemento type="C" length="60" optional="true">Bloco A</Complemento>
                  <Bairro type="C" length="60">Centro</Bairro>
                  <CodigoMunicipio type="N" length="7">3302700</CodigoMunicipio>
                  <Uf type="C" length="2">RJ</Uf>
                  <Cep type="N" length="8">24900000</Cep>
                </Endereco>
                <EnderecoExterior>
              <CodigoPais type="N" length="4">1058</CodigoPais>
              <EnderecoCompletoExterior type="C" length="255">Endereço completo no exterior, incluindo rua, cidade e país.</EnderecoCompletoExterior>
              </EnderecoExterior>
                <Contato optional="true">
                  <Email type="C" length="80" optional="true">exemplo@email.com</Email>
                </Contato>
              </TomadorServico>
            </InfDeclaracaoPrestacaoServico>
          <Intermediario optional="true">
                <IdentificacaoIntermediario>
                  <CpfCnpj>
                    <Cnpj type="N" length="14" optional="true">12345678000199</Cnpj>
                    <Cpf type="N" length="11" optional="true">12345678910</Cpf>
                  </CpfCnpj>
                  <InscricaoMunicipal type="C" length="15" optional="true">03069133</InscricaoMunicipal>
                </IdentificacaoIntermediario>
                <RazaoSocial type="C" length="150">Razão Social do Intermediário</RazaoSocial>
                <CodigoMunicipio type="N" length="7">3302700</CodigoMunicipio>
              </Intermediario>
              <ConstrucaoCivil optional="true">
                <CodigoObra type="C" length="30">1234567890</CodigoObra>
                <Art type="C" length="30" optional="true">9876543210</Art>
              </ConstrucaoCivil>
              <RegimeEspecialTributacao type="N" length="2" optional="true">1</RegimeEspecialTributacao>
              <OptanteSimplesNacional type="N" length="1">1</OptanteSimplesNacional>
              <IncentivoFiscal type="N" length="1">1</IncentivoFiscal>
              <Evento optional="true">
                <IdentificacaoEvento type="C" length="30">EventoID</IdentificacaoEvento>
                <DescricaoEvento type="C" length="255" optional="true">Descrição do Evento</DescricaoEvento>
              </Evento>
              <InformacoesComplementares type="C" length="2000" optional="true">Informações complementares detalhadas.</InformacoesComplementares>
              <Deducao optional="true">
                <TipoDeducao type="N" length="2">1</TipoDeducao>
                <DescricaoDeducao type="C" length="150" optional="true">Descrição da dedução.</DescricaoDeducao>
                <IdentificacaoDocumentoDeducao>
                  <IdentificacaoNfse>
                    <CodigoMunicipioGerador type="N" length="7">3302700</CodigoMunicipioGerador>
                    <NumeroNfse type="N" length="15">123456</NumeroNfse>
                    <CodigoVerificacao type="C" length="9" optional="true">ABC123456</CodigoVerificacao>
                  </IdentificacaoNfse>
                  <IdentificacaoNFe>
                    <NumeroNfe type="N" length="9">987654321</NumeroNfe>
                    <UfNfe type="C" length="2">RJ</UfNfe>
                    <ChaveAcessoNfe type="C" length="44" optional="true">12345678901234567890123456789012345678901234</ChaveAcessoNfe>
                  </IdentificacaoNFe>
                  <OutroDocumento>
                    <IdentificacaoDocumento type="C" length="255">Documento adicional.</IdentificacaoDocumento>
                  </OutroDocumento>
                </IdentificacaoDocumentoDeducao>
                <DadosFornecedor>
                  <IdentificacaoFornecedor>
                    <CpfCnpj>
                      <Cnpj type="N" length="14" optional="true">12345678000199</Cnpj>
                      <Cpf type="N" length="11" optional="true">12345678910</Cpf>
                    </CpfCnpj>
                  </IdentificacaoFornecedor>
                  <FornecedorExterior optional="true">
                    <NifFornecedor type="C" length="40" optional="true">987654321</NifFornecedor>
                    <CodigoPais type="N" length="4">1058</CodigoPais>
                  </FornecedorExterior>
                </DadosFornecedor>
                <DataEmissao type="T">2023-01-01</DataEmissao>
                <ValorDedutivel type="N" maxlength="15" decimalPlaces="2">100.00</ValorDedutivel>
                <ValorUtilizadoDeducao type="N" maxlength="15" decimalPlaces="2">50.00</ValorUtilizadoDeducao>
              </Deducao>
            </InfDeclaracaoPrestacaoServico>
          </Rps>
        </ListaRps>
      </LoteRps>
    </EnviarLoteRpsEnvio>`
  },

  "CancelamentoNfse": {
    template: `<?xml version="1.0" encoding="UTF-8"?>
    <CancelarNfseEnvio xmlns="http://www.abrasf.org.br/ABRASF/arquivos/nfse.xsd">
      <Pedido>
        <InfPedidoCancelamento>
          <IdentificacaoNfse>
            <Numero type="N" length="15">123456</Numero>
            <CpfCnpj>
              <Cnpj type="N" length="14" optional="true">12345678000199</Cnpj>
              <Cpf type="N" length="11" optional="true">12345678910</Cpf>
            </CpfCnpj>
            <InscricaoMunicipal type="C" length="15" optional="true">123456</InscricaoMunicipal>
            <CodigoMunicipio type="N" length="7">1234567</CodigoMunicipio>
          </IdentificacaoNfse>
          <CodigoCancelamento type="N" length="1">2</CodigoCancelamento>
        </InfPedidoCancelamento>
      </Pedido>
    </CancelarNfseEnvio>`
  },

  "SubstituicaoNfse": {
    template: `<?xml version="1.0" encoding="UTF-8"?>
    <SubstituirNfseEnvio xmlns="http://www.abrasf.org.br/ABRASF/arquivos/nfse.xsd">
        <SubstituicaoNfse>
            <Pedido>
                <InfPedidoCancelamento>
                    <IdentificacaoNfse>
                        <Numero type="N" length="15">123456</Numero>
                        <CpfCnpj>
                            <Cnpj type="N" length="14" optional="true">12345678000199</Cnpj>
                            <Cpf type="N" length="11" optional="true">12345678910</Cpf>
                        </CpfCnpj>
                        <InscricaoMunicipal type="C" length="15" optional="true">123456</InscricaoMunicipal>
                        <CodigoMunicipio type="N" length="7">1234567</CodigoMunicipio>
                    </IdentificacaoNfse>
                    <CodigoCancelamento type="N" length="1">1</CodigoCancelamento>
                </InfPedidoCancelamento>
            </Pedido>
            <Rps>
                <InfDeclaracaoPrestacaoServico>
                    <Rps optional="true">
                        <IdentificacaoRps optional="true">
                            <Numero type="N" length="15">123456</Numero>
                            <Serie type="C" length="5">RPS</Serie>
                            <Tipo type="N" length="1">1</Tipo>
                        </IdentificacaoRps>
                        <DataEmissao type="T">2023-01-01</DataEmissao>
                        <Status type="N" length="1">1</Status>
                    </Rps>
                    <Competencia type="T">2023-01-01</Competencia>
                    <Servico>
                        <Valores>
                            <ValorServicos type="N" maxlength="15" decimalPlaces="2">1000.00</ValorServicos>
                            <Aliquota type="N" length="4,2" optional="true">2</Aliquota>
                        </Valores>
                        <Discriminacao type="C" length="2000">Descrição detalhada do serviço prestado</Discriminacao>
                        <CodigoMunicipio type="N" length="7">1234567</CodigoMunicipio>
                    </Servico>
                    <TomadorServico optional="true">
                        <IdentificacaoTomador optional="true">
                            <CpfCnpj optional="true">
                                <Cnpj type="N" length="14" optional="true">12345678000199</Cnpj>
                                <Cpf type="N" length="11" optional="true">12345678910</Cpf>
                            </CpfCnpj>
                        </IdentificacaoTomador>
                        <RazaoSocial type="C" length="150" optional="true">Razão Social</RazaoSocial>
                    </TomadorServico>
                </InfDeclaracaoPrestacaoServico>
            </Rps>
        </SubstituicaoNfse>
    </SubstituirNfseEnvio>`
  },

    "ConsultaNfsePorRps": {
    template: `<?xml version="1.0" encoding="UTF-8"?>
    <ConsultarNfseRpsEnvio xmlns="http://www.abrasf.org.br/ABRASF/arquivos/nfse.xsd">
      <IdentificacaoRps>
        <Numero type="number" length="15" optional="false">123</Numero>
        <Serie type="string" length="5" optional="false">Rps</Serie>
        <Tipo type="number" length="1" optional="false">1</Tipo>
      </IdentificacaoRps>
      <Prestador>
        <CpfCnpj>
          <Cnpj type="N" length="14" optional="true">12345678000199</Cnpj>
          <Cpf type="N" length="11" optional="true">12345678910</Cpf>
        </CpfCnpj>
        <InscricaoMunicipal type="number" length="15" optional="true">123456</InscricaoMunicipal>
      </Prestador>
    </ConsultarNfseRpsEnvio>`
  },

  "ConsultaLoteRps": {
    template: `<?xml version="1.0" encoding="UTF-8"?>
    <ConsultarLoteRpsEnvio xmlns="http://www.abrasf.org.br/ABRASF/arquivos/nfse.xsd">
      <Prestador>
        <CpfCnpj>
          <Cnpj type="N" length="14" optional="true">12345678000199</Cnpj>
          <Cpf type="N" length="11" optional="true">12345678910</Cpf>
        </CpfCnpj>
        <InscricaoMunicipal type="C" length="15" optional="true">123456</InscricaoMunicipal>
      </Prestador>
      <Protocolo type="C" length="50">123456</Protocolo>
    </ConsultarLoteRpsEnvio>`
  },

  "ConsultaPorFaixaNfse": {
    template: `<?xml version="1.0" encoding="UTF-8"?>
    <ConsultarNfseFaixaEnvio xmlns="http://www.abrasf.org.br/ABRASF/arquivos/nfse.xsd">
      <Prestador>
        <CpfCnpj>
          <Cnpj type="N" length="14" optional="true">12345678000199</Cnpj>
          <Cpf type="N" length="11" optional="true">12345678910</Cpf>
        </CpfCnpj>
        <InscricaoMunicipal type="C" length="15" optional="true">123456</InscricaoMunicipal>
      </Prestador>
      <Faixa>
        <NumeroNfseInicial type="N" length="15">123456</NumeroNfseInicial>
        <NumeroNfseFinal type="N" length="15">123460</NumeroNfseFinal>
      </Faixa>
    </ConsultarNfseFaixaEnvio>`
  },

    "ConsultaNfseServicoPrestado": {
    template: `<?xml version="1.0" encoding="UTF-8"?>
    <ConsultarNfseServicoPrestadoEnvio xmlns="http://www.abrasf.org.br/ABRASF/arquivos/nfse.xsd">
      <Prestador>
        <CpfCnpj>
          <Cnpj type="N" length="14" optional="true">12345678000199</Cnpj>
          <Cpf type="N" length="11" optional="true">12345678910</Cpf>
        </CpfCnpj>
        <InscricaoMunicipal type="number" length="15" optional="true">123456</InscricaoMunicipal>
      </Prestador>
      <NumeroNfse type="number" length="15" optional="false">123456</NumeroNfse>
      <PeriodoEmissao>
        <DataInicial type="date" length="10" optional="false">2023-01-01</DataInicial>
        <DataFinal type="date" length="10" optional="false">2023-01-31</DataFinal>
      </PeriodoEmissao>
    </ConsultarNfseServicoPrestadoEnvio>`
  },

  "ConsultaNfseServicoTomado": {
    template: `<?xml version="1.0" encoding="UTF-8"?>
    <ConsultarNfseServicoTomadoEnvio xmlns="http://www.abrasf.org.br/ABRASF/arquivos/nfse.xsd">
      <ConsultarNfseEnvio>
        <Consulente>
          <CpfCnpj>
            <Cnpj type="N" length="14" optional="true">12345678000199</Cnpj>
            <Cpf type="N" length="11" optional="true">12345678910</Cpf>
          </CpfCnpj>
          <InscricaoMunicipal type="C" length="15" optional="true">123456</InscricaoMunicipal>
        </Consulente>
        <NumeroNfse type="N" length="15">123456</NumeroNfse>
        <PeriodoEmissao>
          <DataInicial type="date">2023-01-01</DataInicial>
          <DataFinal type="date">2023-12-31</DataFinal>
        </PeriodoEmissao>
        <PeriodoCompetencia>
          <DataInicial type="date" optional="true">2023-01-01</DataInicial>
          <DataFinal type="date" optional="true">2023-12-31</DataFinal>
        </PeriodoCompetencia>
        <Prestador>
          <CpfCnpj>
            <Cnpj type="N" length="14" optional="true">12345678000199</Cnpj>
            <Cpf type="N" length="11" optional="true">12345678910</Cpf>
          </CpfCnpj>
          <InscricaoMunicipal type="C" length="15" optional="true">654321</InscricaoMunicipal>
        </Prestador>
        <Tomador>
          <CpfCnpj>
            <Cnpj type="N" length="14" optional="true">12345678000199</Cnpj>
            <Cpf type="N" length="11" optional="true">12345678910</Cpf>
          </CpfCnpj>
          <InscricaoMunicipal type="C" length="15" optional="true">789012</InscricaoMunicipal>
        </Tomador>
        <Intermediario>
          <CpfCnpj>
            <Cnpj type="N" length="14" optional="true">12345678000199</Cnpj>
            <Cpf type="N" length="11" optional="true">12345678910</Cpf>
          </CpfCnpj>
          <InscricaoMunicipal type="C" length="15" optional="true">890123</InscricaoMunicipal>
        </Intermediario>
      </ConsultarNfseEnvio>
    </ConsultarNfseServicoTomadoEnvio>`
  }
};