
Router.configure({
  debug: true,
  layoutTemplate:'MainLayout'
});


Router.onBeforeAction(function () {
  if(this.ready()) {
    this.next()
  }else{
    this.render('LoadingTemplate');
  }
});

Router.route('TemplateList', {
  path:'/',     
});

var EditorController=RouteController.extend({
  template:"Editor",

  data: function(){
    return this.params._id;
  },
  onBeforeAction:function(){
    if(this.data()){      
      console.log("onBefore....",this.data());
      this.next(); 
    }else{
      console.warn("template not found!!",this.params._id);
      //Router.go('/');
    }
  }
});


Router.route('Editor', {
  path:'/:_id',     
  controller:EditorController,
  action:function(){
    this.render('Editor');
  }
});

