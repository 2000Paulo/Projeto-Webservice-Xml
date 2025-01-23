// Arquivo: templates/ConsultaLoteRps.js
const ConsultaLoteRps = `<?xml version="1.0" encoding="UTF-8"?>
<ConsultarLoteRpsEnvio xmlns="http://www.abrasf.org.br/ABRASF/arquivos/nfse.xsd">
      <Prestador>
        <CpfCnpj>
          <Cnpj type="N" length="14" optional="true">12345678000199</Cnpj>
          <Cpf type="N" length="11" optional="true">12345678910</Cpf>
        </CpfCnpj>
        <InscricaoMunicipal type="C" length="15" optional="true">123456</InscricaoMunicipal>
      </Prestador>
      <Protocolo type="C" length="50">123456</Protocolo>
    </ConsultarLoteRpsEnvio>`;
export default ConsultaLoteRps;