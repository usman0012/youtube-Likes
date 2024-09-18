chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'open url') {

    pageloadingtime = Math.floor(Math.random() * (10-5+1)) + 5;
    arrImagesUrl = [];
    arrTempImagesUrl = [];

    setTimeout(() => {

      scrollDownWithDelay();

      // element = document.querySelectorAll('div[aria-posinset="1"]')[0];
      // element = document.querySelectorAll('div[aria-describedby]')[0]

      // if (element) {
          
      //   var spans = document.querySelectorAll('span');
      //   var spansWithPDF = Array.prototype.filter.call(spans, function(span) {
      //     return span.textContent.includes('PDF');
      //   });

      //   if (spansWithPDF.length > 0) {

      //     ispdf = false;
      //     for (var i = 0 ; i < spansWithPDF.length ; i++) {
      //       if (spansWithPDF[i].closest('a')) {
      //         ispdf = true;
      //         pdfURL = spansWithPDF[i].closest('a').getAttribute('href');          ;
      //         postId = message.url.split('permalink')[1].replaceAll('/', '');
      //         chrome.runtime.sendMessage({ action: 'all images downloaded', imageUrl: pdfURL, tabId : message.tabId, fbId : postId, type : 'pdf'});
      //         return;
      //       }
      //     }
      //     if (!ispdf) {
      //       postId = message.url.split('permalink')[1].replaceAll('/', '');
      //       chrome.runtime.sendMessage({ action: 'open next page', tabId : message.tabId,fbId : postId,});
      //       return;
      //     }
      //   } else {
      //     postImagCount = element.querySelectorAll('img').length;
      //     imgElement = '';
      //     for(x = 0; x < postImagCount; x++) {

      //       imgElement = element.querySelectorAll('img')[x];
      //       refferPolicy = imgElement.getAttribute('referrerpolicy')
      //       imageSRC = imgElement.getAttribute('src')
      //       if (imageSRC.includes('https://scontent')) {
      //         break;
      //       }
      //     }
      //     // if(postImagCount > 1) {
      //     // } else {
      //     //    imgElement = element.querySelectorAll('img')[0];
      //     // }

      //     if (imgElement && imgElement.closest('a')) {
      //       const href = imgElement.closest('a').getAttribute('href');

      //       if (href.includes('?__cft')) {
      //         postId = message.url.split('permalink')[1].replaceAll('/', '');
      //         chrome.runtime.sendMessage({ action: 'open next page', tabId : message.tabId,fbId : postId,});
      //         // chrome.runtime.sendMessage({ action: 'open next page', tabId : message.tabId,});
      //         return;
      //       } else {
      //         postid  = message.url.split('permalink')[1].replaceAll('/', '');
      //         fbId    = getParameterByName('fbid', href);
      //         pcbId   = getParameterByName('set', href);

      //         if (!fbId || !pcbId) { 
      //           postId = message.url.split('permalink')[1].replaceAll('/', '');
      //           chrome.runtime.sendMessage({ action: 'open next page', tabId : message.tabId,fbId : postId,});
      //           // chrome.runtime.sendMessage({ action: 'open next page', tabId : message.tabId,});
      //           return;
      //         } else {

      //           fbidURL = `https://www.facebook.com/photo/?fbid=${fbId}&set=${pcbId}`;
      
      //           chrome.runtime.sendMessage({ action : 'open image', imageUrl : fbidURL, tabId : message.tabId, fbId : postid});
      //           return;
      //         }
    
      //       }
      //     }
      //   }
      //   if (!fbId) {
      //     fbId = message.url.split('permalink')[1].replaceAll('/', '');
      //     const scriptElements = Array.from(document.querySelectorAll('script[type="application/json"]'));
      //     const filteredScript = scriptElements.find(x => x.textContent.includes('"mime_type":"video') && x.textContent.includes('base_url'));
          
      //     if (filteredScript) {
      //       const jsonString = filteredScript.textContent.replace('\\"', '')
      //       const jsonstr = JSON.parse(jsonString);
      //       console.log(jsonstr);
            
      //       function findAllKeys(obj, keyToFind) {
      //         let results = [];
              
      //         function recursiveSearch(obj) {
      //             if (obj === null || typeof obj !== 'object') return;
          
      //             if (obj.hasOwnProperty(keyToFind)) {
      //                 results.push(obj[keyToFind]);
      //             }
          
      //             for (let key in obj) {
      //                 if (obj.hasOwnProperty(key)) {
      //                     recursiveSearch(obj[key]);
      //                 }
      //             }
      //         }
          
      //         recursiveSearch(obj);
      //         return results;
      //       }
          
      //       let baseURLs = findAllKeys(jsonstr, 'base_url');
            
      //       let firstBaseURL = baseURLs.length > 0 ? baseURLs[0] : undefined;
      //       let lastBaseURL = baseURLs.length > 0 ? baseURLs[baseURLs.length - 1] : undefined;
            
      //       console.log('First base_url:', firstBaseURL);
      //       console.log('Last base_url:', lastBaseURL);
    
      //       arrImagesUrl.push(firstBaseURL);
      //       arrImagesUrl.push(lastBaseURL);
    
      //       chrome.runtime.sendMessage({ action: 'all images downloaded', imageUrl: arrImagesUrl, tabId : message.tabId, fbId : fbId, type : 'vidoe'});
      //       return;
      //     } else {
      //       postId = message.url.split('permalink')[1].replaceAll('/', '');
      //       chrome.runtime.sendMessage({ action: 'open next page', tabId : message.tabId,fbId : postId,});
      //       // chrome.runtime.sendMessage({ action: 'open next page', tabId : message.tabId});
      //       return;
      //     }
          
  
      //     // chrome.runtime.sendMessage({ action : 'download vidoes', videoURL : firstBaseURL, audioURL : lastBaseURL, tabId : message.tabId, fbId : fbId, type : 'vidoe'});
      //   }
      // } else {
      //   postId = message.url.split('permalink')[1].replaceAll('/', '');
      //   chrome.runtime.sendMessage({ action: 'open next page', tabId : message.tabId,fbId : postId,});
      //   // chrome.runtime.sendMessage({ action: 'open next page', tabId : message.tabId});
      //   return;
      // }
    // }, pageloadingtime * 1000);
  }, 10000);


  } else if (message.action === 'image opened') {
    
    imageOpeningTime =  Math.floor(Math.random() * 4) + 2;
    setTimeout(() => {

      fullPath = document.querySelectorAll('img[data-visualcompletion="media-vc-image"]')[0].getAttribute('src');
      
      arrImagesUrl.push(fullPath);
      arrTempImagesUrl.push(fullPath);


      chrome.runtime.sendMessage({ action: 'download image', imageUrl: fullPath, tabId : message.tabId, fbId : message.fbId });
    }, imageOpeningTime * 1000);

  } else if (message.action === 'image downloaded') {
    imageOpeningTime =  Math.floor(Math.random() * 4) + 2;

    document.getElementsByClassName("x14yjl9h xudhj91 x18nykt9 xww2gxu x6s0dn4 x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x3nfvp2 xl56j7k x1n2onr6 x1qhmfi1 xsdox4t x1useyqa")[1].click();

    setTimeout(() => {

      fullPath = document.querySelectorAll('img[data-visualcompletion="media-vc-image"]')[0].getAttribute('src');
      exists   = arrImagesUrl.includes(fullPath);

      if (message.flag == 'images saved') {
        imageCounter = imageCounter + arrTempImagesUrl.length; 
        arrTempImagesUrl = [];
      }

      if (!exists) {
        arrImagesUrl.push(fullPath);
        arrTempImagesUrl.push(fullPath);

        if (arrTempImagesUrl.length == 20) {
          chrome.runtime.sendMessage({ action: 'all images downloaded', imageUrl: arrTempImagesUrl, tabId : message.tabId, fbId : message.fbId, type : 'image', flag : 'not completed', imageCounter : imageCounter });
        } else {
          chrome.runtime.sendMessage({ action: 'download image', imageUrl: fullPath, tabId : message.tabId, fbId : message.fbId });
        }
      } else {
        console.log(arrImagesUrl);
        imageCounter = 0;
        chrome.runtime.sendMessage({ action: 'all images downloaded', imageUrl: arrTempImagesUrl, tabId : message.tabId, fbId : message.fbId, type : 'image', imageCounter : arrImagesUrl.length});
      }

    }, imageOpeningTime * 1000);
  }
});

function scrollDownWithDelay() {
  const scrollAmount = 200; // Amount to scroll (in pixels)
  const delay = 5000; // 5 seconds

  const scrollInterval = setInterval(function() {
      const currentScrollPosition = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;

      // Scroll down by the specified amount
      window.scrollBy(0, scrollAmount);

      // Check if we've reached the bottom
      if (currentScrollPosition + windowHeight >= documentHeight) {
          clearInterval(scrollInterval);
          console.log("Reached the bottom or can't scroll further.");
          likes();
      }
  }, delay);
}

function likes() {
  element = document.getElementsByClassName('yt-spec-button-shape-next yt-spec-button-shape-next--text yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-s yt-spec-button-shape-next--icon-button yt-spec-button-shape-next--override-small-size-icon yt-spec-button-shape-next--enable-backdrop-filter-experiment');

  for(var x = 0; x < element.length; x+=2) {
    const randomDelay = (Math.floor(Math.random() * 3) + 1) * 1000; // 1000 ms = 1 second 
      setTimeout(function(index) {
          return function() {
              element[index].click();
              console.log(`Clicked element ${index} after ${randomDelay / 1000} seconds`);
          };
      }(x), randomDelay);
  }
}