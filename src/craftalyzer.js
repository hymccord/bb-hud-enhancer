import { getHUD } from './domNodes';
import { log } from './logging';

/** @type {Craftalyzer} */
let _craftalyzer;

/** @param {User} data */
export function addCraftalyzer(data) {

  /** @type {BeansterRecipe[]} */
  const beansterRecipies = ['beanster_recipe', 'lavish_beanster_recipe', 'royal_beanster_recipe'];
  /** @type {{[key: string]: Craftable}} */
  const recipies = {};
  /** */
  for (const recipeName of beansterRecipies) {
    if (recipeName in data.enviroment_atts) {
      recipies[recipeName] = data.enviroment_atts[recipeName];
    }
  }

  _craftalyzer = new Craftalyzer(recipies);

  // TODO: replace settings
  const settings = {
    upsell: {
      beanster_recipe: true,
      lavish_beanster_recipe: true,
      royal_beanster_recipe: true
    },
    ignore: {
      magic_essence_craft_item: true,
      gold_stat_item: true,
    }
  };
  _craftalyzer.render(data, settings);
}


/** @param {User} data */
export function updateCraftalyzer(data) {
  if (!_craftalyzer) {
    return;
  }

  // TODO: replace settings
  const settings = {
    upsell: {
      beanster_recipe: true,
      lavish_beanster_recipe: true,
      royal_beanster_recipe: true
    },
    ignore: {
      magic_essence_craft_item: true,
      gold_stat_item: true,
    }
  };
  _craftalyzer.update(data, settings);
}

class Craftalyzer {

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
   */
  render(data, settings) {
    this.setCurrentRecipies(settings);
    this.updateItems(data, settings);
  }

  /**
   * @param {User} data
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
      let quantity = this.getCraftable(recipeName, data.enviroment_atts.items);
      currentlyCraftable.push({
        selector: this._currentRecipies[recipeName].result,
        classSelector: 'headsUpDisplayBountifulBeanstalkView__baitQuantity',
        quantity
      });

      quantity = this.getCraftableQuantityWithLimit(Infinity, recipeName, data.enviroment_atts.items, settings);
      currentlyCraftable.push({
        selector: recipe.items[0].type,
        classSelector: 'headsUpDisplayBountifulBeanstalkView__ingredientQuantity',
        quantity
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
    let maxCrafts = Infinity;

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
        availableQuantity += craftedQuantity * this._currentRecipies[recursiveRecipeName].action.result_quantity;
      }

      const numberOfCrafts = Math.floor(availableQuantity / requiredQuantity);
      maxCrafts = Math.min(maxCrafts, numberOfCrafts);
    }

    return maxCrafts * recipe.action.result_quantity;
  }

  /**
   * @param {{selector: string;quantity: number;classSelector:string;}[]} data
   */
  renderAllCraftable(data) {
    const container = getHUD();
    for (const craftable of data) {
      $(`div[data-item-type=${craftable.selector}].${craftable.classSelector}`, container)
        .append(`<span> (+${craftable.quantity})`);
    }
  }
}
