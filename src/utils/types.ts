import { Path } from '../routes';

export type WeakObj = Record<string, unknown>;
export type Update = React.Dispatch<React.SetStateAction<WeakObj>>;

export type Location = {
  path: string;
  to: (path: Path, o: WeakObj) => void;
  update: Update;
};
