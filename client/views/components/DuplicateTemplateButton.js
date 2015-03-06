Template.DuplicateTemplateButton.rendered = function(){

  $('#duplicate-template-controls').hide();

}

Template.DuplicateTemplateButton.events({

  'click #duplicate-template-btn' : function(e){
    $('#duplicate-template-btn').hide();
    $('#duplicate-template-controls').show();
    $('#duplicate-template-name-field').val(this.name+'Copy');
    $('#duplicate-template-name-field').focus();
    $('#duplicate-template-error').html('');
  },

  'mouseup #confirm-duplicate-template-btn' : function(e){

    var name = $('#duplicate-template-name-field').val();
    if(name.length<2 || name.length>30){
      $('#duplicate-template-error').html('Must be between 2 and 30 chars.');
      return;
    }
    Meteor.call('CreateNewTemplate',name,function(err,res){
      if(err || res === 0){
        console.warn("new template error! ", err,res );
      }else{
        Router.go('/'+res);  // navigate to the new template
      }

    }); 
  },
  'click #cancel-duplicate-template-btn' : function(e){
    $('#duplicate-template-btn').show();
    $('#duplicate-template-controls').hide();
    $('#duplicate-template-name-field').val('');
  },

});