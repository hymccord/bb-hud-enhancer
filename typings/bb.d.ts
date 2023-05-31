
type EnvironmentAttributes = {
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
