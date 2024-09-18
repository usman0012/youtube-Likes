
var AllUrls = [];
var urls = [];

temIndex = 0;
temUrls = [];

var comurls =[];

comtemIndex = 0;
comtemUrls = [];

$( window ).on("load", function() {
    
    chrome.storage.local.get(['scrapedUrlsCount'], function(result) {
        currentIndex = result.scrapedUrlsCount;
        if (currentIndex ) {
            index = parseInt(currentIndex, 10) ; 
            temIndex = index;
            document.getElementById('scrapedUrls').innerHTML = " Total number of scrapped urls : " + index;
        } else {
            document.getElementById('scrapedUrls').innerHTML = " Total number of scrapped urls : 0"
        }
    })

    chrome.storage.local.get(['urls'], function(result) {
        url = result.urls;
        temUrls = url
        if (url) {
            document.getElementById('totalUrls').innerHTML = " Total number of Urls : " + url.length

        } else {
            document.getElementById('totalUrls').innerHTML = " Total number of Urls : 0"

        }
    })

    chrome.storage.local.get(['flag'], function(result) {
        flag = result.flag;
        if (flag) {

            if (flag == 'paused') {
                document.getElementById('start-download').innerHTML = 'Start Downloading';
    
            } else {
                document.getElementById('start-download').innerHTML = 'Pause Downloading';
    
            }
        } else {
            document.getElementById('start-download').innerHTML = 'Start Downloading';

        }
    })

    if (temUrls.length > 0 && temUrls.length  == temIndex ) {
        chrome.storage.local.set({ "scrapedUrlsCount": 0 }, function () {});
        chrome.storage.local.set({ "urls": [] }, function () {});
        chrome.storage.local.set({ "flag": '' }, function () {});
        chrome.storage.local.set({ "tabId": '' }, function () {});
        urls = [];
    }

    // commments Scrapper

    chrome.storage.local.get(['comscrapedUrlsCount'], function(result) {
        comcurrentIndex = result.comscrapedUrlsCount;
        if (comcurrentIndex ) {
            comindex = parseInt(comcurrentIndex, 10) ; 
            comtemIndex = comindex;
            document.getElementById('comscrapedUrls').innerHTML = " Total number of scrapped urls : " + comindex;
        } else {
            document.getElementById('comscrapedUrls').innerHTML = " Total number of scrapped urls : 0"
        }
    })

    chrome.storage.local.get(['comurls'], function(result) {
        comurl = result.comurls;
        comtemUrls = comurl
        if (comurl) {
            document.getElementById('comtotalUrls').innerHTML = " Total number of Urls : " + comurl.length

        } else {
            document.getElementById('comtotalUrls').innerHTML = " Total number of Urls : 0"

        }
    })

    chrome.storage.local.get(['comflag'], function(result) {
        comflag = result.comflag;
        if (comflag) {

            if (comflag == 'compaused') {
                document.getElementById('com_start-download').innerHTML = 'Start Comments Downloading';
    
            } else {
                document.getElementById('com_start-download').innerHTML = 'Pause Comments Downloading';
    
            }
        } else {
            document.getElementById('com_start-download').innerHTML = 'Start Comments Downloading';

        }
    })

    if (comtemUrls.length > 0 && comtemUrls.length  == comtemIndex ) {
        chrome.storage.local.set({ "comscrapedUrlsCount": 0 }, function () {});
        chrome.storage.local.set({ "comurls": [] }, function () {});
        chrome.storage.local.set({ "comflag": '' }, function () {});
        chrome.storage.local.set({ "comtabId": '' }, function () {});
        comurls = [];
    }

})

    document.getElementById('jsonFile').addEventListener('change', function(event) {
        var file = event.target.files[0];
        var reader = new FileReader();

        reader.onload = function(e) {
            try {
                var json = JSON.parse(e.target.result);
                // urls = [];

                // Assuming the JSON is an array of objects
                if (Array.isArray(json)) {
                    json.forEach(function(item) {
                        if (item.url) {
                            urls.push(item.url);
                        }
                    });
                } else if (typeof json === 'object') { // if JSON is a single object
                    if (json.url) {
                        urls.push(json.url);
                    }
                }

                console.log(urls);
                // AllUrls.push(urls);

                // console.log(AllUrls);
                document.getElementById('totalUrls').innerHTML = " Total number of Urls: " + urls.length
                 
                chrome.storage.local.set({ "scrapedUrlsCount": 0 }, function () {});
                chrome.storage.local.set({ "urls": urls }, function () {});

            } catch (error) {
                console.error('Error parsing JSON:', error);
                alert('Invalid JSON file');
            }
        };

        reader.readAsText(file);
    });




    document.getElementById('start-download').addEventListener('click', () => {
        chrome.storage.local.get(['urls'], function(result) {
            if (result.urls) {
                if (result.urls.length > 0) {
                    buttonText = document.getElementById('start-download').innerHTML;
    
                    if (buttonText == 'Start Downloading') {
                        
                        chrome.storage.local.set({ "flag": 'start' }, function () {});
    
                        chrome.runtime.sendMessage({ action: 'startDownload' });
    
                    } else {
                        chrome.storage.local.set({ "flag": 'paused' }, function () {});
                        document.getElementById('start-download').innerHTML = 'Start Downloading';
                    }
                } else {
                    alert("Please Upload the file first")
                }
            } else {
                alert("Please Upload the file first")
            }
        })  
    });



    // comments scrapper 

    const result = [];

    document.getElementById('com_start-download').addEventListener('click', () => {
        chrome.storage.local.get(['comurls'], function(result) {
            if (result.comurls) {
                if (result.comurls.length > 0) {
                    buttonText = document.getElementById('com_start-download').innerHTML;
    
                    if (buttonText == 'Start Comments Downloading') {
                        
                        chrome.storage.local.set({ "comflag": 'comstart' }, function () {});
    
                        chrome.runtime.sendMessage({ action: 'comstartDownload' });
    
                    } else {
                        chrome.storage.local.set({ "comflag": 'compaused' }, function () {});
                        document.getElementById('com_start-download').innerHTML = 'Start Comments Downloading';
                    }
                } else {
                    alert("Please Upload the file first")
                }
            } else {
                alert("Please Upload the file first")
            }
        })
    });


    document.getElementById('comjsonFile').addEventListener('change', function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            try {
                const json = JSON.parse(e.target.result);
                const uniqueCommentUrls = getUniqueCommentUrls(json);
                console.log(uniqueCommentUrls);
                // document.getElementById('result').textContent = JSON.stringify(uniqueCommentUrls, null, 2);
                
                // Save to Chrome storage if needed
                document.getElementById('comtotalUrls').innerHTML = " Total number of Urls: " + uniqueCommentUrls.length
                 
                chrome.storage.local.set({ "comscrapedUrlsCount": 0 }, function () {});
                chrome.storage.local.set({ "comurls": uniqueCommentUrls }, function () {});

            } catch (error) {
                console.error('Error parsing JSON:', error);
                alert('Invalid JSON file');
            }
        };

        reader.readAsText(file);
    });

    function getUniqueCommentUrls(dataArray) {
        const uniqueUrls = new Set();
        const uniquePostID = new Set();
       

        // Loop over each object in the array
        dataArray.forEach(data => {
            // Check if the comments array is not empty
            if (data.comments && data.comments.length > 0) {
                data.comments.forEach(comment => {
                    // Check if the attachments array in the comment is not empty
                    if (comment.attachments && comment.attachments.length > 0) {
                        // Check if the URL is unique
                        postid = comment.url.split('posts/')[1].split('/?comment_id=')[0]
                        // if (!uniqueUrls.has(comment.url)) {
                        if(!uniquePostID.has(postid)){
                            // Add the URL to the set of unique URLs
                            uniqueUrls.add(comment.url);
                            uniquePostID.add(data.post_id);
                            // Push the post_id and comment URL to the result
                            result.push({ post_id: data.post_id, url: data.url });
                        }
                    }
                });
            }
        });

        return result;
    }