/*
we don't have accounts 
so all this does is set a Session variable
for the current user.
*/

if(Meteor.isClient){

  Meteor.startup(function(){
    var userId = Random.id();
    Session.set('userId',userId); 
  });


}