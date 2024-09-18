toastr.options.closeButton = true;

//Variables
let auth = null;
let currentGroup = null;
let tokenId = null;
let groupName = 'none';
let activation = null;

window.addEventListener ("load", myMain, false);
 
  function myMain (evt) {
     
     setTimeout(function() {

          LoadData();
       
      }, 5000);
}

setInterval(function(){ 
      
     checklogoexist();
   
}, 4000);



function checklogoexist(){

   if(activation == null){
      return false;
   }

   let url = window.location.href.search("\/\/www.facebook.com\/groups\/.*\/member-requests");
   if(url > 0){
     
   }else{
      
      return false;
   }

     setCurentGroup();


     console.log(currentGroup);

   
   //Approve All Button
      if($("div[aria-label='Approve All']")[0]){

         $("div[aria-label='Approve All']").css('visibility', 'hidden');
         $("div[aria-label='Approve All']").css('position', 'absolute');
        
               if($('.extension-logo')[0]){


               }else{

                  let approve = $("div[aria-label='Approve All']");
                  approve.parent().parent().prepend(`<div class="extension-logo"><div><button class="approve-button" >Approve All</butyton></div></div>`);
                  approve.parent().parent().prepend(`<div class="extension-logo"><div><img src="https://coderzlab.com/groupscoops-logo.png" width="50px" /></div></div>`);
               }


      }else{   
              
               $('.extension-logo').hide();

           }
   

         
      //Sidebar
      if($("div[aria-label='Area where all of the admin tools are']")[0]){

            let sidebar = $("div[aria-label='Area where all of the admin tools are']");
            if($(".qzhwtbm6:eq(0)")[0]){
               groupName =   sidebar.find('.qzhwtbm6:eq(0)').html().replace(/<[^>]+>/g, '');
            }
      }


      //Single Button Find
      if($("div[aria-label='Area showing all of the information from a selected tool']")[0]){           
            if($("div[aria-label='Area showing all of the information from a selected tool'] div[aria-label='Approve']")[0]){
               

               $("div[aria-label='Area showing all of the information from a selected tool'] div[aria-label='Approve']").each(function(index){
                 
                  let bb = $(this).parent().parent().parent().parent().parent();
                   let singlapprovebtn = $(this).parent().parent();
                  if(singlapprovebtn.find('.single-logo')[0]){
                     
                  }else{
                     
                    $(this).parent().parent().prepend(`<div class="3123"><button class="single-button" >Approve</butyton></div></div>`);
                    $(this).parent().parent().prepend(`<div class="single-logo"><div><img src="https://coderzlab.com/groupscoops-logo.png" width="50px" /></div></div>`);
                  
                  }

               });

               
            if(auth != null){

                 // if(sheetId != null && tokenId != null){   
                     
                     $("div[aria-label='Area showing all of the information from a selected tool'] div[aria-label='Approve']").css('visibility', 'hidden');
                     $("div[aria-label='Area showing all of the information from a selected tool'] div[aria-label='Approve']").css('position', 'absolute');

                     $("div[aria-label='Area showing all of the information from a selected tool'] .single-button").unbind('click');         
                     
                     $("div[aria-label='Area showing all of the information from a selected tool'] .single-button").click(function(){


                        if(currentGroup == null ){
            
                           toastr.warning('Group Not in List');
                           return false;
                        }
               
                        if(currentGroup.sheet_url == ''){
                            
                           toastr.warning('Group Sheet Not Defined');
                           return false;
                        }
               
                        if(tokenId == null){
                            
                           toastr.warning('Token Not Defined');
                           return false;
                        }
             

                                       
                         let element = $(this).parent().parent().parent().parent().parent();
                         ApproveSingle(element);

                     });

                        
               //   }else{
               //$("div[aria-label='Area showing all of the information from a selected tool'] div[aria-label='Approve']").css('visibility', 'hidden');
               // $("div[aria-label='Area showing all of the information from a selected tool'] div[aria-label='Approve']").css('position', 'absolute');
               //    }


                  }


              }

      }
     

}





