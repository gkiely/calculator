import stringMath from "string-math";

import { WeakObj } from '../utils/types';

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

// export type Route = Array<ComponentData | ComponentData[]>;
export type Route = {
  state?: WeakObj;
  components: Array<ComponentData | ComponentData[]>;
}
export type Path = keyof typeof routes;
type RouteFunction = (routeState: WeakObj) => Route;
type Routes = Record<string, RouteFunction>;

const ButtonRow = (item: any, props: any) => ({
  id: id("Button"),
  component: "Button",
  props: {
    text: `${item}`,
    ...(!numbers.includes(item) && { operation: true, operator: true }),
    ...(item === 0 && { wide: true }),
    ...props
  }
});



const doMath = (input: string) => {
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
  } catch {}
  return result;
}


type Index = (
  {input}: {input?: string},
) => Route;

const index: Index = ({ input }): Route => {
  const result = input ? doMath(input) : "";
  
  const components = [
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
          input,
          result
        }
      },
      {
        id: id("Button"),
        component: "Button",
        props: {
          wide: true,
          text: "=",
          input,
          result
        }
      }
    ],
    [7, 8, 9, "x"].map((o) => ButtonRow(o, { input, result })),
    [4, 5, 6, "÷"].map((o) => ButtonRow(o, { input, result })),
    [1, 2, 3, "+"].map((o) => ButtonRow(o, { input, result })),
    [0, "-"].map((o) => ButtonRow(o, { input, result }))
  ];

  /**
   * State updates
   */
  console.log({input, result});

  // Clear
  const slice = input?.slice(-2) ?? "";
  if(slice === "AC"){
    return {
      state: {
        input: '',
      },
      components,
    }
  }
  
  // Allow calculating from a previous result
  const lastEntry = slice.charAt(0);
  const currentEntry = slice.charAt(1);
  if(input && lastEntry === '='){
    const r = doMath(input.substring(0, input.length - 1));
    return {
      state: {
        input: r + currentEntry,
      },
      components,
    }
  }
  return {
    components,
  }
};

const routes: Routes = {
  '/': index,
}

export default routes;

