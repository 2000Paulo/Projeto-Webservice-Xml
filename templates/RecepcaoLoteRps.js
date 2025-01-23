// Arquivo: templates/RecepcaoLoteRps.js
const RecepcaoLoteRps = `<?xml version="1.0" encoding="UTF-8"?>
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
      </Rps>
    </ListaRps>
  </LoteRps>
</EnviarLoteRpsEnvio>
`;
export default RecepcaoLoteRps;