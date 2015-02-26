Template.Instructions.events({
  'click .restoreDefaults' : function(e){
    Meteor.call('restoreDefaults');
  }
});