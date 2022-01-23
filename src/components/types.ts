import * as components from '../components';
import { WeakObj } from '../utils/types';

export type ComponentData = {
  id: string;
  component: keyof typeof components;
  props: WeakObj;
};
