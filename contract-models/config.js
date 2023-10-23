//export const JS_NODE_URL = "https://concordium-servernode.dev-site.space";
const JS_NODE_URL = "https://api.pixpel.io";
const JSON_RPC_URL = "https://json-rpc-proxy-0.dev-site.space";
const NETWORK = "testnet";
const PIXPEL_CONTRACT_METHODS = {
  // swap
  tokenToCcdAmount: "getTokenToCcdSwapAmount",
  ccdToTokenAmount: "getCcdToTokenSwapAmount",
  tokenToTokenAmount: "getTokenToTokenSwapAmount",
  tokenToCcdSwap: "tokenToCcdSwap",
  ccdToTokenSwap: "ccdToTokenSwap",
  tokenToTokenSwap: "tokenToTokenSwap",
  // liquidity
  addLiquidity: "addLiquidity",
  removeLiquidity: "removeLiquidity",
  // exchanges
  getExchanges: "getExchanges",
  // operator
  operatorOf: "operatorOf",
};
const CIS2_CONTRACT_METHODS = {
  updateOperator: "updateOperator",
  balanceOf: "balanceOf",
};

module.exports = {
  JS_NODE_URL,
  JSON_RPC_URL,
  NETWORK,
  PIXPEL_CONTRACT_METHODS,
  CIS2_CONTRACT_METHODS,
};
