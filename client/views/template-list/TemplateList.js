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
  },
  getLikes : function(){
    console.log("likes " , this.likes );
    if(this.likes>0){
      return "&#9829;  "+this.likes;
    }
     
  }

})