import { getOverallCatchRate } from './cre';
import { getHUD, getNoiseMeter } from './domNodes';
import { Templates } from './templates';
import { MiceARs, MicePowers} from './powers';

export class NoiseHelper {
  /** @type {JQuery<HTMLElement>} */
  // @ts-ignore
  _container;

  /**
   * @param {User} data
   */
  render(data) {
    if (this._container) {
      return;
    }

    const atts = data.enviroment_atts;
    if (atts.castle.is_boss_chase) {
      return;
    }

    this._container = getHUD();
    const noiseMeter = getNoiseMeter(this._container);
    const noiseMeterWidth = noiseMeter.width() ?? 457;

    let noiseArrow = this.#initNoiseArrow(
      noiseMeter,
      'bountifulBeanstalkCastleView__noiseMeterArrow--projectedMin'
    );
    noiseArrow.css('left',
      this.#getProjectedNoisePercent(atts, atts.castle.projected_noise.actual_min) * noiseMeterWidth
    );

    noiseArrow = this.#initNoiseArrow(
      noiseMeter,
      'bountifulBeanstalkCastleView__noiseMeterArrow--projectedAvg'
    );
    const cre = this.#calculateCatchRate(data);
    const noisePerHunt =
        atts.castle.projected_noise.actual_min * (1 - cre) +
        atts.castle.projected_noise.actual_max * cre;
    noiseArrow.css('left',
      this.#getProjectedNoisePercent(atts, noisePerHunt) * noiseMeterWidth
    );

    noiseArrow = this.#initNoiseArrow(
      noiseMeter,
      'bountifulBeanstalkCastleView__noiseMeterArrow--projectedMax'
    );
    noiseArrow.css('left',
      this.#getProjectedNoisePercent(atts, atts.castle.projected_noise.actual_max) * noiseMeterWidth
    );

    this.updateToolTips(data, noisePerHunt);
  }

  /**
   * @param {User} data
   */
  update(data) {
    if (!this._container) {
      return;
    }

    const atts = data.enviroment_atts;
    if (atts.castle.is_boss_chase) {
      return;
    }

    const noiseMeter = getNoiseMeter(this._container);
    const meterWidth = noiseMeter.width() ?? 457;

    // Min
    let triangle = $('.bountifulBeanstalkCastleView__noiseMeterArrow--projectedMin', this._container);
    triangle.css('left',
      this.#getProjectedNoisePercent(atts, atts.castle.projected_noise.actual_min) * meterWidth
    );

    // Avg
    const cre = this.#calculateCatchRate(data);
    const noisePerHunt =
      atts.castle.projected_noise.actual_min * (1 - cre) +
      atts.castle.projected_noise.actual_max * cre;
    triangle = $('.bountifulBeanstalkCastleView__noiseMeterArrow--projectedAvg', this._container);
    triangle.css('left',
      this.#getProjectedNoisePercent(atts, noisePerHunt) * meterWidth
    );

    // Max
    triangle = $('.bountifulBeanstalkCastleView__noiseMeterArrow--projectedMax', this._container);
    triangle.css('left',
      this.#getProjectedNoisePercent(atts, atts.castle.projected_noise.actual_max) * meterWidth
    );

    this.updateToolTips(data, noisePerHunt);

    return atts.castle.hunts_remaining;
  }

  /**
   * @param {User} data
   * @param {number} noisePerHunt
  */

  updateToolTips(data, noisePerHunt) {
    const noiseMeterContainer = $(
      '.bountifulBeanstalkCastleView__noiseMeter',
      this._container
    );

    const noiseMeterTooltip = $('.mousehuntTooltip', noiseMeterContainer);
    if (!data.enviroment_atts.castle.is_boss_chase) {
      const castle = data.enviroment_atts.castle;
      const minNoise = castle.noise_level + castle.projected_noise.actual_min * castle.hunts_remaining;
      const avgNoise = Math.round(castle.noise_level + noisePerHunt * castle.hunts_remaining);
      const maxNoise = castle.noise_level + castle.projected_noise.actual_max * castle.hunts_remaining;
      noiseMeterTooltip.append(`
      <div style="text-align: center;">
        <br/><span class="bountifulBeanstalkCastleView__noiseMeterArrow--projectedMin">▲</span><span>: Room ends with a minimum of ${minNoise} noise.</span>
        <br/><span class="bountifulBeanstalkCastleView__noiseMeterArrow--projectedAvg">▲</span><span>: Room ends with a average of ${avgNoise} noise.</span>
        <br/><span class="bountifulBeanstalkCastleView__noiseMeterArrow--projectedMax">▲</span><span>: Room ends with a maximum of ${maxNoise} noise.</span>
      </div>
      `);
    }
  }

  /**
   *
   * @param {EnvironmentAttributes} data
   * @param {number} noisePerHunt
   * @returns {number}
   */
  #getProjectedNoisePercent(data, noisePerHunt) {
    const projectedNoisePercent = (data.castle.noise_level + data.castle.hunts_remaining * noisePerHunt) / data.castle.max_noise_level;
    return Math.min(1, projectedNoisePercent);
  }

  /**
   *
   * @param {User} data
   */
  #calculateCatchRate(data) {
    /** @type {MousePool} */
    const pool = {};

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

    const overallCR = getOverallCatchRate(data.trap_power, data.trap_luck, pool);

    return overallCR;
  }

  /**
   * @param {JQuery<HTMLElement>} parent
   * @param {string} cssClass
   */
  #initNoiseArrow(parent, cssClass) {
    const arrow = $(Templates.NoiseMeterArrow);
    arrow.addClass(cssClass);
    $(parent).append(arrow);
    arrow.css('left');
    return arrow;
  }
}
