// Arquivo: templates/ConsultaNfseServicoPrestado.js
const ConsultaNfseServicoPrestado = `<?xml version="1.0" encoding="UTF-8"?>
<ConsultarNfseServicoPrestadoEnvio xmlns="http://www.abrasf.org.br/ABRASF/arquivos/nfse.xsd">
   <ConsultarNfseEnvio>
      <Prestador>
         <CpfCnpj>
            <Cnpj type="N" length="14" optional="true">12345678000199</Cnpj>
            <Cpf type="N" length="11" optional="true">12345678910</Cpf>
         </CpfCnpj>
         <InscricaoMunicipal type="N" length="15" optional="true">123456</InscricaoMunicipal>
      </Prestador>
      <NumeroNfse type="N" length="15" optional="false">123456</NumeroNfse>
   </ConsultarNfseEnvio>
</ConsultarNfseServicoPrestadoEnvio>`;
export default ConsultaNfseServicoPrestado;