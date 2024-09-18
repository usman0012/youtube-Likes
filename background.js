


urls = [];
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.action === 'startDownload') {
    
    chrome.storage.local.get(['urls'], function(result) {
      if (result.urls) {
        urls = result.urls;
          console.log('Retrieved URLs:', urls);
        chrome.storage.local.get(['scrapedUrlsCount'], function(result) {
          currentIndex = result.scrapedUrlsCount;
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
        })
      } else {
          console.log('No URLs found in storage.');
      }
    });

  } else if (request.action === 'open image') {
    chrome.tabs.remove(request.tabId, () => {});
    chrome.tabs.create({ url: request.imageUrl }, (tab) => {
      chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
          if (tabId === tab.id && info.status === 'complete') {
              chrome.tabs.onUpdated.removeListener(listener);
              chrome.tabs.sendMessage(tabId, { action: 'image opened', tabId : tab.id , fbId : request.fbId });
              chrome.storage.local.set({ "tabId": tab.id}, function () {});
          }
      });
    });

  } else if (request.action == 'open link') {
    chrome.tabs.remove(request.tabId, () => {});
    chrome.tabs.create({ url: request.imageUrl }, (tab) => {
      chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
          if (tabId === tab.id && info.status === 'complete') {
              chrome.tabs.onUpdated.removeListener(listener);
              chrome.tabs.sendMessage(tabId, { action: 'opened linked', tabId : tab.id , fbId : request.fbId });
              chrome.storage.local.set({ "tabId": tab.id}, function () {});
          }
      });
    });
  }
  
  else if (request.action === 'download image') {

    chrome.tabs.sendMessage(request.tabId, {action: 'image downloaded', tabId : request.tabId, fbId : request.fbId});
    chrome.storage.local.set({ "tabId": request.tabId}, function () {});

  } else if (request.action === 'all images downloaded') {
    
    imagesURLS = request.imageUrl;

    if (imagesURLS.length > 0) {
      imageCounter = request.imageCounter;
      fetch('http://127.0.0.1:8000/api/combine', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        
        body: JSON.stringify({type : request.type, postid : request.fbId, path : request.imageUrl, imageCounter :imageCounter})
      }).then(function(response) {
        return response.json();
      }).then(function (Data_){
            var obj=Data_;
            if(obj){

              if (request.flag) {
                chrome.storage.local.get(['flag'], function(result) {
                  flag = result.flag;
                  if (flag == 'start') {
                    chrome.tabs.sendMessage(request.tabId, {action: 'image downloaded', tabId : request.tabId, fbId : request.fbId, flag : 'images saved'});
                    chrome.storage.local.set({ "tabId": request.tabId}, function () {});
                  }
                })
              } else {
                currentIndex = currentIndex + 1;
                chrome.storage.local.set({ "scrapedUrlsCount": currentIndex }, function () {});
                chrome.storage.local.get(['scrapedUrlsCount'], function(result) {
                  currentIndex = result.scrapedUrlsCount;
                  console.log('current index is : ', currentIndex);
                  chrome.tabs.remove(request.tabId, () => {});
                  
                  if (urls.length != currentIndex) {
                    chrome.storage.local.get(['flag'], function(result) {
                      flag = result.flag;
                      if (flag == 'start') {
                        chrome.tabs.create({ url: urls[currentIndex] }, (tab) => {
                          chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
                              if (tabId === tab.id && info.status === 'complete') {
                                  chrome.tabs.onUpdated.removeListener(listener);
                                  console.log(currentIndex + ' : url open' + urls[currentIndex]);
                                  chrome.tabs.sendMessage(tabId, { action: 'open url', tabId : tab.id, url: urls[currentIndex]});
                                  chrome.storage.local.set({ "tabId": tab.id}, function () {});
                              }
                          });
                        });
                      }
                    })
                  } else {
                    chrome.storage.local.set({ "scrapedUrlsCount": 0 }, function () {});
                    chrome.storage.local.set({ "urls": [] }, function () {});
                    chrome.storage.local.set({ "flag": '' }, function () {});
                    chrome.storage.local.set({ "tabId": '' }, function () {});
                  }
                })
              }
            } else {
              chrome.tabs.remove(request.tabId, () => {});
              if (urls.length != currentIndex) {
                chrome.storage.local.get(['flag'], function(result) {
                  flag = result.flag;
                  if (flag == 'start') {
                    chrome.tabs.create({ url: urls[currentIndex] }, (tab) => {
                      chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
                          if (tabId === tab.id && info.status === 'complete') {
                              chrome.tabs.onUpdated.removeListener(listener);
                              console.log(currentIndex + ' : url open' + urls[currentIndex]);
                              chrome.tabs.sendMessage(tabId, { action: 'open url', tabId : tab.id, url: urls[currentIndex]});
                              // chrome.tabs.remove(request.tabId, () => {});
                              chrome.storage.local.set({ "tabId": tab.id}, function () {});
                          }
                      });
                    });
                  }
                })
              } else {
                chrome.storage.local.set({ "scrapedUrlsCount": 0 }, function () {});
                chrome.storage.local.set({ "urls": [] }, function () {});
                chrome.storage.local.set({ "flag": '' }, function () {});
                chrome.storage.local.set({ "tabId": '' }, function () {});
              }
            }
      }).catch(function (error) {
        chrome.tabs.remove(request.tabId, () => {});
        if (urls.length != currentIndex) {
          chrome.storage.local.get(['flag'], function(result) {
            flag = result.flag;
            if (flag == 'start') {
              chrome.tabs.create({ url: urls[currentIndex] }, (tab) => {
                chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
                    if (tabId === tab.id && info.status === 'complete') {
                        chrome.tabs.onUpdated.removeListener(listener);
                        console.log(currentIndex + ' : url open' + urls[currentIndex]);
                        chrome.tabs.sendMessage(tabId, { action: 'open url', tabId : tab.id, url: urls[currentIndex]});
                        // chrome.tabs.remove(request.tabId, () => {});
                        chrome.storage.local.set({ "tabId": tab.id}, function () {});
                    }
                });
              });
            }
          })
        } else {
          chrome.storage.local.set({ "scrapedUrlsCount": 0 }, function () {});
          chrome.storage.local.set({ "urls": [] }, function () {});
          chrome.storage.local.set({ "flag": '' }, function () {});
          chrome.storage.local.set({ "tabId": '' }, function () {});
        }
      });
    } else {
      currentIndex = currentIndex + 1;
      chrome.storage.local.set({ "scrapedUrlsCount": currentIndex }, function () {});
      chrome.storage.local.get(['scrapedUrlsCount'], function(result) {
        currentIndex = result.scrapedUrlsCount;
        console.log('current index is : ', currentIndex);
        chrome.tabs.remove(request.tabId, () => {});
        if (urls.length != currentIndex) {
          chrome.storage.local.get(['flag'], function(result) {
            flag = result.flag;
            if (flag == 'start') {
              chrome.tabs.create({ url: urls[currentIndex] }, (tab) => {
                chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
                    if (tabId === tab.id && info.status === 'complete') {
                        chrome.tabs.onUpdated.removeListener(listener);
                        console.log(currentIndex + ' : url open' + urls[currentIndex]);
                        chrome.tabs.sendMessage(tabId, { action: 'open url', tabId : tab.id, url: urls[currentIndex]});
                        // chrome.tabs.remove(request.tabId, () => {});
                        chrome.storage.local.set({ "tabId": tab.id}, function () {});
                    }
                });
              });
            }
          })
        } else {
          chrome.storage.local.set({ "scrapedUrlsCount": 0 }, function () {});
          chrome.storage.local.set({ "urls": [] }, function () {});
          chrome.storage.local.set({ "flag": '' }, function () {});
          chrome.storage.local.set({ "tabId": '' }, function () {});
        }
        
      })
    }    
  } else if (request.action == 'open next page') {
    fetch('http://127.0.0.1:8000/api/combine', {
      method: 'POST',
      headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
      },
      
      body: JSON.stringify({type : 'text', postid : request.fbId, path : ""})
    }).then(function(response) {
      return response.json();
    }).then(function (Data_){
          var obj=Data_;
          if(obj){
              currentIndex = currentIndex + 1;
              chrome.storage.local.set({ "scrapedUrlsCount": currentIndex }, function () {});
                chrome.storage.local.get(['scrapedUrlsCount'], function(result) {
                  currentIndex = result.scrapedUrlsCount;
                  console.log('current index is : ', currentIndex);
                  chrome.tabs.remove(request.tabId, () => {});
                  if (urls.length != currentIndex) {
                    chrome.storage.local.get(['flag'], function(result) {
                      flag = result.flag;
                      if (flag == 'start') {
                        chrome.tabs.create({ url: urls[currentIndex] }, (tab) => {
                          chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
                              if (tabId === tab.id && info.status === 'complete') {
                                  chrome.tabs.onUpdated.removeListener(listener);
                                console.log(currentIndex + ' : url open' + urls[currentIndex]);
                                  chrome.tabs.sendMessage(tabId, { action: 'open url', tabId : tab.id, url: urls[currentIndex]});
                                  // chrome.tabs.remove(request.tabId, () => {});
                                  chrome.storage.local.set({ "tabId": tab.id}, function () {});
                              }
                          });
                        });
                      }
                    })
                  } else {
                    chrome.storage.local.set({ "scrapedUrlsCount": 0 }, function () {});
                    chrome.storage.local.set({ "urls": [] }, function () {});
                    chrome.storage.local.set({ "flag": '' }, function () {});
                    chrome.storage.local.set({ "tabId": '' }, function () {});
                  }
                  
                })
          } else {
            chrome.tabs.remove(request.tabId, () => {});
            if (urls.length != currentIndex) {
              chrome.storage.local.get(['flag'], function(result) {
                flag = result.flag;
                if (flag == 'start') {
                  chrome.tabs.create({ url: urls[currentIndex] }, (tab) => {
                    chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
                        if (tabId === tab.id && info.status === 'complete') {
                            chrome.tabs.onUpdated.removeListener(listener);
                          console.log(currentIndex + ' : url open' + urls[currentIndex]);
                            chrome.tabs.sendMessage(tabId, { action: 'open url', tabId : tab.id, url: urls[currentIndex]});
                            // chrome.tabs.remove(request.tabId, () => {});
                            chrome.storage.local.set({ "tabId": tab.id}, function () {});
      
                        }
                    });
                  });
                }
              })
            } else {
              chrome.storage.local.set({ "scrapedUrlsCount": 0 }, function () {});
              chrome.storage.local.set({ "urls": [] }, function () {});
              chrome.storage.local.set({ "flag": '' }, function () {});
              chrome.storage.local.set({ "tabId": '' }, function () {});
            }
            
          }
    }).catch(function (error) {
      chrome.tabs.remove(request.tabId, () => {});
      if (urls.length != currentIndex) {
        chrome.storage.local.get(['flag'], function(result) {
          flag = result.flag;
          if (flag == 'start') {
            chrome.tabs.create({ url: urls[currentIndex] }, (tab) => {
              chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
                  if (tabId === tab.id && info.status === 'complete') {
                      chrome.tabs.onUpdated.removeListener(listener);
                    console.log(currentIndex + ' : url open' + urls[currentIndex]);
                      chrome.tabs.sendMessage(tabId, { action: 'open url', tabId : tab.id, url: urls[currentIndex]});
                      // chrome.tabs.remove(request.tabId, () => {});
                      chrome.storage.local.set({ "tabId": tab.id}, function () {});
                  }
              });
            });
          }
        })
      } else {
        chrome.storage.local.set({ "scrapedUrlsCount": 0 }, function () {});
        chrome.storage.local.set({ "urls": [] }, function () {});
        chrome.storage.local.set({ "flag": '' }, function () {});
        chrome.storage.local.set({ "tabId": '' }, function () {});
      }
    });
  }
});

