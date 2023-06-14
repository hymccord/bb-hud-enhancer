import { getEnhancerSetting } from '../settings';
import { Templates } from '../templates';
import { getProjectedAvgNoise, getProjectedMaxNoise, getProjectedMinNoise } from '../util/castle';
import { onOverlayChange } from '../util/mouseplace';

// eslint-disable-next-line no-unused-vars
let _harpMeOut;

export function addHarpMeOut() {
  if (!getEnhancerSetting('enableHarpmeout')) {
    return;
  }

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
    const minNoise = getProjectedMinNoise(user);
    const stringsToPlay = data.max_noise_level - minNoise;
    setVolume(stringsToPlay);
  }

  function handleAvgButton() {
    const data = getData().castle;
    const avgNoise = getProjectedAvgNoise(user);
    const stringsToPlay = data.max_noise_level - avgNoise;
    setVolume(stringsToPlay);
  }

  function handleMinButton() {
    const data = getData().castle;
    const maxNoise = getProjectedMaxNoise(user);
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
