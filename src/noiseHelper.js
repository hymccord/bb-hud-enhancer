import { getOverallCatchRate } from './cre';
import { getHUD, getNoiseMeter } from './domNodes';
import { Templates } from './templates';
import { MiceARs, MicePowers} from './powers';

export class NoiseHelper {
  /** @type {JQuery<HTMLElement> | undefined} */
  _container;

  /**
   * @param {EnvironmentAttributes} data
   */
  render(data) {
    if (!this._container) {
      this._container = getHUD();
      const noiseMeter = getNoiseMeter(this._container);
      const noiseMeterWidth = noiseMeter.width() ?? 457;

      let noiseArrow = this.#createNoiseArrow(
        noiseMeter,
        'bountifulBeanstalkCastleView__noiseMeterArrow--projectedMin'
      );
      noiseArrow.css('left',
        this.#getProjectedNoisePercent(data, data.castle.projected_noise.actual_min) * noiseMeterWidth
      );

      noiseArrow = this.#createNoiseArrow(
        noiseMeter,
        'bountifulBeanstalkCastleView__noiseMeterArrow--projectedAvg'
      );
      const cre = this.#calculateCatchRate(data);
      const noisePerHunt =
        data.castle.projected_noise.actual_min * (1 - cre) +
        data.castle.projected_noise.actual_max * cre;
      noiseArrow.css('left',
        this.#getProjectedNoisePercent(data, noisePerHunt) * noiseMeterWidth
      );

      noiseArrow = this.#createNoiseArrow(
        noiseMeter,
        'bountifulBeanstalkCastleView__noiseMeterArrow--projectedMax'
      );
      noiseArrow.css('left',
        this.#getProjectedNoisePercent(data, data.castle.projected_noise.actual_max) * noiseMeterWidth
      );
    }
  }

  /**
   * @param {EnvironmentAttributes} data
   */
  update(data) {
    if (!this._container) {
      return;
    }

    const noiseMeter = getNoiseMeter(this._container);
    const meterWidth = noiseMeter.width() ?? 457;

    // Min
    let triangle = $('.bountifulBeanstalkCastleView__noiseMeterArrow--projectedMin', this._container);
    triangle.css('left',
      this.#getProjectedNoisePercent(data, data.castle.projected_noise.actual_min) * meterWidth
    );

    // Avg
    const cre = this.#calculateCatchRate(data);
    const noisePerHunt =
      data.castle.projected_noise.actual_min * (1 - cre) +
      data.castle.projected_noise.actual_max * cre;
    triangle = $('.bountifulBeanstalkCastleView__noiseMeterArrow--projectedAvg', this._container);
    triangle.css('left',
      this.#getProjectedNoisePercent(data, noisePerHunt) * meterWidth
    );

    // Max
    triangle = $('.bountifulBeanstalkCastleView__noiseMeterArrow--projectedMax', this._container);
    triangle.css('left',
      this.#getProjectedNoisePercent(data, data.castle.projected_noise.actual_max) * meterWidth
    );

    return data.castle.hunts_remaining;
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
   * @param {EnvironmentAttributes} data
   */
  #calculateCatchRate(data) {
    /** @type {MousePool} */
    const pool = {};

    let cheese = user.bait_name.replace(/ Cheese$/, '');
    if (cheese.indexOf('Beanster') == -1) {
      cheese = 'Gouda';
    }

    let stage = data.castle.current_floor.name.replace(/ Floor$/, '');
    // @ts-ignore
    const population = MiceARs[user.environment_name][stage][cheese]['-'];
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

    const overallCR = getOverallCatchRate(user.trap_power, user.trap_luck, pool);

    return overallCR;
  }

  /**
   * @param {JQuery<HTMLElement>} parent
   * @param {string} cssClass
   */
  #createNoiseArrow(parent, cssClass) {
    const arrow = $(Templates.NoiseMeterArrow);
    arrow.addClass(cssClass);
    $(parent).append(arrow);
    arrow.css('left');
    return arrow;
  }
}
