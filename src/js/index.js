const style = document.createElement('style');
style.innerHTML = `
  @import url('https://fonts.googleapis.com/css2?family=Source+Serif+Pro:ital,wght@0,400;0,600;1,400;1,600&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,500;1,400;1,500&display=swap');

  body.reader-mode {
    overflow: hidden;
  }

  body.reader-mode > *:not(.read-container, .read-button) {
    display: none !important;
  }

  body.reader-mode .read-container {
    display: block;
  }

  body.reader-mode .read-button {
    right: 32px;
  }

  .read-container {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100vh;
    max-height: 100vh;
    background-color: white;
    z-index: 99999;
    overflow-y: auto;
    padding: 200px 50px;
    box-sizing: border-box;
  }

  .read-container::selection,
  .read-container *::selection {
    background: #42424233 !important;
    background-color: #42424233 !important;
    color: inherit !important;
  }

  .read-container * {
    font-family: 'Source Serif Pro', serif;
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
    font-size: 38px !important;
    line-height: 48px;
    color: #424242;
    margin-top: 100px;
    margin-bottom: 50px;
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

  // .read-container img {
  //   display: none !important;
  // }
`;
document.body.appendChild(style);

const tags = ['h1', 'h2', 'h3', 'p:not(p *, ul *)', 'ul:not(p *)', 'pre:not(p *)', 'img:not(p *, ul *)'];
let list = [];

tags.forEach((tag) => list.push(...document.querySelectorAll(tag)));

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

const container = document.createElement('div');
container.classList.add('read-container');
list.forEach((item) => container.appendChild(item.cloneNode(true)));
container.childNodes[0].style.marginTop = 0;
document.body.appendChild(container);

const button = document.createElement('button');
button.textContent = 'r';
button.classList.add('read-button');
button.addEventListener('click', () => {
  document.body.classList.toggle('reader-mode');
  container.scrollTop = 0;
});
document.body.appendChild(button);
