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
  getOwner : function(){

    if(this.owner!=='anonymous'&&this.owner!=='System'){
      
      var user = Meteor.users.findOne(this.owner);
      if(user && user.services){
        var id = user.services.github.id;
        var html = "<a href='/"+id+"'><img src='https://avatars.githubusercontent.com/u/"+id+"?s=24'/></a>"
        return html;
      }
    }else{
      return '&nbsp;&nbsp;';
    }
  }

})