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
      const currentScrollPosition = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;

      // Scroll down by the specified amount
      window.scrollBy(0, scrollAmount);

      // Check if we've reached the bottom
      if (currentScrollPosition + windowHeight >= documentHeight) {
          clearInterval(scrollInterval);
          console.log("Reached the bottom or can't scroll further.");
          likes(tabid);
      }
  }, delay);
}

function likes(tabid) {
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

  OpenNewURL(tabid)
}

function OpenNewURL(tabid) {
  chrome.runtime.sendMessage({ action: 'open new url', tabId : tabid,});

}