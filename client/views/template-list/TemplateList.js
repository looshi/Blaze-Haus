/*
TemplateList
Lists all Templates in the database with summary information.
*/

Template.TemplateList.helpers({

  getTopRated : function(){
    return TemplateCollection.find({},{sort:{likes:-1},limit:1000});
  },
  getLatest : function(){
    return TemplateCollection.find({},{sort:{created:-1},limit:1000});
  },
  getNumTemplates : function(){
    return TemplateCollection.find().count();
  }
})