import { MiceARs, MicePowers } from './powers';
import { getOverallCatchRate } from './util/cre';

/**
 * Get catch rate for bb castle.
 * @param {User} data
 */
export function getCastleCatchRate(data) {
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
