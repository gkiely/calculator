# Calculator

Testing out a new approach to building applications using SDUI.

[Demo](https://codesandbox.io/s/calculator-4z8gr)

<img src="https://user-images.githubusercontent.com/1948935/149849579-93ea41fd-cbf7-4536-a52f-bae796add712.png" alt="Calculator" width="500"/>

- routes/index.tsx
  - The state object allows updating the RouteState from the server
  - It is undefined when no changes are needed and when it returns an object, it updates the client's RouteState (if it's different) which triggers a re-render.
