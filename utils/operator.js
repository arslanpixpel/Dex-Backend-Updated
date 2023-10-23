// Utils
// import {
//   invokeContract,
//   updateContract,
// } from "../contract-models/ConcordiumContractClient";
// import { toBigIntContractAddress, toParamContractAddress } from "./format";
// import { PixpelSwapDeserializer } from "../contract-models/PixpelSwapDeserializer";
// import { SchemaType } from "@concordium/browser-wallet-api-helpers";
// import PixpelSwapJsonSchema from "../smartcontract/pixpel_swap_schema.json";
// import {
//   CIS2_CONTRACT_METHODS,
//   PIXPEL_CONTRACT_METHODS,
// } from "../contract-models/config";
// import { PIXPEL_SWAP_CONTRACT_INFO } from "../smartcontract/contractsInfo";
// import { PIXPEL_CONTRACT_ADDRESS } from "../config/main";

const {
  invokeContract,
  updateContract,
} = require("../contract-models/ConcordiumContractClient");
const { toBigIntContractAddress, toParamContractAddress } = require("./format");
const PixpelSwapDeserializer = require("../contract-models/PixpelSwapDeserializer");
// const {
//   SchemaType,
// } = require("../node_modules/@concordium/browser-wallet-api-helpers");
const { SchemaType } = require("@concordium/node-sdk");
// const { SchemaType } = require("@concordium/browser-wallet-api-node");
// const { SchemaType } = require("@concordium/browser-wallet-api");
const PixpelSwapJsonSchema = require("../smartcontract/pixpel_swap_schema.json");
const {
  CIS2_CONTRACT_METHODS,
  PIXPEL_CONTRACT_METHODS,
} = require("../contract-models/config");
const { PIXPEL_SWAP_CONTRACT_INFO } = require("../smartcontract/contractsInfo");
const { PIXPEL_CONTRACT_ADDRESS } = require("../config/main");

/**
 *
 * @param provider Provider
 * @param {string} account
 * @param {Object} tokenAddress Token Address.
 * @param  {number}  tokenAddress.index    Token Address index
 * @param  {number}  tokenAddress.subindex    Token Address subindex
 * @param {Object} contractAddress Contract Address.
 * @param  {bigint}  contractAddress.index    Contract Address index
 * @param  {bigint}  contractAddress.subindex    Contract Address subindex
 * @param [contractName] Name of the Contract.
 */
const updateOperator = async ({
  provider,
  account,
  tokenAddress,
  contractAddress = PIXPEL_CONTRACT_ADDRESS,
  contractName,
}) => {
  const contractInfo = {
    ...PIXPEL_SWAP_CONTRACT_INFO,
    ...(contractName && { contractName }),
    serializationContractName: PIXPEL_SWAP_CONTRACT_INFO.contractName,
    schemaWithContext: {
      type: SchemaType.Parameter,
      value: PixpelSwapJsonSchema.entrypoints.updateOperator.parameter,
    },
  };

  const returnedValue = await invokeContract(
    provider,
    contractInfo,
    toBigIntContractAddress(tokenAddress),
    PIXPEL_CONTRACT_METHODS.operatorOf,
    [
      {
        owner: {
          Account: [account],
        },
        address: {
          Contract: [toParamContractAddress(contractAddress)],
        },
      },
    ]
  );

  const isOperator = new PixpelSwapDeserializer(returnedValue).readOperatorOf();

  if (isOperator) return;

  await updateContract(
    provider,
    contractInfo,
    [
      {
        operator: {
          Contract: [toParamContractAddress(contractAddress)],
        },
        update: { Add: [] },
      },
    ],
    account,
    toBigIntContractAddress(tokenAddress),
    CIS2_CONTRACT_METHODS.updateOperator
  );
};

module.exports = {
  updateOperator,
};
