


urls = [];
currentIndex = 0;
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.action === 'startDownload') {
    
    chrome.storage.local.get(['uploadedJsonData'], function(result) {
      if (result.uploadedJsonData) {
        urls = JSON.parse(result.uploadedJsonData);
          console.log('Retrieved URLs:', urls);
          console.log('current index is : ', currentIndex);

          chrome.tabs.create({ url: urls[currentIndex] }, (tab) => {
              chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
                  if (tabId === tab.id && info.status === 'complete') {
                      chrome.tabs.onUpdated.removeListener(listener);
                      console.log(currentIndex + ' : url open ' + urls[currentIndex]);
                      chrome.tabs.sendMessage(tabId, { action: 'open url', tabId: tab.id, url: urls[currentIndex]});
                  }
              });
          });
      } else {
          console.log('No URLs found in storage.');
      }
    });
  } else if (request.action === 'startDownload') {
    chrome.tabs.remove(request.tabId, () => {});
    currentIndex+=1;
    if (currentIndex >= url.length) {
      chrome.storage.local.set({ "uploadedJsonData": ''}, function () {});
      console.log("All urls opened and added the likes successfully");
    } else{
      console.log('current index is : ', currentIndex);
      chrome.tabs.create({ url: urls[currentIndex] }, (tab) => {
          chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
              if (tabId === tab.id && info.status === 'complete') {
                  chrome.tabs.onUpdated.removeListener(listener);
                  console.log(currentIndex + ' : url open ' + urls[currentIndex]);
                  chrome.tabs.sendMessage(tabId, { action: 'open url', tabId: tab.id, url: urls[currentIndex]});
              }
          });
      });
    }
  } 
});