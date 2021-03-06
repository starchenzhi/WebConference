//Script for navigate tab
$(window).on("load", function(){

  //Click event for the main menu.
  $('nav li').click(function(){
    var previousTab = $('.active').data('tab');
    $('.active').removeClass('active');
    $(previousTab).hide();
    
    $(this).addClass('active');    
    var activeTab = $(this).data('tab');
    $(activeTab).show();
  });
  
   //Click event for the filter.
  $('#filter button').click(function(){
    $('.filter-active').removeClass('filter-active');
    $(this).addClass('filter-active');   
    
    filter.schedule = $(this).data("filter");
    
    database.ref("schedule/" + filter.schedule).once("value").then(function(snapshot){
      loadSpeechData(snapshot);   
    });
    
  });
});

//This function is used to format a string for convenience, its functionality is the same with "String.format" in Java.
String.format = function() {
    // The string containing the format items (e.g. "{0}")
    // will and always has to be the first argument.
    var theString = arguments[0];
    
    // start with the second argument (i = 1)
    for (var i = 1; i < arguments.length; i++) {
        // "gm" = RegEx options for Global search (more than one instance) and for Multiline search
        var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
        theString = theString.replace(regEx, arguments[i]);
    }
    
    return theString;
}

//Firebase configuration.
var config = {
  apiKey: "AIzaSyAKWwg8vPhKfnqINaBfSmQvNgNPTjLOis8",
  authDomain: "webconference-2018.firebaseapp.com",
  databaseURL: "https://webconference-2018.firebaseio.com",
  projectId: "webconference-2018",
  storageBucket: "webconference-2018.appspot.com",
  messagingSenderId: "421933712948"
};
firebase.initializeApp(config);

//Load default data when the page is just opened.
var filter = {"schedule":"date1", "filterGoingOn": false,};
var database = firebase.database(); 
database.ref("schedule/date1").once("value").then(function(snapshot){
  loadSpeechData(snapshot);   
});

database.ref("Speakers").once("value").then(function(snapshot){
  loadSpeakerData(snapshot);   
});


//Load data based on filter conditions.
function loadSpeechData(snapshot) {  

  var scheduleData = snapshot.val();
  var index = 0;
  var scheduleTable = document.getElementById("schedule-data");
  $("#schedule-data tr").remove(); //clear the table.
  
  for(var key in scheduleData) {
    
    if(filter.filterGoingOn && scheduleData[key].attending == false) {
      continue;
    }
    
    var row = scheduleTable.insertRow(index);
    row.setAttribute("data-path", String.format("schedule/{0}/{1}/attending", filter.schedule, key));
    row.setAttribute("data-attending", scheduleData[key].attending );
    row.insertCell(0).innerHTML = String.format('<i class="fa fa-clock-o"></i> {0}', scheduleData[key].time);
    row.insertCell(1).innerHTML = String.format('<i class="fa fa-map-marker"></i> {0}', scheduleData[key].room);
    row.insertCell(2).innerHTML = String.format('<i class="fa fa-comments"></i> {0}', scheduleData[key].title);

    if(scheduleData[key].attending) {
      row.insertCell(3).innerHTML = '<button class="schedule-going" onclick="attend(this);"><i class="fa fa-check-square-o"></i> Going</button>';
    } else {
      row.insertCell(3).innerHTML = '<button class="schedule-attend" onclick="attend(this);"><i class="fa fa-calendar-plus-o"></i> Attend</button>';
    }
    
    index++;
  }
}

//After a user clicks "attend", this function will update firebase.
function attend(self) {
  var path = self.parentNode.parentNode.getAttribute('data-path');
  var attendingValue = (self.parentNode.parentNode.getAttribute('data-attending') == "true");
  
  var updates = {};
  updates[path] = !attendingValue;
  firebase.database().ref().update(updates);
  
  if(attendingValue) {
    self.className = "schedule-attend";    
    self.innerHTML = '<i class="fa fa-calendar-plus-o"></i> Attend';
    self.parentNode.parentNode.setAttribute('data-attending', false);
  } else {
    self.className = "schedule-going";
    self.innerHTML = '<i class="fa fa-check-square-o"></i> Going';
    self.parentNode.parentNode.setAttribute('data-attending', true);
  }
}

//Load all speakers' data.
function loadSpeakerData(snapshot) {
  var speakerData = snapshot.val();
  var index = 0;
  var scheduleTable = document.getElementById("schedule-data");
  
  for(var key in speakerData) {
    var speaker = String.format('<a href="javascript:void(0);" onclick="showProfile({0});"><i class="fa fa-user-circle-o"></i> {1}</a>', key, speakerData[key].name);
    var ul = document.getElementById("speaker-list");
    var li = document.createElement("li");
    li.innerHTML = speaker;
    ul.appendChild(li);
  }  
}

//Show a speaker's detail information.
function showProfile(id){
  $("#profile").show();
  database.ref("Speakers/" + id ).once("value").then(function(snapshot){
    var profile = snapshot.val();
    $("#profile-name").text(profile.name);
    $("#profile-title").text(profile.title);
    $("#profile-photo").attr("src",profile.photo);     
    $("#profile-company").text(profile.company);
    $("#profile-email").text(profile.email);   
    $("#profile-phone").text(profile.phone);  
    $("#profile-about").text(profile.about);
  });
}

//After clicking "filter", it will show only "going" events or in reverse.
function filterSpeech(self) {
  filter.filterGoingOn = self.checked;
  
  database.ref("schedule/" + filter.schedule).once("value").then(function(snapshot){
    loadSpeechData(snapshot);   
  });
}

