import { addSetting, addSettingsTab, getSetting } from './util/mouseplace';

export const SettingsIdentifier = 'bb-hud-enh-settings';

/**
 * @type {Record<BbHudEnhSetting,{name: string, id: string, defaultValue: boolean, description?: string}>}
 */
export const SETTINGS = {
  enableCraftalyzer: {
    id: 'bb-hud-enable-craftalyzer',
    name: 'Bean Craftalyzer',
    defaultValue: true,
    description: 'Show amount of beans that can be crafted given current ingrediants.'
  },
  enableNoisehelper: {
    id: 'bb-hud-enable-noisehelper',
    name: 'Noise Helper',
    defaultValue: true,
    description: 'Show projected noise amounts below the noise meter and in the tooltip.'
  },
  enableHarpmeout: {
    id: 'bb-hud-enable-harpmeout',
    name: 'Harp Me Out',
    defaultValue: true,
    description: 'Show the Max/Avg/Min amount buttons in the Harp playing dialog.'
  },
};

/**
 * @param {BbHudEnhSetting} id
 */
export function getEnhancerSetting(id) {
  const setting = SETTINGS[id];
  return getSetting(setting.id, setting.defaultValue, SettingsIdentifier);
}

export function addSettings() {
  addSettingsTab();

  for (const [, value] of Object.entries(SETTINGS)) {
    addSetting(value.name, value.id, value.defaultValue, value.description, {id: 'bb-hud-enh-settings', name: 'Bountiful Beanstalk HUD Enhancer'});
  }
}