$(document).on("click", ".extension-logo", async function (e) {
          
  
         if(auth == null){
            toastr.warning('Please Login First');
            return false;
         }

         if(currentGroup == null ){
            
            toastr.warning('Group Not in List');
            return false;
         }

         if(currentGroup.sheet_url == ''){
             
            toastr.warning('Group Sheet Not Defined');
            return false;
         }

         if(tokenId == null){
             
            toastr.warning('Token Not Defined');
            return false;
         }

         
         var request = await SheetRequest();
         if(request.status == 200){
            
            
         
            }else if(request.status == 404){

                     toastr.warning('Google Sheet Url is Invalid Please Update Again');
                     return false;
         
         }else{   
               toastr.warning('Access Token Expired Please Generate It Again');
               return false;
         }
      
   
         let parent = $('.mysgfdmx:eq(2)');
             parent = parent.parent().parent().parent().next();    
         let last = parent.children().last().attr('class');

            if(last == '' ){
               // parent.children().last().remove();
            }
            
            var r = confirm('Are you sure you wish to approve all member requests?');
               if (r == true) {
         
                  var counter = 0;
                  parent.children().each(function(index){            
                     
                     var element = $(this);
                     ApprovedMember(index,element);

                     //Counter
                     // if (counter == 5) {
                     //    return false;         
                     // } else {
                     //    counter++;
                     // }                             
                  }); 
            }           
});






//Check Sheet Verification
function LoadData(){

   // console.log(window.location.href.search("\/\/www.facebook.com\/groups\/.*\/member-requests"));

   //    let url = window.location.href.search("\/\/www.facebook.com\/groups\/.*\/member-requests");

   


      chrome.storage.local.get(['token'], async function(result) {
          tokenId =  result.token;
      });

      chrome.storage.local.get(['auth'], function(result) {
           

         if( result.auth == undefined){
         
               tokenId = null;
               auth = null;
               currentGroup = null;
        
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

                                  setCurentGroup();
                                  activation = true;
                              }
                      }
               };
                  
               xhttp.open("POST", "https://www.groupscoops.com/api/response.php", true);
               xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
               xhttp.send(`token=GroupScoop2021&action=get-license-details&license=${licence}`);

             }

     });


}





//Check Sheet Verification
function setCurentGroup(){
   
      if(auth == null){
         
         currentGroup = null;
         return false;
      }

      if(auth.groups.length == 0){
         
         currentGroup = null;
         return false;
      }

          
      let ongroup = null;
      auth.groups.forEach(element => {
            
      
            gname = element.group_link;
            url = window.location.href;
               
            if(url.match(gname) != null){

               element.gname = gname;
               ongroup = element;  
            }

      });

      currentGroup = ongroup;

}


//Approve All Members
function ApprovedMember(index,element) {
   setTimeout(function() { 

      if(element.attr('class') == ''){
         toastr.info('Completed'); 

         return true;
      }
  
       let approveButton = element.find("div[aria-label='Approve']");
       approveButton.unbind('click'); 
    
       ApproveSingle(element);
       
    },index * 5000); 
}


