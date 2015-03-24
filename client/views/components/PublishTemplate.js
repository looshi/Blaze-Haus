Template.PublishTemplate.rendered = function(){

  if(this.data.published){
    $('#published-checkbox').prop('checked',true);
  }else{
    $('#published-checkbox').prop('checked',false);
  }

}

Template.PublishTemplate.events({

  'change #published-checkbox' : function(_event){

    if( $('#published-checkbox').prop('checked') ){
      
      Meteor.call('PublishTemplate',true,this._id,Meteor.userId(),function(err,res){
        if(err || res === 0){
          console.warn("publish error! ", err,res );
          $('#published-checkbox').prop('checked',false);
        }else{
          // everything went ok
        }
      }); 

    }else{
    
      Meteor.call('PublishTemplate',false,this._id,Meteor.userId(),function(err,res){
        if(err || res === 0){
          console.warn("unpublish error! ", err,res );
          $('#published-checkbox').prop('checked',true);
        }else{
           // everything went ok
        }
      }); 
    }
    
  },

})