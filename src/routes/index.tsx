import stringMath from "string-math";
let idCount = 0;
const id = (prefix?: string): string => {
  return `${prefix ? prefix + "-" : ""}${++idCount}`;
};
const numbers = Array.from(Array(10).keys());

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

const index = (input?: string) => {
  let result = "";

  try {
    result =
      input?.endsWith("=") &&
      stringMath(
        decodeURIComponent(input)
          .replace(/=/g, "")
          .replace(/x/gi, "*")
          .replace(/÷/g, "/")
      );
  } catch {
    input = "";
  }

  return [
    {
      id: id("Result"),
      component: "Result",
      props: {
        input,
        result
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
  ];
};

export default {
  "": index
};
