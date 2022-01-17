import stringMath from "string-math";
let idCount = 0;
const id = (prefix?: string): string => {
  return `${prefix ? prefix + "-" : ""}${++idCount}`;
};
const numbers = Array.from(Array(10).keys());

const Row = (item: any, props: any) => ({
  id: id("Button"),
  component: "Button",
  props: {
    text: item,
    ...(!numbers.includes(item) && { operation: true }),
    ...(item === 0 && { wide: true }),
    ...props
  }
});

// Child in section
// {
//   component: "Section",
//   items: []
// }

// .get('/')
// .get('/:calculation')
const get = (input?: string) => {
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
    [7, 8, 9, "x"].map((o) => Row(o, { result })),
    [4, 5, 6, "÷"].map((o) => Row(o, { result })),
    [1, 2, 3, "+"].map((o) => Row(o, { result })),
    [0, "-"].map((o) => Row(o, { result }))
  ];
};

export default get;
