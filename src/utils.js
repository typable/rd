export const parseDOM = (node, props) => {
  const tags = ['h1', 'h2', 'h3', 'p:not(p *, ul *)', 'ul:not(p *, ul *)', 'pre:not(p *)'];
  let list = [];
  if(props.showImages) {
    tags.push('img:not(p *, ul *)');
  }
  tags.forEach((tag) => list.push(...node.querySelectorAll(`${tag}:not(rd-viewer *)`)));
  list = list.filter((item) => item.offsetParent !== null);
  list = list.sort((a, b) => {
    if(a === b) return 0;
      if(!a.compareDocumentPosition) {
        return a.sourceIndex - b.sourceIndex;
      }
      if(a.compareDocumentPosition(b) & 2) {
        return 1;
      }
    return -1;
  });
  list.map((item) => item.cloneNode(true));
  return list;
}

let isShadowDOM = false;

export const createShadowDOM = (name = 'shadow-dom') => {
  if(!isShadowDOM) {
    customElements.define(name, class ShadowDOM extends HTMLElement {
      constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
      }
    });
    isShadowDOM = true;
  }
  const el = document.createElement(name);
  return [el, el.shadow];
}

export const useSource = (type, source) => {
  if(type !== 'css' && type !== 'js') {
    throw 'invalid source type!';
  }
  let el = null;
  if(type === 'js') {
    el = document.createElement('script');
    el.type = 'text/javascript';
    el.src = source;
  }
  if(type === 'css') {
    el = document.createElement('link');
    el.rel = 'stylesheet';
    el.href = source;
  }
  document.head.appendChild(el);
}
