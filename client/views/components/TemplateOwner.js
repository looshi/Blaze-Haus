Template.TemplateOwner.helpers({
  getOwner : function(){

    if(this.owner!=='anonymous'&&this.owner!=='System'){
      
      var user = Meteor.users.findOne(this.owner);
      if(user && user.services){
        var githubId = user.services.github.id;
        var userId = user._id;
        var html = "<a href='/user/"+userId+"'><img src='https://avatars.githubusercontent.com/u/"+githubId+"?s=24'/></a>"
        return html;
      }
    }else{
      return "<span class='anonymous-owner'>anonymous</span>";
    }
  }
});