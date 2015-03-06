/*
Status Message
displays message on screen when another user 
makes an edit to currentuser's template.
*/

Tracker.autorun(function () {

  var message = Session.get('UserEditMessage');
  //console.log("message!",message);
  //showAlert(message.file,message.user);
  //Session.set('StatusMessage', 'none');
       
});


/**
* displays a message if another user besides currentuser is editing this Template
* @param {String} file,  either css , html , js
* @param {String} user, userId who is editing
*/
var showAlert = function(file,user){
  var alert = document.getElementById('alertPanel');
  alert.style.display = "block";
  alert.innerHTML = "User " + user +" is editing the " + file + " now!";

  $("#"+file+"-editor-tab").css({backgroundColor: "#ff9900" });

  hideAlert(file);
}

var hideAlert = _.debounce(function(file){

  document.getElementById('alertPanel').style.display = 'none';

  var color;
  $("#"+file+"-editor-tab").hasClass('current') ? color = "#272822" : color = "#3A3A38";
  $("#"+file+"-editor-tab").css({backgroundColor: color });


},1000);
