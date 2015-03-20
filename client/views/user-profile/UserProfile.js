Template.UserProfile.helpers({

  getUserTemplates : function(){
    return TemplateCollection.find({owner:this._id});
  },
  getNumUserTemplates : function(){
    return TemplateCollection.find({owner:this._id}).count();
  }
  
})