
export function getHUD() {
  return $('.headsUpDisplayBountifulBeanstalkView');
}

/**
 *
 * @param {JQuery<HTMLElement>} container
 * @returns
 */
export function getNoiseMeter(container) {
  return $('.bountifulBeanstalkCastleView__noiseMeter', container);
}
