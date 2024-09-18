


urls = [];
currentIndex = 0;
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.action === 'startDownload') {
    
    chrome.storage.local.get(['uploadedJsonData'], function(result) {
      if (result.uploadedJsonData) {
        urls = JSON.parse(result.uploadedJsonData);
          console.log('Retrieved URLs:', urls);
        // chrome.storage.local.get(['scrapedUrlsCount'], function(result) {
        //   currentIndex = result.scrapedUrlsCount;
          console.log('current index is : ', currentIndex);

          chrome.tabs.create({ url: urls[currentIndex] }, (tab) => {
              chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
                  if (tabId === tab.id && info.status === 'complete') {
                      chrome.tabs.onUpdated.removeListener(listener);
                      console.log(currentIndex + ' : url open' + urls[currentIndex]);
                      chrome.tabs.sendMessage(tabId, { action: 'open url', tabId: tab.id, url: urls[currentIndex]});
                      chrome.storage.local.set({ "tabId": tab.id}, function () {});
                  }
              });
          });
        // })
      } else {
          console.log('No URLs found in storage.');
      }
    });
  } 
  
  // else if (request.action === 'open image') {
  //   chrome.tabs.remove(request.tabId, () => {});
  //   chrome.tabs.create({ url: request.imageUrl }, (tab) => {
  //     chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
  //         if (tabId === tab.id && info.status === 'complete') {
  //             chrome.tabs.onUpdated.removeListener(listener);
  //             chrome.tabs.sendMessage(tabId, { action: 'image opened', tabId : tab.id , fbId : request.fbId });
  //             chrome.storage.local.set({ "tabId": tab.id}, function () {});
  //         }
  //     });
  //   });

  // } else if (request.action == 'open link') {
  //   chrome.tabs.remove(request.tabId, () => {});
  //   chrome.tabs.create({ url: request.imageUrl }, (tab) => {
  //     chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
  //         if (tabId === tab.id && info.status === 'complete') {
  //             chrome.tabs.onUpdated.removeListener(listener);
  //             chrome.tabs.sendMessage(tabId, { action: 'opened linked', tabId : tab.id , fbId : request.fbId });
  //             chrome.storage.local.set({ "tabId": tab.id}, function () {});
  //         }
  //     });
  //   });
  // }
  
  // else if (request.action === 'download image') {

  //   chrome.tabs.sendMessage(request.tabId, {action: 'image downloaded', tabId : request.tabId, fbId : request.fbId});
  //   chrome.storage.local.set({ "tabId": request.tabId}, function () {});

  // } else if (request.action === 'all images downloaded') {
    
  //   imagesURLS = request.imageUrl;

  //   if (imagesURLS.length > 0) {
  //     imageCounter = request.imageCounter;
  //     fetch('http://127.0.0.1:8000/api/combine', {
  //       method: 'POST',
  //       headers: {
  //           'Accept': 'application/json, text/plain, */*',
  //           'Content-Type': 'application/json'
  //       },
        
  //       body: JSON.stringify({type : request.type, postid : request.fbId, path : request.imageUrl, imageCounter :imageCounter})
  //     }).then(function(response) {
  //       return response.json();
  //     }).then(function (Data_){
  //           var obj=Data_;
  //           if(obj){

  //             if (request.flag) {
  //               chrome.storage.local.get(['flag'], function(result) {
  //                 flag = result.flag;
  //                 if (flag == 'start') {
  //                   chrome.tabs.sendMessage(request.tabId, {action: 'image downloaded', tabId : request.tabId, fbId : request.fbId, flag : 'images saved'});
  //                   chrome.storage.local.set({ "tabId": request.tabId}, function () {});
  //                 }
  //               })
  //             } else {
  //               currentIndex = currentIndex + 1;
  //               chrome.storage.local.set({ "scrapedUrlsCount": currentIndex }, function () {});
  //               chrome.storage.local.get(['scrapedUrlsCount'], function(result) {
  //                 currentIndex = result.scrapedUrlsCount;
  //                 console.log('current index is : ', currentIndex);
  //                 chrome.tabs.remove(request.tabId, () => {});
                  
  //                 if (urls.length != currentIndex) {
  //                   chrome.storage.local.get(['flag'], function(result) {
  //                     flag = result.flag;
  //                     if (flag == 'start') {
  //                       chrome.tabs.create({ url: urls[currentIndex] }, (tab) => {
  //                         chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
  //                             if (tabId === tab.id && info.status === 'complete') {
  //                                 chrome.tabs.onUpdated.removeListener(listener);
  //                                 console.log(currentIndex + ' : url open' + urls[currentIndex]);
  //                                 chrome.tabs.sendMessage(tabId, { action: 'open url', tabId : tab.id, url: urls[currentIndex]});
  //                                 chrome.storage.local.set({ "tabId": tab.id}, function () {});
  //                             }
  //                         });
  //                       });
  //                     }
  //                   })
  //                 } else {
  //                   chrome.storage.local.set({ "scrapedUrlsCount": 0 }, function () {});
  //                   chrome.storage.local.set({ "urls": [] }, function () {});
  //                   chrome.storage.local.set({ "flag": '' }, function () {});
  //                   chrome.storage.local.set({ "tabId": '' }, function () {});
  //                 }
  //               })
  //             }
  //           } else {
  //             chrome.tabs.remove(request.tabId, () => {});
  //             if (urls.length != currentIndex) {
  //               chrome.storage.local.get(['flag'], function(result) {
  //                 flag = result.flag;
  //                 if (flag == 'start') {
  //                   chrome.tabs.create({ url: urls[currentIndex] }, (tab) => {
  //                     chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
  //                         if (tabId === tab.id && info.status === 'complete') {
  //                             chrome.tabs.onUpdated.removeListener(listener);
  //                             console.log(currentIndex + ' : url open' + urls[currentIndex]);
  //                             chrome.tabs.sendMessage(tabId, { action: 'open url', tabId : tab.id, url: urls[currentIndex]});
  //                             // chrome.tabs.remove(request.tabId, () => {});
  //                             chrome.storage.local.set({ "tabId": tab.id}, function () {});
  //                         }
  //                     });
  //                   });
  //                 }
  //               })
  //             } else {
  //               chrome.storage.local.set({ "scrapedUrlsCount": 0 }, function () {});
  //               chrome.storage.local.set({ "urls": [] }, function () {});
  //               chrome.storage.local.set({ "flag": '' }, function () {});
  //               chrome.storage.local.set({ "tabId": '' }, function () {});
  //             }
  //           }
  //     }).catch(function (error) {
  //       chrome.tabs.remove(request.tabId, () => {});
  //       if (urls.length != currentIndex) {
  //         chrome.storage.local.get(['flag'], function(result) {
  //           flag = result.flag;
  //           if (flag == 'start') {
  //             chrome.tabs.create({ url: urls[currentIndex] }, (tab) => {
  //               chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
  //                   if (tabId === tab.id && info.status === 'complete') {
  //                       chrome.tabs.onUpdated.removeListener(listener);
  //                       console.log(currentIndex + ' : url open' + urls[currentIndex]);
  //                       chrome.tabs.sendMessage(tabId, { action: 'open url', tabId : tab.id, url: urls[currentIndex]});
  //                       // chrome.tabs.remove(request.tabId, () => {});
  //                       chrome.storage.local.set({ "tabId": tab.id}, function () {});
  //                   }
  //               });
  //             });
  //           }
  //         })
  //       } else {
  //         chrome.storage.local.set({ "scrapedUrlsCount": 0 }, function () {});
  //         chrome.storage.local.set({ "urls": [] }, function () {});
  //         chrome.storage.local.set({ "flag": '' }, function () {});
  //         chrome.storage.local.set({ "tabId": '' }, function () {});
  //       }
  //     });
  //   } else {
  //     currentIndex = currentIndex + 1;
  //     chrome.storage.local.set({ "scrapedUrlsCount": currentIndex }, function () {});
  //     chrome.storage.local.get(['scrapedUrlsCount'], function(result) {
  //       currentIndex = result.scrapedUrlsCount;
  //       console.log('current index is : ', currentIndex);
  //       chrome.tabs.remove(request.tabId, () => {});
  //       if (urls.length != currentIndex) {
  //         chrome.storage.local.get(['flag'], function(result) {
  //           flag = result.flag;
  //           if (flag == 'start') {
  //             chrome.tabs.create({ url: urls[currentIndex] }, (tab) => {
  //               chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
  //                   if (tabId === tab.id && info.status === 'complete') {
  //                       chrome.tabs.onUpdated.removeListener(listener);
  //                       console.log(currentIndex + ' : url open' + urls[currentIndex]);
  //                       chrome.tabs.sendMessage(tabId, { action: 'open url', tabId : tab.id, url: urls[currentIndex]});
  //                       // chrome.tabs.remove(request.tabId, () => {});
  //                       chrome.storage.local.set({ "tabId": tab.id}, function () {});
  //                   }
  //               });
  //             });
  //           }
  //         })
  //       } else {
  //         chrome.storage.local.set({ "scrapedUrlsCount": 0 }, function () {});
  //         chrome.storage.local.set({ "urls": [] }, function () {});
  //         chrome.storage.local.set({ "flag": '' }, function () {});
  //         chrome.storage.local.set({ "tabId": '' }, function () {});
  //       }
        
  //     })
  //   }    
  // } else if (request.action == 'open next page') {
  //   fetch('http://127.0.0.1:8000/api/combine', {
  //     method: 'POST',
  //     headers: {
  //         'Accept': 'application/json, text/plain, */*',
  //         'Content-Type': 'application/json'
  //     },
      
  //     body: JSON.stringify({type : 'text', postid : request.fbId, path : ""})
  //   }).then(function(response) {
  //     return response.json();
  //   }).then(function (Data_){
  //         var obj=Data_;
  //         if(obj){
  //             currentIndex = currentIndex + 1;
  //             chrome.storage.local.set({ "scrapedUrlsCount": currentIndex }, function () {});
  //               chrome.storage.local.get(['scrapedUrlsCount'], function(result) {
  //                 currentIndex = result.scrapedUrlsCount;
  //                 console.log('current index is : ', currentIndex);
  //                 chrome.tabs.remove(request.tabId, () => {});
  //                 if (urls.length != currentIndex) {
  //                   chrome.storage.local.get(['flag'], function(result) {
  //                     flag = result.flag;
  //                     if (flag == 'start') {
  //                       chrome.tabs.create({ url: urls[currentIndex] }, (tab) => {
  //                         chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
  //                             if (tabId === tab.id && info.status === 'complete') {
  //                                 chrome.tabs.onUpdated.removeListener(listener);
  //                               console.log(currentIndex + ' : url open' + urls[currentIndex]);
  //                                 chrome.tabs.sendMessage(tabId, { action: 'open url', tabId : tab.id, url: urls[currentIndex]});
  //                                 // chrome.tabs.remove(request.tabId, () => {});
  //                                 chrome.storage.local.set({ "tabId": tab.id}, function () {});
  //                             }
  //                         });
  //                       });
  //                     }
  //                   })
  //                 } else {
  //                   chrome.storage.local.set({ "scrapedUrlsCount": 0 }, function () {});
  //                   chrome.storage.local.set({ "urls": [] }, function () {});
  //                   chrome.storage.local.set({ "flag": '' }, function () {});
  //                   chrome.storage.local.set({ "tabId": '' }, function () {});
  //                 }
                  
  //               })
  //         } else {
  //           chrome.tabs.remove(request.tabId, () => {});
  //           if (urls.length != currentIndex) {
  //             chrome.storage.local.get(['flag'], function(result) {
  //               flag = result.flag;
  //               if (flag == 'start') {
  //                 chrome.tabs.create({ url: urls[currentIndex] }, (tab) => {
  //                   chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
  //                       if (tabId === tab.id && info.status === 'complete') {
  //                           chrome.tabs.onUpdated.removeListener(listener);
  //                         console.log(currentIndex + ' : url open' + urls[currentIndex]);
  //                           chrome.tabs.sendMessage(tabId, { action: 'open url', tabId : tab.id, url: urls[currentIndex]});
  //                           // chrome.tabs.remove(request.tabId, () => {});
  //                           chrome.storage.local.set({ "tabId": tab.id}, function () {});
      
  //                       }
  //                   });
  //                 });
  //               }
  //             })
  //           } else {
  //             chrome.storage.local.set({ "scrapedUrlsCount": 0 }, function () {});
  //             chrome.storage.local.set({ "urls": [] }, function () {});
  //             chrome.storage.local.set({ "flag": '' }, function () {});
  //             chrome.storage.local.set({ "tabId": '' }, function () {});
  //           }
            
  //         }
  //   }).catch(function (error) {
  //     chrome.tabs.remove(request.tabId, () => {});
  //     if (urls.length != currentIndex) {
  //       chrome.storage.local.get(['flag'], function(result) {
  //         flag = result.flag;
  //         if (flag == 'start') {
  //           chrome.tabs.create({ url: urls[currentIndex] }, (tab) => {
  //             chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
  //                 if (tabId === tab.id && info.status === 'complete') {
  //                     chrome.tabs.onUpdated.removeListener(listener);
  //                   console.log(currentIndex + ' : url open' + urls[currentIndex]);
  //                     chrome.tabs.sendMessage(tabId, { action: 'open url', tabId : tab.id, url: urls[currentIndex]});
  //                     // chrome.tabs.remove(request.tabId, () => {});
  //                     chrome.storage.local.set({ "tabId": tab.id}, function () {});
  //                 }
  //             });
  //           });
  //         }
  //       })
  //     } else {
  //       chrome.storage.local.set({ "scrapedUrlsCount": 0 }, function () {});
  //       chrome.storage.local.set({ "urls": [] }, function () {});
  //       chrome.storage.local.set({ "flag": '' }, function () {});
  //       chrome.storage.local.set({ "tabId": '' }, function () {});
  //     }
  //   });
  // }
});
