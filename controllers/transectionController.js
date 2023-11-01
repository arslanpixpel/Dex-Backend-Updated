const fs = require("fs");
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
} = require("@concordium/node-sdk");
// const {
//   detectConcordiumProvider,
// } = require("@concordium/browser-wallet-api-helpers");
// const {
//   BrowserWalletConnector,
//   WalletConnectConnector,
//   WalletConnection,
//   WalletConnectionDelegate,
// } = require("@concordium/wallet-connectors");

const { credentials } = require("@grpc/grpc-js");
const { json } = require("body-parser");
// const { Provider } = require("@concordium/node-sdk");
const { updateOperator } = require("../utils/operator");
const {
  updateContract,
} = require("../contract-models/ConcordiumContractClient");
const {
  PIXPEL_SWAP_CONTRACT_INFO,
  CIS2_MULTI_CONTRACT_INFO,
} = require("../smartcontract/contractsInfo");
const {
  PIXPEL_CONTRACT_ADDRESS,
  MAX_ENERGY,
  CCD_DECIMALS,
} = require("../config/main");
const { PIXPEL_CONTRACT_METHODS } = require("../contract-models/config");
const { getTokenRawAmount } = require("../utils/format");
const LimitModel = require("../models/limitModel");

const handleTransaction = async () => {
  // const client = createConcordiumClient();
  const insecureCredentials = credentials.createInsecure();
  const client = createConcordiumClient(
    "node.testnet.concordium.com",
    20000,
    insecureCredentials
  );

  const walletFile = fs.readFileSync(
    "./4D3RtGf7zbg7JtBrrsjXVuTMCNgDcnr5M1TKpXqTTBtHENTWtR.export",
    // "./3NQJpBY6L8FofGLxo37w2taX3R8apCRmK7eQnbZK3EBnvoew1U.export",
    "utf8"
  );
  const walletExport = parseWallet(walletFile);
  const sender = new AccountAddress(walletExport.value.address);

  const toAddress = new AccountAddress(
    "3NQJpBY6L8FofGLxo37w2taX3R8apCRmK7eQnbZK3EBnvoew1U"
    // "4D3RtGf7zbg7JtBrrsjXVuTMCNgDcnr5M1TKpXqTTBtHENTWtR"
  );

  try {
    const nextNonce = await client.getNextAccountNonce(sender);
    const header = {
      expiry: new TransactionExpiry(new Date(Date.now() + 3600000)),
      nonce: nextNonce.nonce,
      sender,
    };

    const simpleTransfer = {
      amount: new CcdAmount(BigInt("1")),
      toAddress,
    };

    const accountTransaction = {
      header,
      payload: simpleTransfer,
      type: AccountTransactionType.Transfer,
    };

    const signer = buildAccountSigner(walletExport);
    // console.log(accountTransaction, "accountTransaction");
    // console.log(signer, "signer");
    const signature = await signTransaction(accountTransaction, signer);

    const transactionHash = await client.sendAccountTransaction(
      accountTransaction,
      signature
    );

    const status = await client.waitForTransactionFinalization(transactionHash);
    // console.log(status, "status");

    return status;
  } catch (error) {
    throw new Error(`Error processing the transaction: ${error.message}`);
  }
};

// const tokenInfo = {
//   id: "6514433ab34752ddb4dbefb2",
//   symbol: "Token 1B / 77",
//   images: {
//     thumbnail: {
//       url: "https://concordium-servernode.dev-site.space/api/v1/image/token-1b-77.png",
//     },
//     display: {
//       url: "https://concordium-servernode.dev-site.space/api/v1/image/token-1b-77.png",
//     },
//     artifact: {
//       url: "https://concordium-servernode.dev-site.space/api/v1/image/token-1b-77.png",
//     },
//   },
//   address: {
//     index: 4236,
//     subindex: 0,
//   },
//   tokenId: "77",
//   contractName: "cis2_multi",
//   decimals: 6,
// };

