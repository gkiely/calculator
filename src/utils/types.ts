import { Path } from '../routes';

export type WeakObj = Record<string, unknown>;
export type Update = React.Dispatch<React.SetStateAction<WeakObj>>;

export type Location = {
  path: string;
  to: (path: Path, o: WeakObj) => void;
  update: Update;
};

// Get nested generic
// https://stackoverflow.com/questions/63631364/infer-nested-generic-types-in-typescript
// type Nested<T> = T extends Route<infer A> ? A : never;
