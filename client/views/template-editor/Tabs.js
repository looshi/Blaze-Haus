
Template.Tabs.rendered = function(){

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
    },20);

  });
}