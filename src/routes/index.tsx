import stringMath from "string-math";
let idCount = 0;
const id = (prefix?: string): string => {
  return `${prefix ? prefix + "-" : ""}${++idCount}`;
};
const numbers = Array.from(Array(10).keys());

export type ComponentData = {
  id: number | string;
  component: string;
  props: any;
}

export type Route = Array<ComponentData | ComponentData[]>;
export type Path = keyof typeof routes;
export type WeakObj = Record<string, any>;
type RouteFunction = (state: WeakObj) => Route;
type Routes = Record<string, RouteFunction>;

const ButtonRow = (item: any, props: any) => ({
  id: id("Button"),
  component: "Button",
  props: {
    text: item,
    ...(!numbers.includes(item) && { operation: true }),
    ...(item === 0 && { wide: true }),
    ...props
  }
});

// TODO: Figure out why I have to use input?: string
const index = ({ input }: { input?: string}): Route => {
  let result = "";

  try {
    result =
      input?.endsWith("=") &&
      stringMath(
        decodeURIComponent(input)
          .replace(/=/g, "")
          .replace(/x/gi, "*")
          .replace(/÷/g, "/")
      ) || "";
  } catch {
    input = "";
  }

  return [
    {
      id: id("Result"),
      component: "Result",
      props: {
        input,
        result,
      }
    },
    [
      {
        id: id("Button"),
        component: "Button",
        props: {
          text: "AC",
          operation: true,
          result
        }
      },
      {
        id: id("Button"),
        component: "Button",
        props: {
          wide: true,
          text: "=",
          operation: true,
          result
        }
      }
    ],
    [7, 8, 9, "x"].map((o) => ButtonRow(o, { result })),
    [4, 5, 6, "÷"].map((o) => ButtonRow(o, { result })),
    [1, 2, 3, "+"].map((o) => ButtonRow(o, { result })),
    [0, "-"].map((o) => ButtonRow(o, { result }))
  ]
};

const routes: Routes = {
  '/': index,
}

export default routes;

