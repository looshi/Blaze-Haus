// Routes
// application endpoints are declared here to hook up with their corresponding views
// uses iron-router

Router.configure({
  debug: true,
  layoutTemplate:'MainLayout'
});


Router.onBeforeAction(function () {
  if(this.ready()) {
    this.next()
  }else{
    //do something here
  }
});


var InspectorController=RouteController.extend({
  template:"Inspector",
  waitOn:function(){
    return Meteor.subscribe("templateData",this.params._id); 
  },
  data: function(){
    return TemplateCollection.findOne( this.params._id );
  },
  onBeforeAction:function(){
    if(this.data()){      
      // we could get other data here
      this.next(); 
    }
  }
});


Router.route('Inspector', {
  path:'/:_id',         
  controller:InspectorController,
  action:function(){
    this.render('Inspector');
  }
});




