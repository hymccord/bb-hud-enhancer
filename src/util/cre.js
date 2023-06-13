
/**
 * @param {number} power
 * @param {number} luck
 * @param {number} mPower Mouse power
 * @param {number} mEff Mouse effectiveness
 */
export function getCatchRate(power, luck, mPower, mEff) {
  mEff /= 100;
  return Math.min(1, (power * mEff + 2 * Math.pow(Math.floor(luck * Math.min(1.4, mEff)), 2)) / (mPower + power * mEff));
}

/** @type {MousePool} */
/**
 * @param {number} power
 * @param {number} luck
 * @param {MousePool} pool
 */
export function getOverallCatchRate(power, luck, pool) {
  let overallCatchRate = 0;
  let overallAR = 0;
  for (const mouseName in pool) {
    const mouse = pool[mouseName];
    const cr = getCatchRate(power, luck, mouse.power, mouse.eff);
    overallCatchRate += cr * mouse.rate;
    overallAR += mouse.rate;
  }

  return overallCatchRate / overallAR;
}
