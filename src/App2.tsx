import React from "react";
import * as components from "./components";
import * as routes from "./routes";

const { useState, useEffect } = React;

const getRoute = (path, args) => {
  return routes[path](args);
};

let sectionItems = [];

const getComponent = (props, location) => {
  const Component = components[props.component];
  const warningResult = [];
  if (!props.id) {
    warningResult.push(
      <Box marginTop={1} key="warn">
        <Text color="yellow"> &gt; Missing id for: {props.component}</Text>
      </Box>
    );
  }
  if (!Component) {
    warningResult.push(
      <Box marginTop={1} key="warn">
        <Text color="yellow">
          {" "}
          &gt; Could not find component: {props.component}
        </Text>
      </Box>
    );
  }
  if (warningResult.length) {
    return [
      warningResult,
      Component ? (
        <Component key={props.id} {...props} location={location} />
      ) : null
    ];
  }
  return Component ? (
    <Component key={props.id} {...props} location={location} />
  ) : null;
};

/**
 * Handles grouping UI into secti ons
 */
const createRoute = (props, route, location) => {
  const matchedSection =
    route.sections && route.sections.find((o) => o.items.includes(props.id));
  if (matchedSection) {
    sectionItems.push(getComponent(props, location));
    if (sectionItems.length !== matchedSection.items.length) {
      return;
    }
    const result = (
      <Box key={matchedSection.id} flexDirection="row">
        {[...sectionItems]}
      </Box>
    );
    sectionItems.length = 0;
    return result;
  }
  return getComponent(props, location);
};

const App = () => {
  const [path, to] = useState("");
  const [routeArgs, update] = useState({});
  const route = getRoute(path, routeArgs);
  const [, set] = useState(0);

  useEffect(() => {
    // Handle rendering flicker
    if (path === "/view") {
      console.clear();
    }
    // On server message: re-render
    routes.emitter.on("message", () => set((prev) => prev + 1));
    return () => {
      routes.emitter.removeAllListeners();
    };
  }, [path ?? ""]);

  return (
    <>
      {route.title ? <Text>{route.title}</Text> : ""}
      {route.items
        ? route.items.map((item) =>
            createRoute(item, route, {
              path,
              to: (path, o) => {
                to(path);
                update(typeof o === "undefined" ? (prev) => prev : o);
              },
              update
            })
          )
        : null}
    </>
  );
};

render(<App />);
