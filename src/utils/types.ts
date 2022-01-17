export type WeakObj = Record<string, any>;
export type Update = React.Dispatch<React.SetStateAction<WeakObj>>;
import { Path } from "../routes";

export type Location = {
  path: string;
  to: (path: Path, o: any) => void;
  update: Update;
}