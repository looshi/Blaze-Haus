Template.DeleteTemplateButton.rendered = function(){
  $('#delete-template-controls').hide();
}

Template.DeleteTemplateButton.events({

  'click #delete-template-btn' : function(e){
    $('#delete-template-btn').hide();
    $('#delete-template-controls').show();
    $('#delete-template-error').html('');
  },

  'mouseup #confirm-delete-template-btn' : function(e){

    if(this.likes>10){
      $('#delete-template-btn').hide();
      $('#delete-confirm-message').html('Only admins can delete Templates with more than 10 likes.');
      return;
    }

    Meteor.call('DeleteTemplate',this._id,function(err,res){
      if(err || res === 0){
        $('#delete-template-error').html('error, cannot delete');
        console.warn("delete template error! ", err,res );
      }else{
        Router.go('/');  // navigate to the delete template
      }

    }); 
  },

  'click #cancel-delete-template-btn' : function(e){
    $('#delete-template-btn').show();
    $('#delete-template-controls').hide();
  },

});