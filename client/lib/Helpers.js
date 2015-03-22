UI.registerHelper("githubAvatar", function(size) {

  if(Meteor.user()  && Meteor.user().services ){

    var id = Meteor.user().services.github.id;
    if(!size){
      size = 40;
    }
    return 'https://avatars.githubusercontent.com/u/'+id+"?s="+size;
  }

});

UI.registerHelper("templateOwnerAvatar", function(template,showname){

  if(template.owner!=='anonymous'&&template.owner!=='System'){
    
    var user = Meteor.users.findOne(template.owner);
    if(user && user.services){
      var githubId = user.services.github.id;
      var userId = user._id;
      var html = "<a class='avatar-link' href='/user/"+userId+"'><img src='https://avatars.githubusercontent.com/u/"+githubId+"?s=24'/>";
      if(showname){
        html += user.services.github.username;
      }
      html+="</a>";
      return html;
    }
  }else{
    return "<div class='avatar-link'></div>";
  }
  
});


UI.registerHelper("githubUsername", function(date) {

  if(Meteor.user() && Meteor.user().services ){
    return Meteor.user().services.github.username;
  }

});

UI.registerHelper("getLikes", function(template) {
  if(template.likes>0){
    return "&#9829;  "+template.likes;
  }
});