// const tokenInfo2 = {
//   id: "6515644d7a6527176a10a689",
//   symbol: "Pixpel testnet Token",
//   images: {
//     thumbnail: {
//       url: "https://firebasestorage.googleapis.com/v0/b/pixpel-95355.appspot.com/o/logo.png?alt=media&token=90cebb24-2a67-4b6c-8cf7-1b8815aa6474",
//     },
//     display: "",
//     artifact: "",
//   },
//   address: {
//     index: 5112,
//     subindex: 0,
//   },
//   tokenId: "01",
//   contractName: "Dummy_Token",
//   decimals: "",
// };

// const handleTransactiontoken = async () => {
//   // const client = createConcordiumClient();
//   // console.log(tokenData, "tokenDataFromPayload");
//   // console.log(tokenamount, "tokenamountFromPayload");
//   const insecureCredentials = credentials.createInsecure();
//   const client = createConcordiumClient(
//     "node.testnet.concordium.com",
//     20000,
//     insecureCredentials
//   );

//   const walletFile = fs.readFileSync(
//     "./3NQJpBY6L8FofGLxo37w2taX3R8apCRmK7eQnbZK3EBnvoew1U.export",
//     "utf8"
//   );
//   const walletExport = parseWallet(walletFile);
//   const sender = new AccountAddress(walletExport.value.address);

//   const toAddress = new AccountAddress(
//     "4D3RtGf7zbg7JtBrrsjXVuTMCNgDcnr5M1TKpXqTTBtHENTWtR"
//   );

//   try {
//     const nextNonce = await client.getNextAccountNonce(sender);
//     const header = {
//       expiry: new TransactionExpiry(new Date(Date.now() + 3600000)),
//       nonce: nextNonce.nonce,
//       sender,
//     };

//     const tokenTransfer = {
//       amount: new CcdAmount(BigInt(4)),
//       toAddress,
//       tokenId: tokenInfo2.tokenId,
//       contractAddress: tokenInfo2.address.toString(),
//     };
//     // const tokenTransfer = {
//     //   //  amount: new CcdAmount(BigInt(76.057583 * 10 ** tokenInfo.decimals)),
//     //   amount: new CcdAmount(BigInt(10), tokenInfo.decimals),
//     //   toAddress,
//     //   tokenId: tokenInfo.tokenId,
//     //   contractAddress: tokenInfo.address.toString(),
//     // };

//     const accountTransaction = {
//       header,
//       payload: tokenTransfer,
//       type: AccountTransactionType.Update,
//     };

//     const signer = buildAccountSigner(walletExport);
//     const signature = await signTransaction(accountTransaction, signer);

//     const transactionHash = await client.sendAccountTransaction(
//       accountTransaction,
//       signature
//     );

//     const status = await client.waitForTransactionFinalization(transactionHash);
//     console.log(status, "status");

