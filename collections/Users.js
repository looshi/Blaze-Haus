/*
AnonymousUserId
for non-logged in users 
*/

if(Meteor.isClient){

  Meteor.startup(function(){
    var userId = Random.id();
    Session.set('AnonymousUserId','anon'+userId); 
  });


}


Meteor.users.allow({
  update: function() {
    return false;
  }
});