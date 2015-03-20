
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

Router.route('About', {
  path:'/about',     
});

var EditorController=RouteController.extend({
  template:"Editor",
  waitOn: function(){
    var userId = Meteor.userId() ? Meteor.userId() : Session.get('AnonymousUserId');
    return this.subscribe("singleTemplateData",this.params._id,userId);
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


var UserProfileController=RouteController.extend({
  template:"UserProfile",
  data: function(){
    return Meteor.users.findOne(this.params._id);
  },
  onBeforeAction:function(){
    if(this.data()){      
      this.next(); 
    }else{
      console.warn("user not found!!",this.params._id);
      Router.go('/');
    }
  }
});


Router.route('UserProfile', {
  path:'/user/:_id',
  controller:UserProfileController,
  action:function(){
    this.render('UserProfile');
  }     
});
