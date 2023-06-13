
declare module "*.css";

declare var $: JQueryStatic;
declare var hg: HitGrab;

interface HitGrab {
  utils: {
    TemplateUtil: TemplateUtil
  }
}

declare var eventRegistry : EventRegistry;

interface EventRegistry {
  addEventListener<T extends unknown>(eventName: string, eventCallback: (eventData: any, eventScope: T) => void, eventScope?: T, removeAfterFire?: boolean, weight?: number, uniqueId?: number): void;
}

declare var user: User;

interface User {
  bait_name: string | 0;
  trap_power: number;
  trap_luck: number;
  environment_name: string;
  enviroment_atts: EnvironmentAttributes;
}
