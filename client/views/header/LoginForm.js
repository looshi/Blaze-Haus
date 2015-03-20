

Template.LoginForm.events({

  'click #login-button' : function(){
    Meteor.loginWithGithub();
  },

  'click #logout-button' : function(){
    Meteor.logout();
  }


})