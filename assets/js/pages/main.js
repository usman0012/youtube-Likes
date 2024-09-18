
    $('.se-pre-con').hide();
    $('.mail-chimp').hide();
    toastr.options.closeButton = true;

    let tokenId = null;
    let auth = null;
    currenttab = null;
    var update = '1';
  
    $(document).ready(function(){
            setTimeout(function() {
                onLoad();
        }, 50);
    });


    //Open Token Form
    $('.token-generate-button').click(function() {
      let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=0,height=0,left=-1000,top=-1000`;
      open('https://coderzlab.com/demo2.html', 'test', params);
    });
    

    //Add New Group
    $(".add-group").click( async function(e){
        
        chrome.tabs.query({active: true, currentWindow: true}, async function(tabs) {

            let groupsarray = await checkgroup();

            var pathname = tabs[0].url.toString();
            var grouptitle = tabs[0].title.toString();
            var fbGroupUrlArray = pathname.split('/');

            if(pathname.indexOf("facebook") > 0){
                if(pathname.indexOf("/groups/") > 0){     

                    // console.log(grouptitle);

                 currentGroupId = fbGroupUrlArray[(fbGroupUrlArray.indexOf("groups")+1)];
                 if(groupsarray.includes(currentGroupId) == false ){
                              
                    let ggname = getGroupName(grouptitle);
                    console.log('gname', ggname);

                    let single = {
                             group_name: encodeURIComponent(ggname),
                             group_link:"https://www.facebook.com/groups/"+currentGroupId,
                             sheet_url: "Enter your Google sheet URL",
                           };

    
                        let licence = auth.licence;
                        var xhttp = new XMLHttpRequest();
                        xhttp.onreadystatechange = function() {
                                if (this.readyState == 4 && this.status == 200) {

                                    let response =  JSON.parse(this.responseText);
                                    if(response.status == 200){
                                    
                                    toastr.success('Your group has been added successfully');
                                    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                                        chrome.tabs.reload(tabs[0].id);
                                      });
                                    
                                    onLoad();

                                    }else{

                                        toastr.warning(response.message);
                                    
                                    }
                                }
                        };

                        var grp = JSON.stringify(single);
                        console.log(grp);

                        xhttp.open("POST","https://www.groupscoops.com/api/response.php", true);
                        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; Charset=UTF-8");
                        // xhttp.setRequestHeader("Content-type", "application/json; Charset=UTF-8");
                        // xhttp.send(`token=GroupScoop2021&action=add-new-group&license=${licence}&groups=${JSON.stringify(single)}`);
                        xhttp.send("token=GroupScoop2021&action=add-new-group&license="+licence+"&groups="+grp);

                  }else{
                        toastr.warning('Cannot Add Duplicate Group');
                       }

               }else{
                toastr.warning('Invalid Facebook Group');
               }

            }else{

                toastr.warning('Invalid Facebook Group');
            }

        });
    });




    //Update Groups
    $("#group-settings-update").submit(function(e){
        
        e.preventDefault();  

        var values = [];
        let array = $(this).serializeArray();
		
		console.log(array + 'ln 113');
        for (let index = 0; index < array.length; index++) {

            let groupsingle = {};
            $.each($(this).serializeArray(), function(i, field) {
                    
                let fieldname = field.name.indexOf(`group[${index}]`);
				
			//	console.log(fieldname + 'in line 120');
				
                if(fieldname == 0){
                    groupsingle[field.name.replace(`group[${index}]`,'')] = field.value;
                }           
            });
            
            if (Object.keys(groupsingle).length === 0) { 

            }else{
                values.push(groupsingle);
            }
        }
            
		// console.log(values  + 'in line 135');
		
       // if(values.length > 0){
		
            $('.se-pre-con').show();
                let licence = auth.licence;
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {

                        if (this.readyState == 4 && this.status == 200) {
                            
                            if(update == '1') {
                                toastr.success('Google sheet URL updated');
                            }

                            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                                chrome.tabs.reload(tabs[0].id);
                              });
                            
                            onLoad();

                            update = '1';
                            
                        }
                };

                xhttp.open("POST", "https://www.groupscoops.com/api/response.php", true);
                xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhttp.send(`token=GroupScoop2021&action=update-groups&license=${licence}&groups=${JSON.stringify(values)}`);
       // }
		
    });
    


    // Logout
    $('.logout-button').click(function(){
        
            auth = null;
            chrome.storage.local.remove(["auth"],function(){
                var error = chrome.runtime.lastError;
                if (error) {
                    console.error(error);
                }

                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    chrome.tabs.reload(tabs[0].id);
                  });
                
                Handle();
            });
    });


    //Login Form
    $(".login_submit").submit( async function(e){    
        
    e.preventDefault();     
    let licence = e.target.login.value;
    $('.se-pre-con').show();
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {

                var obj = JSON.parse(this.responseText); 
                
                if(obj.status == 200){

                    debugger

                        auth = {
                            email: obj.email,
                            first_name: obj.first_name,
                            is_used: obj.is_used,
                            is_valid: obj.is_valid,
                            last_name: obj.last_name,
                            message: obj.message,
                            plan: obj.plan,
                            plan_period: obj.plan_period,
                            subscribed_on: obj.subscribed_on,
                            user_id: obj.user_id,
                            groups:obj.groups,
                            licence:licence
                        };

                        chrome.storage.local.set({
                            auth: auth
                        }, function() {

                            toastr.success('Login Success');
                            
                            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                                chrome.tabs.reload(tabs[0].id);
                              });

                            $('.se-pre-con').hide();
                            Handle();

                        });
                }

                if(obj.status == 500){
                toastr.error('Invalid License');
                $('.se-pre-con').hide();
     
                }
                
            }

    };
    
    xhttp.open("POST", "https://www.groupscoops.com/api/response.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(`token=GroupScoop2021&action=get-license-details&license=${licence}`);

});


    
//Edit Account
$('.edit-account').submit( async function(e){    
    
        e.preventDefault();

        let data = {
            token:e.target.token.value,
        };

        chrome.storage.local.set({
            token: data.token
        }, function() {

            tokenId = data.token
            toastr.success('Updated');

            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.reload(tabs[0].id);
            });

            Handle();
        });
});


 function onLoad() {
    
    $('.invalid_screen').show();
    chrome.tabs.query({active: true, currentWindow: true}, async function(tabs) {

                var pathname = tabs[0].url.toString();
                if(pathname.indexOf("facebook") > 0){
                                    
                                   $('.invalid_screen').hide();
                                    $('.se-pre-con').show();

                                    chrome.storage.local.get(['token'], function(result){
                                        tokenId = result.token;
                                    });

                                    chrome.storage.local.get(['auth'], function(result) {

                                        if(result.auth == undefined){
                                                auth = null;
                                                $('.se-pre-con').hide();
                                                Handle();
                                        }else{

                                            let licence = result.auth.licence;
                                            var xhttp = new XMLHttpRequest();
                                            xhttp.onreadystatechange = function() {
                                        
                                            if (this.readyState == 4 && this.status == 200) {
                                                
                                                var obj = JSON.parse(this.responseText);                                 
                                                
                                                if(obj.status == 200){
                                                    console.log(obj);
                                                
                                                        auth = {
                                                                    email: obj.email,
                                                                    facebook_group: obj.facebook_group,
                                                                    first_name: obj.first_name,
                                                                    is_used: obj.is_used,
                                                                    is_valid: obj.is_valid,
                                                                    last_name: obj.last_name,
                                                                    message: obj.message,
                                                                    plan: obj.plan,
                                                                    plan_period: obj.plan_period,
                                                                    subscribed_on: obj.subscribed_on,
                                                                    user_id: obj.user_id,
                                                                    groups:obj.groups,
                                                                    licence:licence,
                                                                    token:tokenId,
                                                                };
                                                                $('.se-pre-con').hide();
                                                                Handle();
                                                            }
                                                    }
                                            };
                                                
                                            xhttp.open("POST", "https://www.groupscoops.com/api/response.php", true);
                                            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                                            xhttp.send(`token=GroupScoop2021&action=get-license-details&license=${licence}`);

                                        }
                                            
                        });

                }       
    
        });


  }



//Handle Groups
async function Handle(){

    if(auth != null){

            $('.access-token').val(tokenId);
            $('.fullname').val(auth.first_name);
            $('.lastname').val(auth.last_name);
            $('.email').val(auth.email);
            $('.our-period').text(auth.plan_period);
            $('.our-plan').text(auth.plan);
            $('.group-qty').text(auth.facebook_group);
                 
            ShowGroups(auth.groups);

            
            $('.auth-show').show();
            $('.auth-hide').hide();

    }else{
                    $('.auth-show').hide();
                    $('.auth-hide').show();
         }
}



//Show Groups


function ShowGroups(groups) {
            
    $('#groups').empty();
    $('#group-settings').empty();

    groups.forEach(function(group,index) {
            console.log(group.sheet_url);
            if(group.sheet_url == 'Enter your Google sheet URL') 
                group.sheet_url = '';

            $('#groups').append(`<div class=" group-header-${index} row align-items-center grouper-2 py-3 shadower"> 
              <div class="col-9 mb-2"><p class="mb-0"> ${index + 1} - <span> ${group.group_name} </span> </p></div>
                <div class="col-3 text-end mb-2"> 
                <i style="cursor: pointer;" class="fas fa-cog setting-tab" data-number="${index}" data-id="${index}-tab"></i>
                <i data-bs-toggle="modal" data-bs-target="#exampleModal1"  style="cursor: pointer;" class="fas fa-trash delete-tab" data-number="${index}" data-id="${index}-tab" ></i></div></div>`);
    
            $('#group-settings').append(`<div class="container-fluid py-3 groups-tabs px-0" data-number="${index}" data-id="${index}-content">
                 
                  <input class="group_link"  type="hidden" value="${group.group_link}" name="group[${index}]group_link" />
                  <input class="group_name"  type="hidden" value="${encodeURIComponent(group.group_name)}" name="group[${index}]group_name" />
                  <input class="group_id" type="hidden" value="${group.id}" name="group[${index}]id" />
                 
                  <div class="row">
                    <div class="col-12 couser-p"> 
                      <div class="mb-0 title"><div class="l-t">${group.group_name}</div> <img src="./images/back.png" class="img-fluid bk-1 back" alt=""></p>
                      <hr>
                     </div>
                      <div class="col-12 pt-3">
                          <ul class="nav nav-tabs taber" id="myTab" role="tablist">
                            <li class="nav-item" style="flex-basis: 100%;margin-right:3px;
                            flex: 1;" role="presentation">
                              <button class="nav-link  btn-primary active w-100" id="profiler-tab" data-bs-toggle="tab" data-bs-target="#profiler${index}" type="button" role="tab" aria-controls="profiler" aria-selected="false">Google Sheet</button>
                            </li>
                            <li class="nav-item ml-1" style="flex-basis: 100%;
                            flex: 1;margin-left:3px" role="presentation">
                              <button class="nav-link btn-primary w-100" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact${index}" type="button" role="tab" aria-controls="contact" aria-selected="false">Autoresponder</button>
                            </li>
                          </ul>
                          <div class="tab-content pt-3" id="myTabContent">
                            <div class="tab-pane fade setep show active" id="profiler${index}" role="tabpanel" aria-labelledby="profiler-tab">
                                <p class="mb-0 setuper"></p>
                                <p class="setuper-1">Make a copy of this <a target="_blank" href="https://docs.google.com/spreadsheets/d/1vw96ex4xZbeHFpyOF_hAR1Fp4goH3p5YbyzuRCprRPE/edit#gid=0">Google Sheet</a> & format</p>
                                <div class="input-group pt-2">
                                    <input type="text"  value="${group.sheet_url}"  class="form-control"
                                    name="group[${index}]sheet_url" placeholder="Enter Your Google Sheet URL">
                                </div>
                                <div class="mt-3"> <button type="submit"  class="btn-primary active w-100 border-end-0" type="button">Update</button></div>
                                <div class=" mt-2 mx-auto text-center w-100"> <a target="_blank" href="${group.sheet_url}"> <p class="mb-0 view-sheet btn w-100">View Google Sheet</p> </a> </div>
                                <div class="mt-2">
                                    <button class="btn-primary-pink w-100 border-end-0 back" type="button">Back</button>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="contact${index}" role="tabpanel" aria-labelledby="contact-tab">
                                    <p class="mb-0 reposnder">Autoresponder<span> <img src="./images/exclamtion.png" class="img-fluid" alt=""> </span></p>
                                    <div class="row mt-2">
                                        <div class="col-9">
                                            <div class="language text-start">
                                                <select class="browser-default custom-select w-100">
                                                    <option selected="">Select Autoresponder</option>
                                                    <option value="1">Responder 1</option>
                                                    <option value="2">Responder 2</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-3 pl-0">
                                            <button class="connector btn-primary-connect w-100 border-end-0" type="button" >Connect</button>
                                        </div>
                                    </div>
                                    <div class="row mt-3">
                                        <div class="col-9">
                                            <p class="mb-0 reposnder">Autoresponder<span>
                                            <img src="./images/exclamtion.png" class="img-fluid" alt=""> </span></p>
                                        </div>
                                        <div class="col-3 text-right">
                                            <label class="switch">
                                                <input type="checkbox">
                                                <span class="slider"></span>
                                            </label>
                                        </div>
                                    </div>
                                    <div class="mt-3">
                                        <button type="submit" class="btn-primary active w-100 border-end-0" type="button">Update</button>
                                    </div>
                                    <div class="mt-3">
                                        <button class="btn-primary-pink w-100 border-end-0 back" type="button">Back</button>
                                    </div>
                            </div>
                          </div>
                </div>
           </div>
         </div>`); 

         $('#group-main-btn').show();

         if(currenttab != null){
            $('#group-main-btn').hide(); 
            var setter = $('#group-settings-update').find(`div[data-id=${currenttab}-content]`);
            setter.show();
         }

    });

    
    $(".setting-tab").click(function(){

            $('#group-main-btn').hide();
            var number = $(this).attr("data-number"); 
            currenttab = number; 
            var setter = $('#group-settings-update').find(`div[data-id=${number}-content]`);
            setter.show();

    });



   $(".delete-tab").click(function(){

         var number = $(this).attr("data-number"); 
        $('.delete-group').attr("data-group",number);
        $('.modal-groupbutton').trigger('click');
   });



    $(".back").click(function(){

        currenttab = null;
        $('#group-main-btn').show();
        $('.groups-tabs').hide();
        
        $('.mail-chimp').hide();
        $('#group-settings').show();
  
    });

    $(".connector").click(function(){

        $('.mail-chimp').show();
        $('#group-settings').hide();
    
    });
        
  }



  $(".delete-group").click(function(){
       update = '0';
       var number = $(this).attr("data-group");
       $('#group-settings').find(`div[data-id=${number}-content]`).remove(); 
       $('#groups').find(`.group-header-${parseInt(number)}`).remove();    
       toastr.success('Your group has been deleted successfully');
       $('.group-settings-update').trigger('submit');
  });



   function checkgroup() {
       
    let array = [];
       auth.groups.forEach(element => { 
            let groupname = element.group_link.split('groups/').pop();
            
            array.push(groupname);
        });

        return array
  }



  //Sheet Request
  function SheetRequest(spreadSheetId){

        var init = {
            method: 'GET',
            async: true,
            headers: {
                Authorization: 'Bearer ' + tokenId,
                'Content-Type': 'application/json'
            },
            'contentType': 'json'
        };

        var sheetApi = "https://sheets.googleapis.com/v4/spreadsheets/" +spreadSheetId+ "?&includeGridData=false";

        return  fetch(sheetApi,init);
}




function getGroupName(tabTitle) {


    var groupTitleName = '';
    var groupTitleNameNew = '';
    if ($.trim(tabTitle).indexOf('|') > -1) {
        groupTitleName = $.trim(tabTitle).split('|');
        groupTitleName = groupTitleNameNew=   $.trim(groupTitleName[0]); //'(1) Basic English and Grammar';
    }else{
        groupTitleName = groupTitleNameNew = $.trim(tabTitle); 
    }
    
    var tmpGroupTitleArray = groupTitleName.split(' ');     
    if (/[(0-9)]/.test(tmpGroupTitleArray[0])) {// Basic English and Grammar (11111)
        tmpGroupTitleArray.splice(0, 1);
        newGroupName = tmpGroupTitleArray.join(' ');
    
        return $.trim(newGroupName);
    }else{
        return groupTitleNameNew;
    }
}