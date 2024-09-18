
arrImagesUrl = [];
arrTempImagesUrl = [];
let exists   = false;
let fbId     = '';
let fbidURL  = '';
let pcbId    = '';
let fullPath = '';
let element  = '';
let href     = '';
let regex    = '';
let results  = '';
let imageCounter = 20;
let videoURL = '';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'open url') {

    pageloadingtime = Math.floor(Math.random() * (10-5+1)) + 5;
    arrImagesUrl = [];
    arrTempImagesUrl = [];

    setTimeout(() => {

      // element = document.querySelectorAll('div[aria-posinset="1"]')[0];
      element = document.querySelectorAll('div[aria-describedby]')[0]

      if (element) {
          
        var spans = document.querySelectorAll('span');
        var spansWithPDF = Array.prototype.filter.call(spans, function(span) {
          return span.textContent.includes('PDF');
        });

        if (spansWithPDF.length > 0) {

          ispdf = false;
          for (var i = 0 ; i < spansWithPDF.length ; i++) {
            if (spansWithPDF[i].closest('a')) {
              ispdf = true;
              pdfURL = spansWithPDF[i].closest('a').getAttribute('href');          ;
              postId = message.url.split('permalink')[1].replaceAll('/', '');
              chrome.runtime.sendMessage({ action: 'all images downloaded', imageUrl: pdfURL, tabId : message.tabId, fbId : postId, type : 'pdf'});
              return;
            }
          }
          if (!ispdf) {
            postId = message.url.split('permalink')[1].replaceAll('/', '');
            chrome.runtime.sendMessage({ action: 'open next page', tabId : message.tabId,fbId : postId,});
            return;
          }
        } else {
          postImagCount = element.querySelectorAll('img').length;
          imgElement = '';
          for(x = 0; x < postImagCount; x++) {

            imgElement = element.querySelectorAll('img')[x];
            refferPolicy = imgElement.getAttribute('referrerpolicy')
            imageSRC = imgElement.getAttribute('src')
            if (imageSRC.includes('https://scontent')) {
              break;
            }
          }
          // if(postImagCount > 1) {
          // } else {
          //    imgElement = element.querySelectorAll('img')[0];
          // }

          if (imgElement && imgElement.closest('a')) {
            const href = imgElement.closest('a').getAttribute('href');

            if (href.includes('?__cft')) {
              postId = message.url.split('permalink')[1].replaceAll('/', '');
              chrome.runtime.sendMessage({ action: 'open next page', tabId : message.tabId,fbId : postId,});
              // chrome.runtime.sendMessage({ action: 'open next page', tabId : message.tabId,});
              return;
            } else {
              postid  = message.url.split('permalink')[1].replaceAll('/', '');
              fbId    = getParameterByName('fbid', href);
              pcbId   = getParameterByName('set', href);

              if (!fbId || !pcbId) { 
                postId = message.url.split('permalink')[1].replaceAll('/', '');
                chrome.runtime.sendMessage({ action: 'open next page', tabId : message.tabId,fbId : postId,});
                // chrome.runtime.sendMessage({ action: 'open next page', tabId : message.tabId,});
                return;
              } else {

                fbidURL = `https://www.facebook.com/photo/?fbid=${fbId}&set=${pcbId}`;
      
                chrome.runtime.sendMessage({ action : 'open image', imageUrl : fbidURL, tabId : message.tabId, fbId : postid});
                return;
              }
    
            }
          }
        }
        if (!fbId) {
          fbId = message.url.split('permalink')[1].replaceAll('/', '');
          const scriptElements = Array.from(document.querySelectorAll('script[type="application/json"]'));
          const filteredScript = scriptElements.find(x => x.textContent.includes('"mime_type":"video') && x.textContent.includes('base_url'));
          
          if (filteredScript) {
            const jsonString = filteredScript.textContent.replace('\\"', '')
            const jsonstr = JSON.parse(jsonString);
            console.log(jsonstr);
            
            function findAllKeys(obj, keyToFind) {
              let results = [];
              
              function recursiveSearch(obj) {
                  if (obj === null || typeof obj !== 'object') return;
          
                  if (obj.hasOwnProperty(keyToFind)) {
                      results.push(obj[keyToFind]);
                  }
          
                  for (let key in obj) {
                      if (obj.hasOwnProperty(key)) {
                          recursiveSearch(obj[key]);
                      }
                  }
              }
          
              recursiveSearch(obj);
              return results;
            }
          
            let baseURLs = findAllKeys(jsonstr, 'base_url');
            
            let firstBaseURL = baseURLs.length > 0 ? baseURLs[0] : undefined;
            let lastBaseURL = baseURLs.length > 0 ? baseURLs[baseURLs.length - 1] : undefined;
            
            console.log('First base_url:', firstBaseURL);
            console.log('Last base_url:', lastBaseURL);
    
            arrImagesUrl.push(firstBaseURL);
            arrImagesUrl.push(lastBaseURL);
    
            chrome.runtime.sendMessage({ action: 'all images downloaded', imageUrl: arrImagesUrl, tabId : message.tabId, fbId : fbId, type : 'vidoe'});
            return;
          } else {
            postId = message.url.split('permalink')[1].replaceAll('/', '');
            chrome.runtime.sendMessage({ action: 'open next page', tabId : message.tabId,fbId : postId,});
            // chrome.runtime.sendMessage({ action: 'open next page', tabId : message.tabId});
            return;
          }
          
  
          // chrome.runtime.sendMessage({ action : 'download vidoes', videoURL : firstBaseURL, audioURL : lastBaseURL, tabId : message.tabId, fbId : fbId, type : 'vidoe'});
        }
      } else {
        postId = message.url.split('permalink')[1].replaceAll('/', '');
        chrome.runtime.sendMessage({ action: 'open next page', tabId : message.tabId,fbId : postId,});
        // chrome.runtime.sendMessage({ action: 'open next page', tabId : message.tabId});
        return;
      }
    }, pageloadingtime * 1000);

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

function getParameterByName(name, url) 
{
  name    = name.replace(/[\[\]]/g, '\\$&');
  regex   = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  results = regex.exec(url);

  if (!results) return null;
  if (!results[2]) return '';

  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

async function downloadBlobVideo(blobUrl) {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  alert(url);
}



// comments scrapper



// arrImagesUrl = [];
// arrTempImagesUrl = [];
// let exists   = false;
// let fbId     = '';
// let fbidURL  = '';
// let pcbId    = '';
// let fullPath = '';
// let element  = '';
// let href     = '';
// let regex    = '';
// let results  = '';
// let imageCounter = 0;
// let videoURL = '';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'com open url') {
    imageCounter = 0;
    pageloadingtime = Math.floor(Math.random() * (10-5+1)) + 5;
    arrImagesUrl = [];
    // arrTempImagesUrl = [];
    imageOpeningTime =  Math.floor(Math.random() * 6) + 2;
    setTimeout(() => {

      function loadAllComments() {
        // Select the initial set of spans
        let element = document.getElementsByClassName('html-div xe8uvvx x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x1gslohp');
        spans = '';
        if(element.length > 0) {
          spans = element[0].querySelectorAll('span');
        }

        function scrollAndCheck() {
          let lastScrollTop = window.scrollY; // Capture the current scroll position
          
          // Scroll down by a large amount (you can adjust this value as needed)
          window.scrollTo(0, document.body.scrollHeight);
    
          // Wait for 7 seconds and then check if the scroll position has changed
          setTimeout(() => {
            let currentScrollTop = window.scrollY;
            
            // If the scroll position changed, call the function again, else exit and call loadAllReplies
            if (currentScrollTop > lastScrollTop) {
              scrollAndCheck(); // Scroll again as there may be more comments
            } else {
              loadAllReplies(); // All comments loaded, call loadAllReplies
              console.log('All comments loaded');
            }
          }, 7000); // 7-second wait time
        }
        scrollAndCheck()
        // Function to find and click the "View more comments" button
        // function clickViewMore() {
        //   let spansWithMoreComments = Array.prototype.filter.call(spans, function(span) {
        //     return span.textContent.includes('View more comments');
        //   });
        
        //   if (spansWithMoreComments.length > 0) {
        //     spansWithMoreComments[0].click();
        //     setTimeout(loadAllComments, 2000); // Call the function again after 1 second
        //   } else {
        //     loadAllReplies();
        //     console.log('All comments loaded');
        //   }
        // }
      
        // // Call the function to start the process
        // clickViewMore();
      }

      function loadAllReplies() {
        // Select the initial set of comments
        // let element = document.getElementsByClassName('html-div xe8uvvx x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x1gslohp');
        let element = document.querySelectorAll('div[data-virtualized="false"]');
        // Function to find and click the "replied" button recursively
        function clickReplies() {
          let allRepliesLoaded = true;
      
          for (let i = 0; i < element.length; i++) {
            let spans = element[i].querySelectorAll('span');
      
            let spansWithReply = Array.prototype.filter.call(spans, function(span) {
              let text = span.textContent.trim();
              let lastWord = text.split(' ').pop();
              return lastWord === 'replied';
            });
      
            if (spansWithReply.length > 0) {
              spansWithReply[0].click();
              allRepliesLoaded = false; 
              break; 
            }
          }
      
          if (!allRepliesLoaded) {
            setTimeout(loadAllReplies, 2000);
          } else {
            console.log('All replies loaded');
            getImages();
          }
        }
      
        // Call the function to start the process
        clickReplies();
      }

      function getImages() {
        // let element = document.querySelectorAll('div[data-virtualized="false"]');
        // let image = document.getElementsByClassName('html-div xe8uvvx x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x1gslohp')[0].querySelectorAll('img')
        // let image = document.getElementsByClassName('x1tlxs6b x1g8br2z x1gn5b1j x230xth x1rg5ohu x12nagc x193iq5w x6ikm8r x10wlt62 x1n2onr6 xxymvpz x1gslohp')[0].querySelectorAll('img')
        let images = document.getElementsByClassName('x78zum5 xv55zj0 x1vvkbs')
        // for (var i = 1; i < element.length; i++) {
          // image = element[i].querySelectorAll('img');
          if(images.length > 0) {
            for (var j = 0; j < images.length; j++) {
              image = images[j].querySelectorAll('img');
              for (var x = 0; x < image.length; x++) {
                let src = image[x].getAttribute('src');
                if (src.includes('https://scontent')) {
  
                  alink = image[x].closest('a')
                  if(alink) {
                    herf = alink.getAttribute('href')
                    if(herf.includes('?fbid=')) {
                      if (!arrImagesUrl.includes(herf)){
                        arrImagesUrl.push(herf);
                      }
                    }
                  }
                }
              }
          }
        }
        if(arrImagesUrl.length  == 0){
          chrome.runtime.sendMessage({ action : 'com open next page', comtabId : message.comtabId});
        } else {
          console.log(message.url);
          postId = message.url.split('permalink')[1].replaceAll('/', '');
          chrome.runtime.sendMessage({ action : 'com open image', imageUrl : arrImagesUrl[0], comtabId : message.comtabId, fbId : postId, allImagesURL : arrImagesUrl, openedUrl : 0});
           console.log(arrImagesUrl);
        }
      }
      
      // Start loading all comments
      loadAllComments();

    }, pageloadingtime * 1000)

    
  }  else if (message.action === 'com image opened') {
         if((message.openedUrl + 1) <= message.allImagesURL.length) {
           imageOpeningTime =  Math.floor(Math.random() * 4) + 2;
           setTimeout(() => {
              
             fullPath = document.querySelectorAll('img[data-visualcompletion="media-vc-image"]')[0].getAttribute('src');
             if(message.openedUrl == 0) {
              chrome.storage.local.set({ "arrTempImagesUrl": [fullPath] }, function () {});

              if((message.openedUrl + 1) < message.allImagesURL.length) {
                    chrome.runtime.sendMessage({ action: 'com open image', imageUrl: message.allImagesURL[message.openedUrl + 1], comtabId : message.comtabId, fbId : message.fbId, allImagesURL : message.allImagesURL, openedUrl:  message.openedUrl + 1});
                  } else {
                    arrTempImagesUrl.push(fullPath);
                    console.log(arrTempImagesUrl);
                    chrome.runtime.sendMessage({ action: 'com all images downloaded', imageUrl: arrTempImagesUrl, comtabId : message.comtabId, fbId : message.fbId, type : 'comment image'});
                  }
             } else {
                chrome.storage.local.get("arrTempImagesUrl", function (result) {
                  let arrTempImagesUrl = result.arrTempImagesUrl;
                  arrTempImagesUrl.push(fullPath);
                  chrome.storage.local.set({ "arrTempImagesUrl": arrTempImagesUrl }, function () {});

                  if((message.openedUrl + 1) < message.allImagesURL.length) {
                    chrome.runtime.sendMessage({ action: 'com open image', imageUrl: message.allImagesURL[message.openedUrl + 1], comtabId : message.comtabId, fbId : message.fbId, allImagesURL : message.allImagesURL, openedUrl:  message.openedUrl + 1});
                  } else {
                    console.log(arrTempImagesUrl);
                    chrome.runtime.sendMessage({ action: 'com all images downloaded', imageUrl: arrTempImagesUrl, comtabId : message.comtabId, fbId : message.fbId, type : 'comment image'});
                  }
                });
             }
           },  imageOpeningTime * 1000);
         } else {
          chrome.storage.local.get("arrTempImagesUrl", function (result) {
            let arrTempImagesUrl = result.arrTempImagesUrl;
            chrome.runtime.sendMessage({ action: 'com all images downloaded', imageUrl: arrTempImagesUrl, comtabId : message.comtabId, fbId : message.fbId, type : 'comment image'});
          });
         }
      }
  })