import { Path } from '../routes';

export type WeakObj = Record<string, unknown>;

export type Location = {
  path: string;
  to: (path: Path, o: WeakObj) => void;
  update: React.Dispatch<React.SetStateAction<WeakObj>>;
};

// Get nested generic
// https://stackoverflow.com/questions/63631364/infer-nested-generic-types-in-typescript
// type Nested<T> = T extends Route<infer A> ? A : never;
