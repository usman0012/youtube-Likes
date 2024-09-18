chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'open url') {

    pageloadingtime = Math.floor(Math.random() * (10-5+1)) + 5;
    arrImagesUrl = [];
    arrTempImagesUrl = [];

    setTimeout(() => {
      scrollDownWithDelay(message.tabId);
    }, 10000);
  }
});

function scrollDownWithDelay(tabid) {
  document.querySelector('video').pause();
  const scrollAmount = 200; // Amount to scroll (in pixels)
  const delay = 5000; // 5 seconds

  const scrollInterval = setInterval(function() {
      window.scrollBy(0, scrollAmount);

      element = document.getElementsByClassName('yt-spec-button-shape-next yt-spec-button-shape-next--text yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-s yt-spec-button-shape-next--icon-button yt-spec-button-shape-next--override-small-size-icon yt-spec-button-shape-next--enable-backdrop-filter-experiment')[0];
      if(element) {
        clearInterval(scrollInterval);
        likes(tabid);
      }
  }, delay);
}

function likes(tabid) {
  element = document.getElementsByClassName('yt-spec-button-shape-next yt-spec-button-shape-next--text yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-s yt-spec-button-shape-next--icon-button yt-spec-button-shape-next--override-small-size-icon yt-spec-button-shape-next--enable-backdrop-filter-experiment')[0];

  if(element && element.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.children[1].innerText == 'Highlighted comment') {
    element.click();
  }
  OpenNewURL(tabid)
}

function OpenNewURL(tabid) {
  chrome.runtime.sendMessage({ action: 'open new url', tabId : tabid,});

}