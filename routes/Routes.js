
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
  waitOn: function(){
    return this.subscribe("singleTemplateData",this.params._id,Session.get('userId'));
  },
  data: function(){
    return CurrentTemplate.findOne(this.params._id);
  },
  onBeforeAction:function(){
    if(this.data()){      
      this.next(); 
    }else{
      console.warn("template not found!!",this.params._id);
      Router.go('/');
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

