UI.registerHelper("githubAvatar", function(size) {

  if(Meteor.user()  && Meteor.user().services ){

    var id = Meteor.user().services.github.id;
    if(!size){
      size = 40;
    }
    return 'https://avatars.githubusercontent.com/u/'+id+"?s="+size;
  }

});

UI.registerHelper("githubUsername", function(date) {

  if(Meteor.user() && Meteor.user().services ){
    return Meteor.user().services.github.username;
  }

});