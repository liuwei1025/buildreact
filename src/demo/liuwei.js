const Didact = {
  createElement,
  render,
};

function render(element, container) {
  const dom = document.createElement(element.type);
  Object.keys(element.props || {}).forEach(key => {
    if (key !== 'children') {
      dom.setAttribute(key, element.props[key]);
    }
  });
  element.props?.children?.map(child => {
    render(createElement(child), dom);
  });
  container.appendChild(dom);
}

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children,
    },
  };
}
/** @jsx Didact.createElement */
const element = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
);

Didact.render(element, document.querySelector('#liuwei'));
