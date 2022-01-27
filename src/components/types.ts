import * as components from '../components';

export type ComponentName = keyof typeof components;
export type ComponentNames = {
  [key in ComponentName]: key;
};

type GetComponentData<P> = P extends ComponentName
  ? {
      id: string;
      component: P;
      props: Omit<Parameters<typeof components[P]>[number], 'id' | 'location'>;
    }
  : never;

export type ComponentData = GetComponentData<ComponentName>;
