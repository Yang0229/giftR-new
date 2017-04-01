/*****************************************************************
File: main.js
Author: Bo Yang (Tinker)
Description: This is a Cordova Android App that lets people store gift ideas.

 -  There are 2 html pages and 2 modal windows.
 -  On index.html:
    1. Click “add person” btn;
       Popup the modal window of "#personModal";
    2. Click the name of each person;           
       Popup the modal window of “#personModal”           
    3. Show person list: Name & DOB(sorted by Date);  
    4. Click the arrow sign on the right side;           
       Entry to the gifts.html;
    5. Swipe to left on the div tag;           
       Show “delete” btn;           
       Click “delete” btn;           
       Delete the person from the localstorage;    
       
 -  On gift.html:
    1. Click “add idea” button;           
    Popup the modal window of “#giftModal”;
    2. Show gift idea list;
    3. Click the “trash-bin” icon;
    4. Delete the idea;

 -  On personModal Window:
    1. Type in Name & DOB;           
    2. Click “save” button to save/update in localstorage / click “cancel” btn to back to index.page;
    3. Refresh the showlist;
    
 -  On giftModal Window:
    1. Type in Gift idea & Store & URL & Cost;           
    2. Click “save” button to save in localstorage / click “cancel” button to back to gift.page;

Version: 0.0.1
Updated: 
*****************************************************************/

