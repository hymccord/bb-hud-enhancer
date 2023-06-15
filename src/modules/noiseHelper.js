import { getHUD, getNoiseMeter } from '../domNodes';
import { Templates } from '../templates';
import { getEnhancerSetting } from '../settings';
import { getProjectedAvgNoise, getProjectedMaxNoise, getProjectedMinNoise } from '../util/castle';

/** @type {NoiseHelper} */
let _noiseHelper;

/**
 * @param {User} data
 */
export function addNoiseHelper(data) {
  if (!getEnhancerSetting('enableNoisehelper')) {
    return;
  }

  const container = getHUD();
  _noiseHelper = new NoiseHelper(container);
  _noiseHelper.render(data);
}

/**
 * @param {User} data
 */
export function updateNoiseHelper(data) {
  if (!_noiseHelper) {
    return;
  }

  _noiseHelper.update(data);
}

class NoiseHelper {
  /** @type {JQuery<HTMLElement>} */
  _container;

  /**
   * @param {JQuery<HTMLElement>} container
   */
  constructor(container) {
    this._container = container;
  }

  /**
   * @param {User} data
   */
  render(data) {
    const atts = data.enviroment_atts;
    if (!atts.in_castle) {
      return;
    }

    if (atts.castle.is_boss_chase) {
      return;
    }


    this._container = getHUD();
    this.#intializeAllArrows();

    this.update(data);
  }

  /**
   * @param {User} data
   */
  update(data) {
    const atts = data.enviroment_atts;
    if (atts.castle.is_boss_chase) {
      return;
    }

    const noiseMeter = getNoiseMeter(this._container);
    const meterWidth = noiseMeter.width() ?? 457;

    // Min
    let totalProjectedNoise = getProjectedMinNoise(data);
    let triangle = $('.bountifulBeanstalkCastleView__noiseMeterArrow.bountifulBeanstalkCastleView__noiseMeterArrow--projectedMin', this._container);

    if (triangle.length === 0) {
      this.#intializeAllArrows();
      triangle = $('.bountifulBeanstalkCastleView__noiseMeterArrow.bountifulBeanstalkCastleView__noiseMeterArrow--projectedMin', this._container);
    }

    triangle.css('left',
      this.#getProjectedNoisePercent(atts, totalProjectedNoise) * meterWidth
    );

    // Avg
    totalProjectedNoise = getProjectedAvgNoise(data);
    triangle = $('.bountifulBeanstalkCastleView__noiseMeterArrow.bountifulBeanstalkCastleView__noiseMeterArrow--projectedAvg', this._container);
    triangle.css('left',
      this.#getProjectedNoisePercent(atts, totalProjectedNoise) * meterWidth
    );

    // Max
    totalProjectedNoise = getProjectedMaxNoise(data);
    triangle = $('.bountifulBeanstalkCastleView__noiseMeterArrow.bountifulBeanstalkCastleView__noiseMeterArrow--projectedMax', this._container);
    triangle.css('left',
      this.#getProjectedNoisePercent(atts, totalProjectedNoise) * meterWidth
    );

    this.updateToolTips(data);
  }

  /**
   * @param {User} data
  */
  updateToolTips(data) {
    const noiseMeterContainer = $(
      '.bountifulBeanstalkCastleView__noiseMeter',
      this._container
    );

    const noiseMeterTooltip = $('.mousehuntTooltip', noiseMeterContainer);
    if (!data.enviroment_atts.castle.is_boss_chase) {
      const minNoise = getProjectedMinNoise(data);
      const avgNoise = getProjectedAvgNoise(data);
      const maxNoise = getProjectedMaxNoise(data);
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
   * @param {number} totalProjectedNoise
   * @returns {number}
   */
  #getProjectedNoisePercent(data, totalProjectedNoise) {
    const projectedNoisePercent = totalProjectedNoise / data.castle.max_noise_level;
    return Math.min(1, projectedNoisePercent);
  }

  #intializeAllArrows() {
    const noiseMeter = getNoiseMeter(this._container);

    this.#initNoiseArrow(
      noiseMeter,
      'bountifulBeanstalkCastleView__noiseMeterArrow--projectedMin'
    );

    this.#initNoiseArrow(
      noiseMeter,
      'bountifulBeanstalkCastleView__noiseMeterArrow--projectedAvg'
    );

    this.#initNoiseArrow(
      noiseMeter,
      'bountifulBeanstalkCastleView__noiseMeterArrow--projectedMax'
    );
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
