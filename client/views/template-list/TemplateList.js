/*
TemplateList
Lists all Templates in the database with summary information.
*/

Template.TemplateList.helpers({

  templates : function(){
    return TemplateCollection.find();
  },
  getNumTemplates : function(){
    return TemplateCollection.find().count();
  }

})