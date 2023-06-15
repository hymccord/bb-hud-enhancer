import './comment';
import styles from './style.css';
import { addStyles, createPopup } from './util/mouseplace';
import { log } from './util/logging';
import { Templates } from './templates';
import { addSettings } from './settings';
import { addCraftalyzer, updateCraftalyzer } from './modules/craftalyzer';
import { addNoiseHelper, updateNoiseHelper } from './modules/noiseHelper';
import { addHarpMeOut } from './modules/harpMeOut';

log('loaded!');

let initialized = false;
/** @type {JQuery<HTMLElement>} */
let _container;

/** @param {User} user */
function getLocation(user) {
  return user.environment_name;
}

/** @param {User} user */
function isAtBountifulBeanstalk(user) {
  return getLocation(user) == 'Bountiful Beanstalk';
}

/** @param {User} user */
function updateAll(user) {
  updateCraftalyzer(user);
  updateNoiseHelper(user);
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

  addSettings();
  addStyles(styles, 'bb-hud-enh');
  addCraftalyzer(user);
  addNoiseHelper(user);
  // addRemembrall();
  addHarpMeOut();

  initialized = true;
}

function main() {
  if (isAtBountifulBeanstalk(user)) {
    initialize();
  }

  eventRegistry.addEventListener('ajax_response', (data) => {
    try {
      if (!isAtBountifulBeanstalk(data.user)) {
        return;
      }

      if (initialized) {
        updateAll(data.user);
        return;
      }

      initialize();
    } catch (e) {
      log(e);
    }
  }, undefined, false, 10);
}

try {
  main();
} catch (e) {
  log(e);
}
