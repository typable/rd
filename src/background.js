const ports = {};

chrome.action.onClicked.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    ports[tabs[0].id].postMessage({ action: 'clicked' });
  });
});

chrome.runtime.onConnect.addListener((port) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    ports[tabs[0].id] = port;
  });
});
