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

async function transferBack() {
  try {
    const insecureCredentials = credentials.createInsecure();
    const client = createConcordiumClient(
      "node.testnet.concordium.com",
      20000,
      insecureCredentials
    );
    // console.log(client, "CLIENT DATA");

    const res = await axios.get("https://backend.pixpel.io/nfts/getAll");
    // console.log(res.data);
    const data = res.data.data;

    for (const val of data) {
      // const find = val.secondary_owner?.filter((val) => val.insurance === true);
      const currentDate = new Date();
      const formattedCurrentDate = currentDate.toISOString().slice(0, 10);
      const find = val.secondary_owner?.filter(
        (val) =>
          val.insurance === true &&
          val.insurance_expirydate === formattedCurrentDate
      );
      console.log(find, "DATA");

      for (const owner of find) {
        try {
          const INDEX = parseInt(val?.contact_address || 7632);
          const walletFile = fs.readFileSync(
            "./4dgSpWaZf4Z5yDFE5hb6XpaioDv6kao7UF3wvZiMbFkynSdh1A.export",
            "utf8"
          );
          const walletExport = parseWallet(walletFile);
          const sender = new AccountAddress(walletExport.value.address);
          const nextNonce = await client.getNextAccountNonce(sender);
          const header = {
            expiry: new TransactionExpiry(new Date(Date.now() + 3600000)),
            nonce: nextNonce.nonce,
            sender,
          };
          const ab = val.insurance_per_hour
            ? val.insurance_per_hour * 1000000
            : 1;
          const parse = {
            nft_contract_address: {
              index: INDEX,
              subindex: 0,
            },
            token_id: `${val.token_id}`,
            owner: `${val.primary_owner}`,
            to: `${owner.wallet}`,
            quantity: "1",
          };
          console.log(parse, "parse data");
          const parameter = serializeUpdateContractParameters(
            MARKET_NFT.contractName,
            "transfer_back",
            parse,
            MARKET_NFT.schemaBuffer,
            SchemaVersion.V1
          );
          console.log(parameter, "Parameter");
          const tokenTransfer = {
            amount: new CcdAmount(BigInt(ab)),
            address: {
              index: 7955n,
              subindex: 0n,
            },
            receiveName: "pixpel-nft-marketplace.transfer_back",
            message: parameter,
            maxContractExecutionEnergy: BigInt("100000"),
          };
          const accountTransaction = {
            header,
            payload: tokenTransfer,
            type: AccountTransactionType.Update,
          };
          console.log(accountTransaction, "ACCOUNT TRANSACTION");
          const signer = buildAccountSigner(walletExport);
          console.log(signer, "signature 1");
          const signature = await signTransaction(accountTransaction, signer);
          console.log(signature, "signature 2");

          // Send transaction and wait for its completion before proceeding
          const transactionHash = await client.sendAccountTransaction(
            accountTransaction,
            signature
          );
          console.log("Transaction Hash:", transactionHash);
          const status = await client.waitForTransactionFinalization(
            transactionHash
          );
          console.log("Transaction Status:", status);

          // Add a delay before starting the next transaction
          // Adjust this delay according to your requirements
          await new Promise((resolve) => setTimeout(resolve, 5000)); // 2 seconds delay
        } catch (e) {
          console.error("Error transferring back:", e.message);
        }
      }
    }
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
}

module.exports = {
  transferBack,
};
