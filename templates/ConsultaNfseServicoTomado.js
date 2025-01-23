// Arquivo: templates/ConsultaNfseServicoTomado.js
const ConsultaNfseServicoTomado = `<?xml version="1.0" encoding="UTF-8"?>
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
    </ConsultarNfseServicoTomadoEnvio>`;
export default ConsultaNfseServicoTomado;
