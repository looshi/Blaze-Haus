/*
Tabs
Tabs which appear above each css, js, and html file.
*/
Template.Tabs.rendered = function(){

  $('#tab-1').css('opacity','0'); // hides a visual jump as codemirror resizes
  $('#tab-2').css('opacity','0');
  $('#tab-3').css('opacity','0');
  $('#tab-4').css('opacity','0');

  $(document).ready(function() {
    $(".tabs-menu a").click(function(event) {
      event.preventDefault();
      $(this).parent().addClass("current");
      $(this).parent().siblings().removeClass("current");
      var tab = $(this).attr("href");
      $(".tab-content").not(tab).css("display", "none");
      $(tab).show();
    });


    // give code mirror time to initialize itself
    setTimeout(function(){
      $('#tab-2').hide();
      $('#tab-3').hide();
      $('#tab-4').hide();

      $('#tab-1').css('opacity','1');
      $('#tab-2').css('opacity','1');
      $('#tab-3').css('opacity','1');
      $('#tab-4').css('opacity','1');

    },20);

  });
}