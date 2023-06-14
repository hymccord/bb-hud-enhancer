import defaultConfig from './config/rollup.default.config.js';
import prodConfig from './config/rollup.prod.config.js';

export default commandLineArgs => {
  if (commandLineArgs.configProd === true) {
    return prodConfig;
  }
  return defaultConfig;
};
