// Arquivo: templates/ConsultaPorFaixaNfse.js
const ConsultaPorFaixaNfse = `<?xml version="1.0" encoding="UTF-8"?>
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
    </ConsultarNfseFaixaEnvio>`;
export default ConsultaPorFaixaNfse;