//var localStorageList = [];
var app = {
    
    localStorageList: { people:[] },
    
    current_Id: null,
    
    people_Sort_Id: null,
    
    init: function() {

//        try {
//            document.addEventListener('deviceready', this.onDeviceReady.bind(this), false); //bind method purpose??
//            app.onDeviceReady();
//        
//
//        } catch (e) {
//            document.addEventListener('DOMContentLoaded', this.onDeviceReady.bind(this), false);
//            console.log('failed to find deviceready');
//        }
        if('deviceready' in document){
            document.addEventListener('deviceready', app.onDeviceReady);
        }
        else{
            document.addEventListener('DOMContentLoaded', app.onDeviceReady);
        }
    },
    
    onDeviceReady: function (){
    console.dir("enter ondeviceReady");
    window.addEventListener('push', app.pageChanged);
    var btnAddPerson = document.getElementById("btn_Add_People");      
        btnAddPerson.addEventListener("touchstart", function(ev){
            app.current_Id = 0;
            console.log("current_Id: ");
            console.log(app.current_Id);    
            document.getElementById("name").value = "";
            document.getElementById("birth_Date").value = "";
        });
        
        document.getElementById("btn_Save_People").addEventListener("touchend", app.peopleSaved);
        document.getElementById("btn_Cancel_People").addEventListener("touchend",
        app.peopleCanceled);
        app.showPeoplePage();
    },
        
    
    
    pageChanged: function (){
        let contentDiv = document.querySelector(".content");
        let id = contentDiv.id;
        switch (id){
                 case "people_Page":
                      app.showPeoplePage();
                      var btnAddPerson = document.getElementById("btn_Add_People");
                      btnAddPerson.addEventListener("touchstart", function(ev){
                          app.current_Id = 0;
                          document.getElementById("name").value = "";
                          document.getElementById("birth_Date").value = "";
                      });
                    document.getElementById("btn_Save_People").addEventListener("touchend", app.peoplesaved);
                    document.getElementById("btn_Cancel_People").addEventListener("touchend", app.peopleCanceled);
                      break;
            
                 case "gift_Page":
                      app.showGiftPage();
                      var btn_Add_Gift_Value = document.getElementById("btn_Add_Gift");
                      btn_Add_Gift_Value.addEventListener("touchstart", function(ev){
                          document.getElementById("idea").value = "";
                          document.getElementById("at").value = "";
                          document.getElementById("url").value = "";
                          document.getElementById("cost").value = ""
                      });
                      
                      document.getElementById("btn_Save_Gift").addEventListener("touchend", app.giftSaved);  document.getElementById("btn_Cancel_Gift").addEventListener("touchend", app.giftCanceled);
                       break;
            
                 default:
                     app.showPeoplePage();
                    }
        
    },
    
    
    
    showPeoplePage: function(){
        let list = document.querySelector('#contact-list');
        let timeArray = [];
        list.innerHTML = "";
        app.localStorageList = JSON.parse(localStorage.getItem("giftr-yang0229"));
        
        if(!app.localStorageList){
            app.localStorageList = { people: [] };
        }
        app.localStorageList.people.forEach(function(person){
            let li = document.createElement("li");
            li.className = "table-view-cell";
            li.setAttribute("people_id", person.id);
            let span_name = document.createElement("span");
            span_name.className = "name";
            let a_modal_window = document.createElement("a");
            a_modal_window.href = "#personModal";
            a_modal_window.innerHTML = person.name;
            a_modal_window.addEventListener("touchstart", function(ev){
                var edit_People = ev.currentTarget;
                app.current_Id = edit_People.parentNode.parentNode.getAttribute("people_id");
                document.getElementById("name").value = person.name;
                document.getElementById("birth_Date").value = person.dob;
            });
            
            let a_Navigate = document.createElement("a");
            a_Navigate.className = "navigate-right pull-right";
            a_Navigate.href = "gifts.html";
            a_Navigate.addEventListener("touchend", function(ev){
                var edit_People = ev.currentTarget;
                app.current_Id = edit_People.parentNode.getAttribute("people_id");
            });
            let span_dob = document.createElement("span");
            span_dob.className = "dob";
            span_dob.innerHTML = moment(person.dob).format('MMM-DD');
            span_name.appendChild(a_modal_window);
            a_Navigate.appendChild(span_dob);
            li.appendChild(span_name);
            li.appendChild(a_Navigate);
            list.appendChild(li);  
        });
        
//        for(var i = 0; i < app.localStorageList.people.length; i++)
//            {
//                timeArray[i] = app.localStorageList.people[i].dob;
//            };
//        
//        console.log("timeArray: ");
//        console.log(timeArray);
//         console.log("sorted_html: ");
//        console.log(sorted_html);
        console.log("showPeoplePage data: ")
        console.log(app.localStorageList.people);
    },

    
    
    peopleSaved: function(){
        if(app.current_Id == 0){
            console.log("Completed Adding People Process");
            let current_People = {
                id: Date.now(),
                name: document.getElementById("name").value,
                dob: document.getElementById("birth_Date").value,
                ideas:[]
            };
            app.localStorageList.people.push(current_People);
        }
        else{
            console.log("Completed Editing People Process");
            console.log(app.current_Id);
            var current_Target_People_i = -1;
            for(var i = 0; i < app.localStorageList.people.length; i++){
                if(app.current_Id == app.localStorageList.people[i].id){
                    current_Target_People_i = i;
                    console.log("Id has been matched!");
                }
            }
            console.log(current_Target_People_i);
            app.localStorageList.people[current_Target_People_i].name = document.getElementById("name").value;
            app.localStorageList.people[current_Target_People_i].dob = document.getElementById("birth_Date").value;
        }
        localStorage.setItem("giftr-yang0229",JSON.stringify(app.localStorageList));
        app.showPeoplePage();
        console.log("Wow! People Save Successd!");
    },
    
    
    
    peopleCanceled: function(){
        console.log("Wow! People Canceled Successd!");
    },
    
    
    
    showGiftPage: function(){
        let list = document.querySelector("#gift-list");
        list.innerHTML = "";
        app.localStorageList = JSON.parse(localStorage.getItem("giftr-yang0229"));
        if(!app.localStorageList){
            app.localStorageList = {
                people: []
            };
        }
        var current_i = -1;
        for(var i = 0; i < app.localStorageList.people.length; i++){
            if(app.current_Id == app.localStorageList.people[i].id){
                current_i = i;
                break;
            }
        }
        for(var i = 0; i < app.localStorageList.people[current_i].ideas.length; i++){
            let li = document.createElement("li");
            li.className = "table-view-cell media";
            let span = document.createElement("span");
            span.className = "pull-right icon icon-trash midline";
            span.setAttribute("gift_idea_id", app.localStorageList.people[current_i].ideas[i].id);
            span.addEventListener("touchend", function(ev){
                let delete_Icon = ev.currentTarget;
                let delete_id = delete_Icon.getAttribute("gift_idea_id");
                let delete_i = -1;
                for(let i = 0; i < app.localStorageList.people[current_i].ideas.length; i++){
                    if(delete_id == app.localStorageList.people[current_i].ideas[i].id){
                        delete_i = i;
                        break;
                    }
                }
                if(delete_i > -1){
                    app.localStorageList.people[current_i].ideas.splice(delete_i, 1);
                    localStorage.setItem("giftr-yang0229",JSON.stringify(app.localStorageList));
                    ev.currentTarget.parentElement.parentElement.removeChild(ev.currentTarget.parentElement);
                }
            });
            
            let div = document.createElement("div");
            div.className = "media-body";
            div.textContent = app.localStorageList.people[current_i].ideas[i].idea;
            let p_at = document.createElement("p");
            p_at.textContent = app.localStorageList.people[current_i].ideas[i].at;
            let p_url = document.createElement("p");
            p_url.innerHTML = app.localStorageList.people[current_i].ideas[i].url;
            let a = document.createElement("a");
            a.href = "http://" + app.localStorageList.people[current_i].ideas[i].url;
            a.target = "_blank";
            let p_cost = document.createElement("p");
            p_cost.innerHTML = app.localStorageList.people[current_i].ideas[i].cost;
            
            p_url.appendChild(a);
            div.appendChild(p_cost);
            div.appendChild(p_url);
            div.appendChild(p_at);
            li.appendChild(span);
            li.appendChild(div);
            list.appendChild(li);
            
            console.log("showGiftPage data:");
            console.log(app.localStorageList.people[current_i].ideas[i]);
        }
    },
    
    
    
    giftSaved: function(){
        var current_i = -1; 
        for(var i = 0; i < app.localStorageList.people.length; i++){
            if(app.current_Id == app.localStorageList.people[i].id){
            current_i = i;
            break;
        }
    }
        let current_idea = {
            id: Date.now(),
            idea: document.getElementById("idea").value,
            at: document.getElementById("at").value,
            url: document.getElementById("url").value,
            cost: document.getElementById("cost").value
        };
        app.localStorageList.people[current_i].ideas.push(current_idea);
        localStorage.setItem("giftr-yang0229", JSON.stringify(app.localStorageList));
        app.showGiftPage();
        console.log("Wow! Gift Save Successd!");
    },
    
    
    
    giftCanceled: function(){
        console.log("Wow! Gift Cancel Successd!");
    },
        
        
        
    };

app.init();
    
    
    
    
    
    
    
    































  
  
  
  
  
  
  
  
  





