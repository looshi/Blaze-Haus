
Meteor.startup(function(){
  Session.set('ViewSource',"show");
  Session.set('ViewSourceText',"Hide Source");
  Session.set('Fullscreen',"");
})

Template.ToggleSourceCode.events({

  'click #toggleSourceButton' : function(){

    if( Session.get("ViewSource") === "show" ){
      Session.set('ViewSource',"hidden");
      Session.set('ViewSourceText',"View Source");
      Session.set('Fullscreen',"full-screen");
    }else{
      Session.set('ViewSource',"show");
      Session.set('ViewSourceText',"Hide Source");
      Session.set('Fullscreen',"");
    }
  }

});

Template.ToggleSourceCode.helpers({
  getViewSourceText: function () {
    return Session.get("ViewSourceText");
  }
});