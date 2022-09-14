chrome.runtime.onMessage.addListener((message, sender, sendMessage) => {
  if(document.body.classList.contains('reader-mode')) {
    document.body.classList.toggle('reader-mode');
  }
  else {
    init();
    window.scrollTo(0, 0);
  }
  sendMessage();
});

let showImages = false;

const style = document.createElement('style');
style.innerHTML = `
  @import url('https://fonts.googleapis.com/css2?family=Source+Serif+Pro:ital,wght@0,400;0,600;1,400;1,600&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,500;1,400;1,500&display=swap');
`;
document.body.appendChild(style);

const container = document.createElement('div');
container.classList.add('read-container');
document.body.appendChild(container);

const checkbox = document.createElement('input');
checkbox.type = 'checkbox';
checkbox.classList.add('read-checkbox');
checkbox.title = 'Show images';
checkbox.addEventListener('click', () => {
  showImages = checkbox.checked;
  init();
});

function init() {
  document.body.classList.remove('reader-mode');
  document.body.classList[showImages ? 'remove' : 'add']('hide-image');

  const tags = ['h1', 'h2', 'h3', 'p:not(p *, ul *)', 'ul:not(p *, ul *)', 'pre:not(p *)'];
  let list = [];

  if(showImages) {
    tags.push('img:not(p *, ul *)');
  }

  tags.forEach((tag) => list.push(...document.querySelectorAll(`${tag}:not(.read-container *)`)));

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

  container.innerHTML = '';
  container.appendChild(checkbox);
  list.forEach((item) => container.appendChild(item.cloneNode(true)));
  container.childNodes[1].style.marginTop = 0;
  document.body.classList.add('reader-mode');
}
