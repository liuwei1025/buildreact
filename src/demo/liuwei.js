

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => {
        return typeof child === 'object' ? child : createTextElement(child);
      }),
    },
  };
}
function createTextElement(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      /**
       * 使用nodeValue是为了和dom的属性保持一致
       */
      nodeValue: text,
      /**
       * React doesn’t wrap primitive values or create empty arrays when there aren’t children,
       * but we do it because it will simplify our code, and for our library we prefer simple code than performant code.
       */
      children: [],
    },
  };
}
const Didact = {
  createElement,
};
/** @jsx Didact.createElement */
const element = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
);
console.log(element);
