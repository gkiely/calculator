import { css } from "@emotion/css";
import "./styles.css";
import "./machines/calculator";

import { BrowserRouter as Router, useLocation } from "react-router-dom";

import * as components from "./components/index";
import get from "./routes/index";

export function getKeys<O>(o: O) {
  return Object.keys(o) as (keyof O)[];
}

interface ComponentType {
  id: number | string;
  name: string;
  props: any;
}

interface SectionType {
  [index: number]: ComponentType;
}

const componentAppClass = css`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const componentSectionClass = css`
  flex: 1;
`;


const renderComponent = (id: string, name: string, props: any = {}) => {
  const Component = components[name as keyof typeof components];
  if (Component) {
    return <Component key={id} {...props} />;
  } else {
    console.warn(`Component does not exist:`, { id, name });
  }
};

// TODO: Doesn't support { section: { items: []}}
// TODO: Needs correct typing
// TODO: remove sectionCount in favor of setting id on server w/ above syntax
let sectionCount = 0;
const renderSection = (a: SectionType | any) => {
  const result = Array.isArray(a)
    ? a.map((item) => renderComponent(item.id, item.component, item.props))
    : null;
  return result ? (
    <section className={componentSectionClass} key={++sectionCount}>
      {result}
    </section>
  ) : null;
};

export function App() {
  const location = useLocation();
  const page = get(location.pathname.substr(1));

  return (
    <div className={componentAppClass}>
      {page.map((item) => {
        if (Array.isArray(item)) {
          return renderSection(item);
        } else {
          return renderComponent(item.id, item.component, item.props);
        }
      })}
    </div>
  );
}

export default function AppContainer() {
  return (
    <Router>
      <App />
    </Router>
  );
}
