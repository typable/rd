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

const script = document.createElement('script');
script.src = chrome.runtime.getURL('src/main.js');
document.body.appendChild(script);
