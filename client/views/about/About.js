/*
About
'help' type information describing the project and how to use it.
*/
Template.About.events({
  'click .restoreDefaults' : function(e){
    Meteor.call('restoreDefaults');
  },
  'click #toggle-directions' : function(e){
    e.preventDefault();
    var el = $('.instructions-container');
    el.toggle();
    if(el.css("display")==='none' ){
      $(e.target).html('show directions');
    }else{
      $(e.target).html('hide directions');
    }
  },
});