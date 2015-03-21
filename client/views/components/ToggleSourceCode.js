Template.ToggleSourceCode.events({

  'click #toggleSourceButton' : function(){
    $('.source-code').toggle();

    console.log(   $('.source-code')  );

    if( $('.source-code').is(":visible") ){
      $('#toggleSourceButton').html("Hide Source");
      $('.rendered-output').width('45%');
    }else{
      $('#toggleSourceButton').html("View Source");
      $('.rendered-output').width('100%');
    }
  }

})