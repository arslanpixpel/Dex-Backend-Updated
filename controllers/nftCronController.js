const { credentials } = require("@grpc/grpc-js");
const fs = require("fs");
const {
  updateContract,
} = require("../contract-models/ConcordiumContractClient");
const {
  parseWallet,
  AccountAddress,
  TransactionExpiry,
  CcdAmount,
  AccountTransactionType,
  buildAccountSigner,
  signTransaction,
  createConcordiumClient,
  serializeUpdateContractParameters,
  SchemaVersion,
} = require("@concordium/node-sdk");
const axios = require("axios");
const { MARKET_NFT } = require("../smartcontract/contractsInfo");
function transferBack() {
  const insecureCredentials = credentials.createInsecure();
  const client = createConcordiumClient(
    "node.testnet.concordium.com",
    20000,
    insecureCredentials
  );
  console.log(client, "CLIENT DATA");
  axios(`https://backend.pixpel.io/nfts/getAll`).then((res) => {
    console.log(res.data);
    const data = res.data.data;
    data?.map(async (val) => {
      const find = val?.secondary_owner?.find((val) => val.insurance === true);
      if (find) {
        try {
          const INDEX = parseInt(val ? val?.contact_address : 7632);
          const walletFile = fs.readFileSync(
            "./4dgSpWaZf4Z5yDFE5hb6XpaioDv6kao7UF3wvZiMbFkynSdh1A.export",
            "utf8"
          );

          const walletExport = parseWallet(walletFile);
          const sender = new AccountAddress(find?.wallet);
          const nextNonce = await client.getNextAccountNonce(sender);
          const header = {
            expiry: new TransactionExpiry(new Date(Date.now() + 3600000)),
            nonce: nextNonce.nonce,
            sender,
          };
          const ab = val?.insurance_per_hour ? val?.insurance_per_hour : "1";
          console.log("check 1");
          const parse = {
            nft_contract_address: {
              index: INDEX,
              subindex: 0,
            },
            token_id: `${val?.token_id}`,
            owner: `${find?.wallet}`,
            to: `${val?.primary_owner}`,
            quantity: "1",
            is_insurance: true,
          };
          const parameter = serializeUpdateContractParameters(
            MARKET_NFT.contractName,
            "transfer",
            parse,
            MARKET_NFT.schemaBuffer,
            SchemaVersion.V1
          );
          //   console.log(parameter, "Parameter");
          //   {
          //       nft_contract_address: {
          //         index: INDEX,
          //         subindex: 0,
          //       },
          //       token_id: `${val?.token_id}`,
          //       owner: `${find?.wallet}`,
          //       to: `${val?.primary_owner}`,
          //       quantity: "1",
          //       is_insurance: true,
          //     }
          const tokenTransfer = {
            amount: new CcdAmount(BigInt(`${ab}`)),
            address: {
              index: 7923n,
              subindex: 0n,
            },
            receiveName: "Market-NFT.transfer",
            message: parameter,
            maxContractExecutionEnergy: BigInt("100000"),
          };
          console.log("check 2");
          const accountTransaction = {
            header,
            payload: tokenTransfer,
            type: AccountTransactionType.Update,
          };
          console.log("check 3");
          const signer = buildAccountSigner(walletExport);
          console.log(signer, "signature 1");
          const signature = await signTransaction(accountTransaction, signer);
          console.log(signature, "signature 2");
          console.log("check 4");
          const transactionHash = await client.sendAccountTransaction(
            accountTransaction,
            signature
          );
          console.log("check 5");
          const status = await client.waitForTransactionFinalization(
            transactionHash
          );

          return status;
        } catch (e) {
          console.log(e.message, "Error");
        }
      } else {
        console.log("No Insurance");
      }
    });
  });
}

module.exports = {
  transferBack,
};
