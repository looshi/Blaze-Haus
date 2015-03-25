Template.PublishTemplate.rendered = function(){

  if(this.data.published){
    $('#published-checkbox'+this.data._id).prop('checked',true);
  }else{
    $('#published-checkbox'+this.data._id).prop('checked',false);
  }

  var self = this;

  $('#published-checkbox'+self .data._id).on('change',function(_event){

    var checked = $('#published-checkbox'+self.data._id).prop('checked');
      
    Meteor.call('PublishTemplate',checked,self.data._id,Meteor.userId(),function(err,res){
      if(err || res === 0){
        console.warn("publish error! ", err,res );
        $('#published-checkbox').prop('checked',!checked);
      }else{
        // everything went ok
      }
    }); 

  });

}