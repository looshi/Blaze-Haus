

var templateInspector;     // Template Inspector Instance



Template.Editor.rendered = function(){
  
  
  var peopleData = PeopleCollection.find();
  var parentElement = document.getElementById('htmlOutput');
  var userId = Random.id();  // mimic we have a logged in user


  templateInspector = new TemplateInspector(peopleData,parentElement,userId);

}

 
Template.Editor.events({
  'click .restoreDefaults' : function(e){
    templateInspector.restoreDefaults();
  }
});

