Template.ToggleSourceCode.events({

  'click #toggleSourceButton' : function(){
    $('.source-code').toggle();

    console.log(   $('.source-code')  );

    if( $('.source-code').is(":visible") ){
      $('#toggleSourceButton').html("Hide Source");
      $('.rendered-output').removeClass('full-screen');
    }else{
      $('#toggleSourceButton').html("View Source");
      $('.rendered-output').addClass('full-screen');
    }
  }

})