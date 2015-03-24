


/**
* displays a message if another user besides currentuser is editing this Template
* @param {String} file,  either css , html , js
* @param {String} user, userId who is editing
*/
var showAlert = function(msg){
  var alert = document.getElementById('statusMessage');
  if(alert){
    alert.style.display = "block";
    alert.innerHTML = msg;
    //$("#"+file+"-editor-tab").css({backgroundColor: "#ff9900" });
    //hideAlert(file);
  }
}

var hideAlert = _.debounce(function(file){

  //document.getElementById('statusMessage').style.display = 'none';

  var color;
  $("#"+file+"-editor-tab").hasClass('current') ? color = "#272822" : color = "#3A3A38";
  $("#"+file+"-editor-tab").css({backgroundColor: color });


},1000);


/*
Status Message
displays save progress
displays message on screen when another user 
makes an edit to currentuser's template.
*/

Tracker.autorun(function () {

  var message = Session.get('UserEditMessage');
  showAlert(message);
  //Session.set('UserEditMessage', 'none');
       
});
