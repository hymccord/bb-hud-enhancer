import { getCastleCatchRate } from '../catchRate';
import { Templates } from '../templates';
import { log } from '../util/logging';
import { onOverlayChange } from '../util/mouseplace';

// eslint-disable-next-line no-unused-vars
let _harpMeOut;

export function addHarpMeOut() {
  onOverlayChange({
    harpDialog: {
      selector: 'bountifulBeanstalkHarpStringDialogPopup',
      show: () => {
        _harpMeOut = HarpMeOut();
        _harpMeOut.render();
      },
      hide: () => {

      }
    }
  });
}

// Harp Helper.... Harp me out... heheheh
const HarpMeOut = () => {
  const self = {};
  /** @type {JQuery<HTMLElement> | null} */
  let _container = null;

  self.render = () => {
    log('rending harp me out!');

    _container = $(Templates.HarpMeOut).insertBefore('.bountifulBeanstalkPlayHarpDialogView__buttonRow');
    applyEventListeners();
  };

  function applyEventListeners() {
    if (!_container) {
      return;
    }


    $('.bountifulBeanstalkPlayHarpDialogView__maxHarpStringsButton.max', _container)
      .on('click', handleMaxButton);

    $('.bountifulBeanstalkPlayHarpDialogView__maxHarpStringsButton.avg', _container)
      .on('click', handleAvgButton);

    $('.bountifulBeanstalkPlayHarpDialogView__maxHarpStringsButton.min', _container)
      .on('click', handleMinButton);
  }

  function handleMaxButton() {
    const data = getData().castle;
    const minNoise = data.noise_level + data.projected_noise.actual_min * data.hunts_remaining;
    const stringsToPlay = data.max_noise_level - minNoise;
    setVolume(stringsToPlay);
  }

  function handleAvgButton() {
    const data = getData().castle;
    var cre = getCastleCatchRate(user);
    const noisePerHunt =
      data.projected_noise.actual_min * (1 - cre) +
      data.projected_noise.actual_max * cre;
    const avgNoise = Math.round(data.noise_level + noisePerHunt * data.hunts_remaining);
    const stringsToPlay = data.max_noise_level - avgNoise;
    setVolume(stringsToPlay);
  }

  function handleMinButton() {
    const data = getData().castle;
    const maxNoise = data.noise_level + data.projected_noise.actual_max * data.hunts_remaining;
    const stringsToPlay = data.max_noise_level - maxNoise;
    setVolume(stringsToPlay);
  }

  /**
   * @param {number} number
   */
  function setVolume(number) {
    const input = $('.bountifulBeanstalkPlayHarpDialogView__input[data-mode="plus"]');

    number = Math.max(number, 0);

    input.val(number).trigger('change');
  }

  function getData() {
    return user.enviroment_atts;
  }

  return self;
};
