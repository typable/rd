let showImages = false;

const style = document.createElement('style');
style.innerHTML = `
  @import url('https://fonts.googleapis.com/css2?family=Source+Serif+Pro:ital,wght@0,400;0,600;1,400;1,600&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,500;1,400;1,500&display=swap');

  body.reader-mode {
    background: none;
    background-color: #EEEEEE;
    padding: 100px 0;
    height: unset;
  }

  body.reader-mode > *:not(.read-container, .read-button) {
    display: none !important;
  }

  body.reader-mode .read-container {
    display: block;
  }

  body.reader-mode.hide-image .read-container img {
    display: none !important;
  }

  .read-checkbox {
    position: fixed;
    top: 25px;
    right: 25px;
    width: 18px;
    height: 18px;
    cursor: pointer;
  }

  .read-container {
    margin: 0 auto;
    display: none;
    width: 100%;
    max-width: 940px;
    min-height: 100vh;
    background-color: white;
    border: 1px solid #DDDDDD;
    z-index: 99999;
    overflow-y: auto;
    padding: 110px 70px;
    box-sizing: border-box;
  }

  .read-container::selection,
  .read-container *::selection {
    background: #42424233 !important;
    background-color: #42424233 !important;
    color: inherit !important;
  }

  .read-container *:not(.read-checkbox) {
    font-family: 'Source Serif Pro', serif;
    position: unset !important;
  }

  .read-container > * {
    max-width: 800px;
    margin: 0 auto;
  }

  .read-container h1,
  .read-container h2,
  .read-container h3 {
    font-weight: bold;
    color: #424242;
    border: none;
    padding: 0;
    margin-top: 0;
    margin-bottom: 0;
  }

  .read-container h1 {
    font-size: 42px !important;
    line-height: 52px;
    color: #424242;
    margin-top: 100px;
    margin-bottom: 50px;
    padding-bottom: 30px;
    border-bottom: 1px solid #BBBBBB;
  }

  .read-container h2 {
    font-size: 28px;
    line-height: 28px;
    margin-top: 70px;
    margin-bottom: 34px;
    padding-bottom: 16px;
    border-bottom: 1px solid #BBBBBB;
  }

  .read-container h3 {
    font-size: 24px;
    line-height: 24px;
    margin-top: 50px;
    margin-bottom: 34px;
  }

  .read-container *::before,
  .read-container *::after {
    content: none !important;
  }

  .read-container a {
    font-family: inherit;
    font-size: inherit;
    color: #4f46e5;
    text-decoration: none;
  }

  .read-container a:hover {
    text-decoration: underline;
  }

  .read-container ul {
    margin-bottom: 34px;
    box-sizing: border-box;
    padding-left: 2ch;
  }

  .read-container ul ul {
    margin: 0;
  }

  .read-container ul li {
    font-size: 20px;
    line-height: 32px;
    color: #424242;
    padding: 0;
  }

  .read-container pre {
    margin-bottom: 34px;
    padding: 20px;
    border: none;
    border-radius: 4px;
    background-color: #EEEEEE;
    box-sizing: border-box;
  }

  .read-container pre,
  .read-container pre * {
    font-size: 16px !important;
    line-height: 23px;
    font-family: 'JetBrains Mono', monospace !important;
  }

  .read-container code {
    border: none;
    border-radius: 4px;
    background-color: #EEEEEE;
    box-sizing: border-box;
    display: inline-block;
    padding: 0 8px;
    line-height: 28px;
  }

  .read-container code,
  .read-container code * {
    font-family: 'JetBrains Mono', monospace !important;
  }

  .read-container p {
    font-size: 20px;
    line-height: 34px;
    color: #424242;
    padding: 0;
    margin-bottom: 34px;
  }

  .read-container img {
    display: block;
    margin-bottom: 34px;
  }

  .read-button {
    position: fixed;
    right: 15px;
    bottom: 15px;
    width: 44px;
    height: 44px;
    background-color: #212121;
    color: white;
    z-index: 1000000;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 26px;
    outline: none;
    font-family: 'Source Serif Pro', serif;
  }

  .read-button:hover {
    background-color: #424242;
  }
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

const button = document.createElement('button');
button.classList.add('read-button');
button.addEventListener('click', () => {
  if(document.body.classList.contains('reader-mode')) {
    document.body.classList.toggle('reader-mode');
    return;
  }
  init();
  window.scrollTo(0, 0);
});
button.textContent = 'r';
document.body.appendChild(button);

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
    if( a === b) return 0;
      if( !a.compareDocumentPosition) {
        // support for IE8 and below
        return a.sourceIndex - b.sourceIndex;
      }
      if( a.compareDocumentPosition(b) & 2) {
        // b comes before a
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
