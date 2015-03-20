
Template.LoginForm.helpers({

  getUserId : function(){
    return Meteor.userId();
  }
});
Template.LoginForm.events({

  'click #login-button' : function(){
    Meteor.loginWithGithub();
  },

  'click #logout-button' : function(){
    Meteor.logout();
  }


})