//Approve Single Members
function ApproveSingle(element) {

       //Fields
       let userId = "none";
       let fullname = "none";
       let fname = "none";
       let lname = "none";
       let joinedfb = "none";
       let q1 = "none";
       let a1 = "none";
       let q2 = "none" ;
       let a2 = "none";
       let q3 = "none";
       let a3 = "none";
       let addedDate = "none";
       let location = "none";
       let work = "none";
       let inviteBy = "none";
       let inviteDate = "none";
       
       
       fullname = element.find('a:eq(1)').text();
      
       if(fullname == '' ){
          fullname = element.find('.qv66sw1b:eq(0)').html();

       }

       fname = fullname;
       fname = fname.split(" ")[0];

       lname = fullname;
       lname = fullname.replace(fname," ");
       
   
       if(element.find('.nc684nl6:eq(1)')[0]){
             userId = element.find('.nc684nl6:eq(1)').attr("href");   
       }

      //Requested
      if(element.find('span:contains("Requested ")')[0]){
         inviteDate =  element.find('span:contains("Requested ")').html().replace(/<[^>]+>/g, '');
      }

      //Invited by
      if(element.find('span:contains("Invited by")')[0]){

         inviteBy =  element.find('span:contains("Invited by")').children().text();
         element.find('span:contains("Invited by")').find('span').remove();
         inviteDate = element.find('span:contains("Invited by")').text();

      }

      //Joined Facebook
      if(element.find('span:contains("Joined Facebook")'[0])){
         joinedfb =  element.find('span:contains("Joined Facebook")').html().replace(/<[^>]+>/g, '');
      }

      //Location
      if(element.find('span:contains("Lives in ")')[0]){
      location =  element.find('span:contains("Lives in ")').html().replace(/<[^>]+>/g, '');
      }

      //worked
      if(element.find('span:contains("Worked at")')[0]){
       
         work =  element.find('span:contains("Worked at")').html().replace(/<[^>]+>/g, ''); 
      }

      if(element.find('span:contains("Works at")')[0]){
      //works
         work =  element.find('span:contains("Works at")').html().replace(/<[^>]+>/g, '');
      }

      // Getting Questions Answers
      if(element.find('ul')[0]){
          
       let mainUl = element.find('ul:eq(0)');
       let totalQuestions = mainUl.children().length;

       switch (totalQuestions){

                   case 1:

                      q1 =  mainUl.find('li:eq(0) span:eq(0)').text();
                      a1 =  mainUl.find('li:eq(0) div span').text();   
                   break;


                   case 2:
                      
                      q1 =  mainUl.find('li:eq(0) span:eq(0)').text();
                      a1 =  mainUl.find('li:eq(0) div span').text();   
                      
                      q2 =  mainUl.find('li:eq(1) span:eq(0)').text();
                      a2 =  mainUl.find('li:eq(1) div span').text();   
                   break;


                   case 3:
                      
                      q1 =  mainUl.find('li:eq(0) span:eq(0)').text();
                      a1 =  mainUl.find('li:eq(0) div span').text();   
                      
                      q2 =  mainUl.find('li:eq(1) span:eq(0)').text();
                      a2 =  mainUl.find('li:eq(1) div span').text();
                      
                      q3 =  mainUl.find('li:eq(2) span:eq(0)').text();
                      a3 =  mainUl.find('li:eq(2) div span').text();  

                   break;

                   default:

                      a1 = "none";
                      a2 = "none";
                      a3 = "none";      
             }

       }
       
       groupName = groupName.replace(/'/g, "");
       fullname =  fullname.replace(/'/g, "");
       fname = fname.replace(/'/g, "");
       lname = lname.replace(/'/g, "");
       q1 = q1.replace(/'/g, "");
       a1 = a1.replace(/'/g, "");
       q2 = q2.replace(/'/g, "");
       a2 = a2.replace(/'/g, "");
       q3 = q3.replace(/'/g, "");
       a3 = a3.replace(/'/g, "");
       location = location.replace(/'/g, "");
       work = work.replace(/'/g, "");
      
       var dt = new Date();
       addedDate = dt.toUTCString();

         let row = {
                     groupName:String(groupName),
                     userId:userId,
                     fullname:String(fullname),
                     fname:String(fname),
                     lname:String(lname),
                     joinedfb:String(joinedfb),
                     q1:String(q1),
                     a1:String(a1),
                     q2:String(q2),
                     a2:String(a2),
                     q3:String(q3),
                     a3:String(a3),
                     addedDate:addedDate,
                     location:String(location),
                     work:String(work),
                     inviteBy:String(inviteBy),
                     inviteDate:inviteDate,                       
                  };

               
       
        var url = `https://content-sheets.googleapis.com/v4/spreadsheets/${getSpreadSheetId(currentGroup.sheet_url)}/values/Sheet1:append?insertDataOption=INSERT_ROWS&valueInputOption=USER_ENTERED&alt=json&key=AIzaSyALpy61sYTv8Ks4evFtZqtoYhlU6bzIfgc`;

        var xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.setRequestHeader("Authorization", "Bearer "+tokenId);
        xhr.setRequestHeader("Content-Type", "application/json");
        
        xhr.onreadystatechange = function () {
    
            if (this.readyState == 4 && this.status == 200) {
                element.find("div[aria-label='Approve']").trigger('click');
            }
            
            if (this.readyState == 4 && this.status == 401) {
               toastr.warning('Access Token Expired Please Generate It Again');
            }
            
            if (this.readyState == 4 && this.status == 404) {
               toastr.warning('Google Sheet Url is Invalid');
            }

       };
        
           var data = `{"values": 
           [
              [
                 '${row.groupName}',
                 '${row.userId}',
                 '${row.fullname}',
                 '${row.fname}',
                 '${row.lname}',
                 '${row.joinedfb}',
                 '${row.q1}',
                 '${row.a1}',
                 '${row.q2}',
                 '${row.a2}',
                 '${row.q3}',
                 '${row.a3}',
                 '${row.addedDate}',
                 '${row.location}',
                 '${row.work}',
                 '${row.inviteBy}',
                 '${row.inviteDate}',
               ]
           ]
        }`;
        
        xhr.send(data);

}



function SheetRequest(){

      var init = {
         method: 'GET',
         async: true,
         headers: {
            Authorization: 'Bearer ' + tokenId,
            'Content-Type': 'application/json'
         },
         'contentType': 'json'
      };
      
      var sheetApi = "https://sheets.googleapis.com/v4/spreadsheets/" + getSpreadSheetId(currentGroup.sheet_url)+ "?&includeGridData=false";
      return  fetch(sheetApi,init);
}


function getSpreadSheetId(url) {
      var matches = /\/([\w-_]{15,})\/(.*?gid=(\d+))?/.exec(url);
      if(matches == null){
         return false;
      } else {
         return matches[1];
      }
}