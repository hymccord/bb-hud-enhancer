import { getHUD } from '../domNodes';
import { getEnhancerSetting } from '../settings';
import { Templates } from '../templates';
import { log } from '../util/logging';

// TODO: replace settings
const settings = {
  upsell: {
    beanster_recipe: true,
    lavish_beanster_recipe: true,
    leaping_lavish_beanster_recipe: true,
    royal_beanster_recipe: true
  },
  ignore: {
    magic_essence_craft_item: true,
    gold_stat_item: true,
  }
};

/** @type {Craftalyzer} */
let _craftalyzer;

/** @param {User} data */
export function addCraftalyzer(data) {

  if (!getEnhancerSetting('enableCraftalyzer')) {
    return;
  }

  const recipies = getRecipies(data.enviroment_atts);
  _craftalyzer = new Craftalyzer(recipies);

  _craftalyzer.render(data, settings);
}


/** @param {User} data */
export function updateCraftalyzer(data) {
  if (!_craftalyzer) {
    return;
  }

  _craftalyzer.update(data, settings);
}

/**
 * @param {EnvironmentAttributes} atts
 */
export function getRecipies(atts) {
  /** @type {{[key: string]: Craftable}} */
  const recipies = {};
  for (const [key, value] of Object.entries(atts)) {
    if (!key.endsWith('_recipe')) {
      continue;
    }

    if (typeof value === 'object' && 'vanilla' in value) {
      // @ts-ignore
      recipies[key] = value;
    }
  }

  return recipies;
}

export class Craftalyzer {

  /** @type {{[key: string]: Recipe & {result: string}}} */
  _currentRecipies = {};
  /** @type {Map<string, string>} */
  _currentRecipeOutputsToRecipeName = new Map();

  /** @param {{[key: string]: Craftable}} recipies */
  constructor(recipies) {
    this._recipies = recipies;
  }

  /**
   * @param {User} data
   * @param {{ upsell: { [x: string]: any; }; }} settings
   */
  render(data, settings) {
    this.setCurrentRecipies(settings);

    $('.headsUpDisplayBountifulBeanstalkView__baitCraftableContainer').each((i, e) => {
      $(e).append(Templates.CraftalyzerContainer);
    });

    this.updateItems(data, settings);
  }

  /**
   * @param {User} data
   * @param {{ upsell: { [x: string]: any; }; }} settings
   */
  update(data, settings) {
    this.updateItems(data, settings);
  }

  /**
   * @param {{ upsell: { [x: string]: any; }; }} settings
   */
  setCurrentRecipies(settings) {
    this._currentRecipies = {};
    this._currentRecipeOutputsToRecipeName = new Map();
    Object.entries(this._recipies)
      .forEach(([craftableRecipeName, craftable]) => {
        let recipe = craftable.vanilla;
        if (craftable.has_upsell && settings.upsell[craftableRecipeName]) {
          recipe = craftable.upsell;
        }
        this._currentRecipies[craftableRecipeName] = {...recipe, result: craftable.result.type};
        this._currentRecipeOutputsToRecipeName.set(craftable.result.type, craftableRecipeName);
      });
  }

  /**
   * @param {User} data
   * @param {{ ignore: { [x: string]: any; }; }} settings
   */
  updateItems(data, settings) {
    const currentlyCraftable = [];
    for (const [recipeName, recipe] of Object.entries(this._currentRecipies)) {
      const currentQuantity = this.getCraftable(recipeName, data.enviroment_atts.items);

      const maxQuantity = this.getCraftableQuantityWithLimit(Infinity, recipeName, data.enviroment_atts.items, settings);
      currentlyCraftable.push({
        selector: recipe.result,
        classSelector: 'headsUpDisplayBountifulBeanstalkView__ingredientQuantity',
        quantity: `+${currentQuantity} | +${maxQuantity}`
      });
    }

    this.renderAllCraftable(currentlyCraftable);
  }

  /**
   * @param {string} recipeName
   * @param {{ [x: string]: { quantity_unformatted: number; }; }} inventoryItems
   */
  getCraftable(recipeName, inventoryItems) {
    if (!(recipeName in this._currentRecipies)) {
      log('Unknown recipe!');
    }

    const recipe = this._currentRecipies[recipeName];
    return recipe.items.reduce(function (acc, item) {
      const maxCraftable = Math.floor(
        inventoryItems[item.type].quantity_unformatted / item.required_quantity
      );
      return Math.min(acc, maxCraftable);
    }, Infinity) * recipe.action.result_quantity;
  }

  /**
   * @param {string} recipeName
   * @param {number} limit
   * @param {{ [x: string]: { quantity_unformatted: number; }; }} inventoryItems
   * @param {{ ignore: { [x: string]: any; }; }} settings
   */
  getCraftableQuantityWithLimit(limit, recipeName, inventoryItems, settings) {
    if (!(recipeName in this._currentRecipies)) {
      log('Unknown recipe!');
      return 0;
    }

    const recipe = this._currentRecipies[recipeName];

    for (const ingredient of recipe.items) {
      if (settings.ignore[ingredient.type]) {
        continue;
      }

      let availableQuantity = inventoryItems[ingredient.type].quantity_unformatted;
      const requiredQuantity = ingredient.required_quantity;

      const recursiveRecipeName = this._currentRecipeOutputsToRecipeName.get(ingredient.type);
      if (recursiveRecipeName && (availableQuantity / requiredQuantity) < limit) {
        // We dont have enough ingredients to satify craft.
        // Turn N crafts of parent item into amount of ingrediants needed/consumed
        const ingredientsNeeded = Math.max(0, limit * requiredQuantity - availableQuantity);
        const ingredientCraftsNeeded = Math.ceil(ingredientsNeeded / this._currentRecipies[recursiveRecipeName].action.result_quantity);

        const craftedQuantity = this.getCraftableQuantityWithLimit(ingredientCraftsNeeded, recursiveRecipeName, inventoryItems, settings);
        availableQuantity += craftedQuantity;
      }

      const numberOfCrafts = Math.floor(availableQuantity / requiredQuantity);
      limit = Math.min(limit, numberOfCrafts);
    }

    return limit * recipe.action.result_quantity;
  }

  /**
   * @param {{selector: string;quantity: number;classSelector:string;}[]} data
   */
  renderAllCraftable(data) {
    const container = getHUD();
    for (const craftable of data) {
      $(`.headsUpDisplayBountifulBeanstalkView__baitCraftableContainer[data-item-type="${craftable.selector}"] .headsUpDisplayBountifulBeanstalkView__craftalyzerQuantity`, container)
        .text(craftable.quantity);
    }
  }
}
