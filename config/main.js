const CCD_DECIMALS = 6;

const PIXPEL_CONTRACT_ADDRESS = {
  index: 4350n,
  subindex: 0n,
};

const MAX_ENERGY = 30000n;

// for calculating max CCD amount, considering fee etc.
const MAX_CCD_DELTA = 120;
module.exports = {
  CCD_DECIMALS,
  PIXPEL_CONTRACT_ADDRESS,
  MAX_ENERGY,
  MAX_CCD_DELTA,
};
