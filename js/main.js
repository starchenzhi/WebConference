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
});

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

var config = {
  apiKey: "AIzaSyAKWwg8vPhKfnqINaBfSmQvNgNPTjLOis8",
  authDomain: "webconference-2018.firebaseapp.com",
  databaseURL: "https://webconference-2018.firebaseio.com",
  projectId: "webconference-2018",
  storageBucket: "webconference-2018.appspot.com",
  messagingSenderId: "421933712948"
};
firebase.initializeApp(config);

var database = firebase.database(); 
database.ref("schedule").once("value").then(function(snapshot){
  loadSpeechData(snapshot);   
});

database.ref("Speakers").once("value").then(function(snapshot){
  loadSpeakerData(snapshot);   
});


function loadSpeechData(snapshot) {  
  var scheduleData = snapshot.val();
  var index = 1;
  var scheduleTable = document.getElementById("schedule-data");
  
  for(var key in scheduleData) {
    var speechData = scheduleData[key];
    for(var session in speechData) {
      var row = scheduleTable.insertRow(index);
      row.insertCell(0).innerHTML = String.format('<i class="fa fa-clock-o"></i> {0}', speechData[session].time);
      row.insertCell(1).innerHTML = String.format('<i class="fa fa-map-marker"></i> {0}', speechData[session].room);
      row.insertCell(2).innerHTML = String.format('<i class="fa fa-comments"></i> {0}', speechData[session].title);
      row.insertCell(3).innerHTML = String.format('<button class="schedule-attend"><i class="fa fa-sign-in"></i> Attend</button>');
      index++;
    }
  }
}

function loadSpeakerData(snapshot) {
  var speakerData = snapshot.val();
  var index = 0;
  var scheduleTable = document.getElementById("schedule-data");
  
  for(var key in speakerData) {
    var speaker = String.format('<a href="javascript:void(0);" onclick="showProfile({0});"><i class="fa fa-user-circle-o"></i> {1}</a>', key, speakerData[key].name);
    var ul = document.getElementById("speaker-list");
    var li = document.createElement("li");
    li.innerHTML = speaker;
    //li.appendChild(li);
    ul.appendChild(li);
  }  
}

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

function filterSpeech(condition) {
  
}