//     return status;
//   } catch (error) {
//     throw new Error(`Error processing the transaction: ${error.message}`);
//   }
// };
const handleTransactiontoken = async ({ a, b, c, _id, d }) => {
  try {
    const insecureCredentials = credentials.createInsecure();
    const client = createConcordiumClient(
      "node.testnet.concordium.com",
      20000,
      insecureCredentials
    );

    const walletFile = fs.readFileSync(
      process.env.PRIVATE_KEY_PATH ||
        // "./4D3RtGf7zbg7JtBrrsjXVuTMCNgDcnr5M1TKpXqTTBtHENTWtR.export",
        "./3NQJpBY6L8FofGLxo37w2taX3R8apCRmK7eQnbZK3EBnvoew1U.export",
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
    const parameter = serializeUpdateContractParameters(
      "pixpel_swap",
      "ccdToTokenSwap",
      a,
      PIXPEL_SWAP_CONTRACT_INFO.schemaBuffer
    );
    const tokenTransfer = {
      amount: new CcdAmount(BigInt(`${c}`)),
      address: {
        index: 4350n,
        subindex: 0n,
      },
      receiveName: "pixpel_swap.ccdToTokenSwap",
      message: parameter,
      maxContractExecutionEnergy: BigInt("30000"),
    };

    const accountTransaction = {
      header,
      payload: tokenTransfer,
      type: AccountTransactionType.Update,
    };

    const signer = buildAccountSigner(walletExport);
    const signature = await signTransaction(accountTransaction, signer);
    const transactionHash = await client.sendAccountTransaction(
      accountTransaction,
      signature
    );

    const status = await client.waitForTransactionFinalization(transactionHash);
    const Schema = await client.getEmbeddedSchema(
      (
        await client.getInstanceInfo({
          index: BigInt(d.address.index),
          subindex: 0n,
        })
      ).sourceModule
    );
    console.log(Schema, "Schema");
    const parameter2 = serializeUpdateContractParameters(
      d.contractName,
      "transfer",
      b,
      Schema
    );
    console.log(parameter2, "parameter2");

    const tokenTransfer2 = {
      amount: new CcdAmount(BigInt(`0`), 6),
      address: {
        index: BigInt(d.address.index),
        subindex: 0n,
      },
      receiveName: `${d.contractName}.transfer`,
      message: parameter2,
      maxContractExecutionEnergy: BigInt("30000"),
    };
    const nextNonce2 = await client.getNextAccountNonce(sender);
    const header2 = {
      expiry: new TransactionExpiry(new Date(Date.now() + 3600000)),
      nonce: nextNonce2.nonce,
      sender,
    };
    const accountTransaction2 = {
      header: header2,
      payload: tokenTransfer2,
      type: AccountTransactionType.Update,
    };
    console.log(accountTransaction2, "accountTransaction2");
    const signature2 = await signTransaction(accountTransaction2, signer);
    const transactionHash2 = await client.sendAccountTransaction(
      accountTransaction2,
      signature2
    );
    const status2 = await client.waitForTransactionFinalization(
      transactionHash2
    );

    console.log(status2, "status2");

    if (!status2.summary.rejectReason) {
      await LimitModel.updateOne({ _id }, { paid: true });
    }

    return {
      hash: "status.summary.hash",
    };
  } catch (error) {
    throw new Error(`Error processing the transaction: ${error.message}`);
  }
};

const convertBigIntToString = (obj) => {
  for (const key in obj) {
    if (typeof obj[key] === "bigint") {
      obj[key] = `${obj[key].toString()}n`;
    } else if (typeof obj[key] === "object") {
      convertBigIntToString(obj[key]);
    }
  }
};

const transectiontokens = async (req, res) => {
  try {
    const status = await handleTransactiontoken(req.body);
    res.status(200).send({ status });
  } catch (error) {
    // console.log(error);
  }
};

const transactionController = async (req, res) => {
  try {
    // const cli = req.body;
    const status = await handleTransaction();
    const responce = convertBigIntToString(status);

    res.status(200).send({ responce });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const swapTokenToCcd = async ({
  tokenData,
  amountFrom,
  amountTo,
  provider,
  account,
}) => {
  const { address, decimals, tokenId, contractName } = tokenData;

  await updateOperator({
    provider,
    account,
    tokenAddress: address,
    contractName,
  });

  return updateContract(
    provider,
    PIXPEL_SWAP_CONTRACT_INFO,
    {
      token: { address, id: tokenId },
      token_sold: getTokenRawAmount(amountFrom, decimals).toString(),
      min_ccd_amount: getTokenRawAmount(amountTo, CCD_DECIMALS).toString(),
    },
    account,
    PIXPEL_CONTRACT_ADDRESS,
    PIXPEL_CONTRACT_METHODS.tokenToCcdSwap,
    MAX_ENERGY
  );
};

const swapCcdToToken = async ({
  tokenData,
  amountFrom,
  amountTo,
  provider,
  account,
}) => {
  const { address, decimals, tokenId } = tokenData;
  // console.log(decimals, "dsdwdedewe");

  return updateContract(
    provider,
    PIXPEL_SWAP_CONTRACT_INFO,
    {
      token: { address, id: tokenId },
      min_token_amount: getTokenRawAmount(amountTo, decimals || 6).toString(),
    },
    account,
    PIXPEL_CONTRACT_ADDRESS,
    PIXPEL_CONTRACT_METHODS.ccdToTokenSwap,
    MAX_ENERGY,
    amountFrom
  );
};

const swapTokenToToken = async ({
  tokenFrom,
  tokenTo,
  amountFrom,
  amountTo,
  provider,
  account,
}) => {
  await updateOperator({
    provider,
    account,
    tokenAddress: tokenFrom.address,
    contractName: tokenFrom.contractName,
  });

  return updateContract(
    provider,
    PIXPEL_SWAP_CONTRACT_INFO,
    {
      token: { address: tokenFrom.address, id: tokenFrom.tokenId },
      purchased_token: { address: tokenTo.address, id: tokenTo.tokenId },
      token_sold: getTokenRawAmount(
        amountFrom,
        tokenFrom.decimals || 6
      ).toString(),
      min_purchased_token_amount: getTokenRawAmount(
        amountTo,
        tokenTo.decimals || 6
      ).toString(),
    },
    account,
    PIXPEL_CONTRACT_ADDRESS,
    PIXPEL_CONTRACT_METHODS.tokenToTokenSwap,
    MAX_ENERGY
  );
};

const handleswap = async (req, res) => {
  const { amountFrom, amountTo, account, provider, tokenFrom, tokenTo } =
    req.body;

  // const getProvider = (privateKey) => {
  //   if (!privateKey) {
  //     throw new Error("Private key is required to create a provider.");
  //   }

  //   const providernew = Provider({
  //     privateKey,
  //   });

  //   return providernew;
  // };

  // const privateKey = process.env.WALLET_PRIVATE_KEY;
  // try {
  //   const providerInstance = getProvider(privateKey);
  //   console.log("Provider created:", providerInstance);
  // } catch (error) {
  //   console.error("Error creating provider:", error.message);
  // }
  // if (!account || !provider) return;
  // const { tokenFrom, tokenTo } = getState().swap;
  // const newprovider = JSON.parse(provider);
  const visitedObjects = new WeakSet();
  function replacer(key, value) {
    if (typeof value === "object" && value !== null) {
      if (visitedObjects.has(value)) {
        return "[Circular Reference]";
      }

      visitedObjects.add(value);
    }

    return value;
  }

  // const newprovider = JSON.parse(provider);
  const newprovider = JSON.stringify(provider, replacer, 2);
  // const newprovider = JSON.parse(provider);
  // console.log(
  //   amountFrom,
  //   amountTo,
  //   account,
  //   newprovider,
  //   tokenFrom,
  //   tokenTo,
  //   "Payload",
  // );
  switch (true) {
    case Boolean(tokenFrom.address && !tokenTo.address):
      swapTokenToCcd({
        tokenData: tokenFrom,
        amountFrom,
        amountTo,
        newprovider,
        account,
      });
      break;

    case Boolean(!tokenFrom.address && tokenTo.address):
      swapCcdToToken({
        tokenData: tokenTo,
        amountFrom,
        amountTo,
        newprovider,
        account,
      });
      break;

    case Boolean(tokenFrom.address && tokenTo.address):
      swapTokenToToken({
        tokenFrom,
        tokenTo,
        amountFrom,
        amountTo,
        newprovider,
        account,
      });
      break;

    default:
      res.status(400).send("Invalid swap parameters");
  }

  res.status(200).send("Swap request received");
};

const swaptransaction = async () => {
  const responce = await handleswap();
  console(responce, "responce");

  return json(responce);
};

async function createConcordiumClientfunc(req, res) {
  try {
    const insecureCredentials = credentials.createInsecure();
    const client = createConcordiumClient(
      "node.testnet.concordium.com",
      20000,
      insecureCredentials
    );

    const visitedObjects = new Set();

    const jsonString = JSON.stringify(client, (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (visitedObjects.has(value)) {
          return "[Circular Reference]";
        }

        visitedObjects.add(value);
      }

      return value;
    });
    // console.log(client, "client");
    // console.log(jsonString, "stringobj");
    res.json({ jsonString });
  } catch (error) {
    return null;
  }
}
module.exports = {
  transactionController,
  handleswap,
  swaptransaction,
  handleTransactiontoken,
  transectiontokens,
  createConcordiumClientfunc,
};
