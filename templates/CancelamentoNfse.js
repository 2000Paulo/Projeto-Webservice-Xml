// Arquivo: templates/CancelamentoNfse.js
const CancelamentoNfse = `<?xml version="1.0" encoding="UTF-8"?>
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
    </CancelarNfseEnvio>`;
export default CancelamentoNfse;
