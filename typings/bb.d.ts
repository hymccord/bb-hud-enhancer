
type EnvironmentAttributes = {
  in_castle: boolean;
  castle: {
    is_boss_chase: boolean;
    noise_level: number;
    max_noise_level: number;
    current_floor: {
      name: string;
    }
    projected_noise: {
      min: number; // % of max_noise_level
      max: number; // % of max_noise_level
      actual_min: number;
      actual_max: number;
    }
    hunts_remaining: number;
  },
  items: {[key: string]: {
    quantity_unformatted: number;
  }},
  beanster_recipe: Craftable
  lavish_beanster_recipe: Craftable
  royal_beanster_recipe: Craftable
}

const BeansterRecipies = ['beanster_recipe', 'lavish_beanster_recipe', 'royal_beanster_recipe'] as const;
type BeansterRecipe = typeof BeansterRecipies[number];

type Craftable = CraftableVanilla | CraftableUpsell;

type CraftableVanilla = {
  result: { type: string };
  has_upsell: false;
  vanilla: Recipe;
}

type CraftableUpsell = {
  result: { type: string };
  has_upsell: true;
  vanilla: Recipe;
  upsell: Recipe;
}

type Recipe = {
  items: [
    {
      type: string,
      name: string,
      thumb: string,
      required_quantity: number}
  ]
  action: {
    result_quantity: number
  }
}

type MousePowers = {[key: string]: {
  power: number;
  eff: number;
}}

type MousePool = {[key: string]: {
  power: number;
  eff: number;
  rate: number;
}}

const BbHudEnhSettings = [
  'enableCraftalyzer',
  'enableNoisehelper',
  'enableHarpmeout',
] as const;
type BbHudEnhSetting = typeof BbHudEnhSettings[number];
