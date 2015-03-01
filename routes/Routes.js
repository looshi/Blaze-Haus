
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

var InspectorController=RouteController.extend({
  template:"Inspector",
  waitOn:function(){
    return [
      Meteor.subscribe("singleTemplateData",this.params._id),
      Meteor.subscribe("peopleData") 
    ]
  },
  data: function(){
    return TemplateCollection.findOne( this.params._id );
  },
  onBeforeAction:function(){
    if(this.data()){      
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




