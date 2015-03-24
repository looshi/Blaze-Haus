Template.UserProfile.helpers({

  getUserTemplates : function(){

    if(Meteor.userId()===this._id){
      return TemplateCollection.find({owner:this._id});
    }else{
      return TemplateCollection.find({owner:this._id,published:true});
    }
 
  },
  getNumUserTemplates : function(){
    if(Meteor.userId()===this._id){
      return TemplateCollection.find({owner:this._id}).count();
    }else{
      return TemplateCollection.find({owner:this._id,published:true}).count();
    }
  },
  isPublished : function(){
    return this.published;
  }

  
})