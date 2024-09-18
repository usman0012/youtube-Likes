

document.getElementById('jsonFile').addEventListener('change', function(event) {
    // const file = input.files[0];
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                // Parse the JSON data
                // const jsonData = JSON.parse(e.target.result);
                const content = e.target.result; 
                const parsedContent = JSON.parse(content); 
                // Save to local storage
                // localStorage.setItem('uploadedJsonData',JSON.stringify(parsedContent)); 
                chrome.storage.local.set({ "uploadedJsonData": JSON.stringify(parsedContent) }, function () {});
                alert('File data stored in local storage!');
            } catch (error) {
                console.log(error);
            }
        };

        // Read the file
        reader.readAsText(file);
    } else {
        // document.getElementById('message').innerText = 'Please upload a file.';
    }
});

document.getElementById('start').addEventListener('click', () => {
    chrome.storage.local.get(['uploadedJsonData'], function(result) {
        if (result.uploadedJsonData) {
            if (result.uploadedJsonData.length > 0) {
                chrome.runtime.sendMessage({ action: 'startDownload' })
            } else {
                alert("Please Upload the file first")
            }
        } else {
            alert("Please Upload the file first")
        }
    })  
});