// Comments Scrapper

// let comcurrentIndex = 0;

let comurls = [];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.action === 'comstartDownload') {
    
    chrome.storage.local.get(['comurls'], function(result) {
      if (result.comurls) {
        comurls = result.comurls;
        console.log('Retrieved URLs:', comurls);

        chrome.storage.local.get(['comscrapedUrlsCount'], function(result) {
          comcurrentIndex = result.comscrapedUrlsCount;
          console.log('current index is : ', comcurrentIndex);
          chrome.tabs.create({ url: comurls[comcurrentIndex].url }, (tab) => {
            chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
                if (tabId === tab.id && info.status === 'complete') {
                    chrome.tabs.onUpdated.removeListener(listener);
                    console.log(comcurrentIndex + ' : url open ' + comurls[comcurrentIndex].url);
                    chrome.tabs.sendMessage(tabId, { action: 'com open url', comtabId: tab.id, url: comurls[comcurrentIndex].url});
                    chrome.storage.local.set({ "comtabId": tab.id}, function () {});
                }
            });
          });
        })
      } else {
          console.log('No URLs found in storage.');
      }
    });

  } else if (request.action === 'com open image') {
    chrome.tabs.remove(request.comtabId, () => {});
    chrome.tabs.create({ url: request.imageUrl }, (tab) => {
      chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
          if (tabId === tab.id && info.status === 'complete') {
              chrome.tabs.onUpdated.removeListener(listener);
              chrome.tabs.sendMessage(tabId, { action: 'com image opened', comtabId : tab.id , fbId : request.fbId, allImagesURL : request.allImagesURL, openedUrl: request.openedUrl });
              chrome.storage.local.set({ "comtabId": tab.id}, function () {});
          }
      });
    });

  } else if (request.action == 'com open link') {
    chrome.tabs.remove(request.comtabId, () => {});
    chrome.tabs.create({ url: request.imageUrl }, (tab) => {
      chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
          if (tabId === tab.id && info.status === 'complete') {
              chrome.tabs.onUpdated.removeListener(listener);
              chrome.tabs.sendMessage(tabId, { action: 'com opened linked', comtabId : tab.id , fbId : request.fbId });
              chrome.storage.local.set({ "comtabId": tab.id}, function () {});
          }
      });
    });
  }
  
  else if (request.action === 'com download image') {

    chrome.tabs.sendMessage(request.comtabId, {action: 'com image downloaded', comtabId : request.tabId, fbId : request.fbId});
    chrome.storage.local.set({ "comtabId": tab.id}, function () {});

  } else if (request.action === 'com all images downloaded') {
    chrome.tabs.remove(request.comtabId, () => {});
    imagesURLS = request.imageUrl;

    if (imagesURLS.length > 0) {
      imageCounter = request.imageCounter;
      fetch('http://127.0.0.1:8000/api/combine', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        
        body: JSON.stringify({type : request.type, postid : request.fbId, path : request.imageUrl, imageCounter :imageCounter})
      }).then(function(response) {
        return response.json();
      }).then(function (Data_){
            var obj=Data_;
            if(obj){

              // if (request.comflag) {
              //   chrome.storage.local.get(['comflag'], function(result) {
              //     comflag = result.comflag;
              //     if (comflag == 'comstart') {
              //       chrome.tabs.sendMessage(request.tabId, {action: 'com image downloaded', comtabId : request.tabId, fbId : request.fbId, flag : 'com images saved'});
              //       chrome.storage.local.set({ "comtabId": request.tabId}, function () {});
              //     }
              //   })
              // } else {
                comcurrentIndex = comcurrentIndex + 1;
                chrome.storage.local.set({ "comscrapedUrlsCount": comcurrentIndex }, function () {});

                chrome.storage.local.get(['comscrapedUrlsCount'], function(result) {
                  comcurrentIndex = result.comscrapedUrlsCount;
                  console.log('current index is : ', comcurrentIndex);
                  // chrome.tabs.remove(request.comtabId, () => {});

                  if (comurls.length != comcurrentIndex) {
                    chrome.storage.local.get(['comflag'], function(result) {
                      comflag = result.comflag;
                      if (comflag == 'comstart') {
                        chrome.tabs.create({ url: comurls[comcurrentIndex].url  }, (tab) => {
                          chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
                              if (tabId === tab.id && info.status === 'complete') {
                                chrome.tabs.onUpdated.removeListener(listener);
                                console.log(comcurrentIndex + ' : url open ' + comurls[comcurrentIndex].url );
                                chrome.tabs.sendMessage(tabId, { action: 'com open url', comtabId : tab.id, url: comurls[comcurrentIndex].url });
                                chrome.storage.local.set({ "comtabId": request.tabId}, function () {});
                              }
                          });
                        });
                      }
                    })
                  } else {
                    chrome.storage.local.set({ "comscrapedUrlsCount": 0 }, function () {});
                    chrome.storage.local.set({ "comurls": [] }, function () {});
                    chrome.storage.local.set({ "comflag": '' }, function () {});
                    chrome.storage.local.set({ "comtabId": '' }, function () {});
                  } 
                })
              // }
            } else {
              if (comurls.length != comcurrentIndex) {
                chrome.storage.local.get(['comflag'], function(result) {
                  comflag = result.comflag;
                  if (comflag == 'comstart') {
                    chrome.tabs.create({ url: comurls[comcurrentIndex].url  }, (tab) => {
                      chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
                          if (tabId === tab.id && info.status === 'complete') {
                              chrome.tabs.onUpdated.removeListener(listener);
                              console.log(comcurrentIndex + ' : url open ' + ccomurls[comcurrentIndex].url );
                              chrome.tabs.sendMessage(tabId, { action: 'com open url', comtabId : tab.id, url: comurls[comcurrentIndex].url });
                              chrome.storage.local.set({ "comtabId": tab.id}, function () {});
                          }
                      });
                    });
                  }
                })
              } else {
                chrome.storage.local.set({ "comscrapedUrlsCount": 0 }, function () {});
                chrome.storage.local.set({ "comurls": [] }, function () {});
                chrome.storage.local.set({ "comflag": '' }, function () {});
                chrome.storage.local.set({ "comtabId": '' }, function () {});
              }
            }
      }).catch(function (error) {
        chrome.tabs.remove(request.comtabId, () => {});
        // comcurrentIndex = comcurrentIndex + 1;
        // chrome.storage.local.set({ "comscrapedUrlsCount": comcurrentIndex }, function () {});

        chrome.storage.local.get(['comscrapedUrlsCount'], function(result) {
          comcurrentIndex = result.comscrapedUrlsCount;
          comcurrentIndex = comcurrentIndex + 1
          chrome.storage.local.set({ "comscrapedUrlsCount": comcurrentIndex }, function () {});
          console.log('current index is : ', comcurrentIndex);
          if (comurls.length != comcurrentIndex) {
            chrome.storage.local.get(['comflag'], function(result) {
              comflag = result.comflag;
              if (comflag == 'comstart') {
                chrome.tabs.create({ url: comurls[comcurrentIndex].url  }, (tab) => {
                  chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
                      if (tabId === tab.id && info.status === 'complete') {
                          chrome.tabs.onUpdated.removeListener(listener);
                        console.log(comcurrentIndex + ' : url open ' + comurls[comcurrentIndex].url );
                          chrome.tabs.sendMessage(tabId, { action: 'open url', comtabId : tab.id, url: comurls[comcurrentIndex].url });
                          chrome.storage.local.set({ "comtabId": tab.id}, function () {});
                      }
                  });
                });
              }
            })
          } else {
            chrome.storage.local.set({ "comscrapedUrlsCount": 0 }, function () {});
            chrome.storage.local.set({ "comurls": [] }, function () {});
            chrome.storage.local.set({ "comflag": '' }, function () {});
            chrome.storage.local.set({ "comtabId": '' }, function () {});
          }
        })
        
      });
    } else {
        chrome.storage.local.set({ "comscrapedUrlsCount": comcurrentIndex }, function () {});
        chrome.storage.local.get(['comscrapedUrlsCount'], function(result) {
          comcurrentIndex = result.comscrapedUrlsCount;
          console.log('current index is : ', comcurrentIndex);
          chrome.tabs.remove(request.tabId, () => {});
          if (comurls.length != comcurrentIndex) {
            chrome.storage.local.get(['comflag'], function(result) {
              comflag = result.comflag;
              if (comflag == 'comstart') {
                chrome.tabs.create({ url: comurls[comcurrentIndex].url  }, (tab) => {
                  chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
                      if (tabId === tab.id && info.status === 'complete') {
                        chrome.tabs.onUpdated.removeListener(listener);
                        console.log(comcurrentIndex + ' : url open ' + comurls[comcurrentIndex].url);
                        chrome.tabs.sendMessage(tabId, { action: 'com open url', comtabId : tab.id, url: comurls[comcurrentIndex].url });
                        chrome.storage.local.set({ "comtabId": tab.id}, function () {});
                      }
                  });
                });
              }
            })
          } else {
            chrome.storage.local.set({ "comscrapedUrlsCount": 0 }, function () {});
            chrome.storage.local.set({ "comurls": [] }, function () {});
            chrome.storage.local.set({ "comflag": '' }, function () {});
            chrome.storage.local.set({ "comtabId": '' }, function () {});
          }
          
        })
    }    
  } else if (request.action == 'com open next page') {
    chrome.tabs.remove(request.comtabId, () => {});

      

      chrome.storage.local.set({ "comscrapedUrlsCount": comcurrentIndex+1 }, function () {});
      chrome.storage.local.get(['comscrapedUrlsCount'], function(result) {
        comcurrentIndex = result.comscrapedUrlsCount;
        console.log('current index is : ', comcurrentIndex);
        chrome.tabs.remove(request.comtabId, () => {});
        if (comurls.length != comcurrentIndex) {
          chrome.storage.local.get(['comflag'], function(result) {
            comflag = result.comflag;
            if (comflag == 'comstart') {
              chrome.tabs.create({ url: comurls[comcurrentIndex].url }, (tab) => {
                chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
                    if (tabId === tab.id && info.status === 'complete') {
                        chrome.tabs.onUpdated.removeListener(listener);
                        console.log(comcurrentIndex + ' : url open ' + comurls[comcurrentIndex].url);
                        chrome.tabs.sendMessage(tabId, { action: 'com open url', comtabId : tab.id, url: comurls[comcurrentIndex].url});
                        chrome.storage.local.set({ "comtabId": tab.id}, function () {});
                    }
                });
              });
            }
          })
        } else {
          chrome.storage.local.set({ "comscrapedUrlsCount": 0 }, function () {});
          chrome.storage.local.set({ "comurls": [] }, function () {});
          chrome.storage.local.set({ "comflag": '' }, function () {});
          chrome.storage.local.set({ "comtabId": '' }, function () {});
        }
        
      })
  }
});