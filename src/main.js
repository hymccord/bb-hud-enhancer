import styles from './style.css';
import { addStyles, createPopup } from './utils';
import { log } from './logging';
import { Templates } from './templates';
import { NoiseHelper } from './noiseHelper';

log('loaded!');

let initialized = false;
/** @type {JQuery<HTMLElement>} */
let _container;
/** @type {NoiseHelper} */
let _noiseHelper;

function getLocation() {
  return user.environment_name;
}

function isAtBountifulBeanstalk() {
  return getLocation() == 'Bountiful Beanstalk';
}

/**
 * @param {User} user
 */
function updateAll(user) {
  // updateCrafting
  _noiseHelper.update(user.enviroment_atts);
  // updateRemembrall
}

function addNoiseHelper() {
  _noiseHelper = new NoiseHelper();
  _noiseHelper.render(user.enviroment_atts);
}

function addRemembrall() {
  _container.append(
    // @ts-ignore
    $(Mustache.render(Templates.HistoryButton, {}))
  );

  $('.bb-hud-enh-remembrall-button')
    .off('click')
    .on('click', showRemembrall);
}

function showRemembrall() {
  createPopup({
    title: 'Remembrall!',
    content: 'Hello, World!',
    className: 'fabledForestDialog',
    show: true
  });
}

function initialize() {
  _container = $('.headsUpDisplayBountifulBeanstalkView');

  addStyles(styles, 'bb-hud-enh');
  addNoiseHelper();
  addRemembrall();

  initialized = true;
}

function main() {
  if (isAtBountifulBeanstalk()) {
    initialize();
  }

  eventRegistry.addEventListener('ajax_response', (data) => {

    if (!isAtBountifulBeanstalk()) {
      return;
    }

    if (initialized) {
      updateAll(data.user);
      return;
    }

    initialize();
  }, undefined, false, 10);
}

try {
  main();
} catch (e) {
  log(e);
}
