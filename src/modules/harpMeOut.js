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
    const regularPlayTab = $('.bountifulBeanstalkPlayHarpDialogView__regularPlayTab');
    const buttonRow = $('.bountifulBeanstalkPlayHarpDialogView__buttonRow', regularPlayTab);
    _container = $(Templates.HarpMeOut).insertBefore(buttonRow);
    applyEventListeners();
  };

  function applyEventListeners() {
    if (!_container) {
      return;
    }

    $('.harpMeOut__buttonContainer .bountifulBeanstalkPlayHarpDialogView__maxHarpStringsButton.max', _container)
      .on('click', handleMaxButton);

    $('.harpMeOut__buttonContainer .bountifulBeanstalkPlayHarpDialogView__maxHarpStringsButton.avg', _container)
      .on('click', handleAvgButton);

    $('.harpMeOut__buttonContainer .bountifulBeanstalkPlayHarpDialogView__maxHarpStringsButton.min', _container)
      .on('click', handleMinButton);

    $('.harpMeIn__buttonContainer .bountifulBeanstalkPlayHarpDialogView__maxHarpStringsButton.max', _container)
      .on('click', handleMinusMaxButton);

    $('.harpMeIn__buttonContainer .bountifulBeanstalkPlayHarpDialogView__maxHarpStringsButton.avg', _container)
      .on('click', handleMinusAvgButton);

    $('.harpMeIn__buttonContainer .bountifulBeanstalkPlayHarpDialogView__maxHarpStringsButton.min', _container)
      .on('click', handleMinusMinButton);
  }

  function handleMaxButton() {
    const minNoise = getProjectedMinNoise(user);
    playLoudly(minNoise);
  }

  function handleAvgButton() {
    const avgNoise = getProjectedAvgNoise(user);
    playLoudly(avgNoise);
  }

  function handleMinButton() {
    const maxNoise = getProjectedMaxNoise(user);
    playLoudly(maxNoise);
  }

  function handleMinusMinButton() {
    const minNoise = getProjectedMinNoise(user);
    playSoftly(minNoise);
  }

  function handleMinusAvgButton() {
    const avgNoise = getProjectedAvgNoise(user);
    playSoftly(avgNoise);
  }

  function handleMinusMaxButton() {
    const maxNoise = getProjectedMaxNoise(user);
    playSoftly(maxNoise);
  }


  /**
   * @param {number} toNoise
   */
  function playLoudly(toNoise) {
    const data = getData().castle;
    const stringsToPlay = data.max_noise_level - toNoise;
    setLoudVolume(stringsToPlay);
  }

  /**
   * @param {number} toNoise
   */
  function playSoftly(toNoise) {
    const data = getData().castle;
    const stringsToPlay = toNoise - data.max_noise_level + 1;
    setSoftVolume(stringsToPlay);
  }

  /**
   * @param {number} number
   */
  function setLoudVolume(number) {
    const input = $('.bountifulBeanstalkPlayHarpDialogView__input[data-mode="plus"]');

    number = Math.max(number, 0);

    input.val(number).trigger('change');
  }

  /**
   * @param {number} number
   */
  function setSoftVolume(number) {
    const input = $('.bountifulBeanstalkPlayHarpDialogView__input[data-mode="minus"]');

    number = Math.max(number, 0);

    input.val(number).trigger('change');
  }

  function getData() {
    return user.enviroment_atts;
  }

  return self;
};
