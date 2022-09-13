const script = document.createElement('script');
script.type = 'module';
script.src = chrome.runtime.getURL('./src/js/index.js');
document.head.appendChild(script);
