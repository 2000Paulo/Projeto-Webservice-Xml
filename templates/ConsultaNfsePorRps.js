// Arquivo: templates/ConsultaNfsePorRps.js
const ConsultaNfsePorRps = `<?xml version="1.0" encoding="UTF-8"?>
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
    </ConsultarNfseRpsEnvio>`;
export default ConsultaNfsePorRps;