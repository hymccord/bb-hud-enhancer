import { MiceARs, MicePowers } from '../powers';
import { getOverallCatchRate } from './cre';

/** @param {User} data */
export function getProjectedMinNoise(data) {
  const castle = data.enviroment_atts.castle;
  const minNoise = castle.noise_level + castle.projected_noise.actual_min * castle.hunts_remaining;

  return minNoise;
}

/** @param {User} data */
export function getProjectedAvgNoise(data) {
  const cre = getCastleCatchRate(data);
  const noisePerHunt =
    data.enviroment_atts.castle.projected_noise.actual_min * (1 - cre) +
    data.enviroment_atts.castle.projected_noise.actual_max * cre;

  const castle = data.enviroment_atts.castle;
  const avgNoise = Math.round(castle.noise_level + noisePerHunt * castle.hunts_remaining);

  return avgNoise;
}
/** @param {User} data */
export function getProjectedMaxNoise(data) {
  const castle = data.enviroment_atts.castle;
  const maxNoise = castle.noise_level + castle.projected_noise.actual_max * castle.hunts_remaining;

  return maxNoise;
}

/**
 * Get catch rate for bb castle.
 * @param {User} data
 */
function getCastleCatchRate(data) {
  /** @type {MousePool} */
  const pool = {};

  if (data.bait_name === 0) {
    return 1;
  }

  let cheese = data.bait_name.replace(/ Cheese$/, '');
  if (cheese.indexOf('Beanster') == -1) {
    cheese = 'Gouda';
  }

  let stage = data.enviroment_atts.castle.current_floor.name.replace(/ Floor$/, '');
  // @ts-ignore
  const population = MiceARs[data.environment_name][stage][cheese]['-'];
  for (const mouse in population) {
    if (mouse == 'SampleSize') {
      continue;
    }

    const rate = population[mouse];
    pool[mouse] = {
      power: MicePowers[mouse].power,
      eff: MicePowers[mouse].eff,
      rate: rate,
    };
  }

  return getOverallCatchRate(data.trap_power, data.trap_luck, pool);
}
