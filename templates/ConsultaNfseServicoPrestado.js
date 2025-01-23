// Arquivo: templates/ConsultaNfseServicoPrestado.js
const ConsultaNfseServicoPrestado = `<?xml version="1.0" encoding="UTF-8"?>
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
    </ConsultarNfseServicoPrestadoEnvio>`;
export default ConsultaNfseServicoPrestado;