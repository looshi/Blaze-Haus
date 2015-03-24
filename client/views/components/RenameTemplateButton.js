Template.RenameTemplateButton.rendered = function(){

  $('#rename-template-controls').hide();
  $('#rename-template-btn').prop('disabled', true);
  setTimeout(function(){
    $('#rename-template-btn').prop('disabled', false); // match the server throttle
  },1000);
}

Template.RenameTemplateButton.events({

  'click #rename-template-btn' : function(e){
    $('.menu-button').show();
    $('.menu-confirmation').hide();
    $('#rename-template-btn').hide();
    $('#rename-template-controls').show();
    $('#template-name-field').val('');
    $('#rename-template-field').focus();
    $('#rename-template-error').html('');
  },

  'mouseup #confirm-rename-template-btn' : function(e){

    var name = $('#rename-template-field').val();
    if(name.length<2 || name.length>30){
      $('#rename-template-error').html('Must be between 2 and 30 chars.');
      return;
    }
    var userId;
    if(Meteor.userId()){
      userId = Meteor.userId();
    }else{
      userId = Session.get('AnonymousUserId');
    }
    Meteor.call('RenameTemplate',name,this._id,userId,function(err,res){
      if(err || res === 0){
        console.warn("new template error! ", err,res );
        $('#rename-template-error').html(err);
      }else{
        $('#rename-template-btn').show();
        $('#rename-template-controls').hide();
        $('#rename-template-field').val('');
      }

    }); 
  },
  'click #cancel-rename-template-btn' : function(e){
    $('#rename-template-btn').show();
    $('#rename-template-controls').hide();
    $('#rename-template-field').val('');
  },

});