Template.LikeButton.events({

  'click #like-template-btn' : function(e){

    var userId = Session.get('AnonymousUserId');
    
    if( Session.get('voted'+this._id) ){
      console.warn('aready voted.');
      return;
    }
    var self = this;

    Meteor.call('LikeTemplate',this._id,function(err,res){
      if(err || res === 0){
        console.warn("like template error! ", err,res );
      }else{
        Session.set('voted'+self._id,true);
      }

    }); 
  }

});