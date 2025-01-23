// Arquivo: templates/SubstituicaoNfse.js
const SubstituicaoNfse = `<?xml version="1.0" encoding="UTF-8"?>
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
    </SubstituirNfseEnvio>`;
export default SubstituicaoNfse;