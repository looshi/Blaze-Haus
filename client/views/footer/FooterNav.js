/*
Footer Nav
next / prev buttons to navigate Templates
*/

var templates;
var templateNames;

Template.FooterNav.created = function(){

  var arr = TemplateCollection.find({owner:{$ne:'anonymous'}},{sort:{created:-1},limit:1000}).fetch();
  templates = _.map(arr, function(t){ return t._id; }); // get a list of Template ids
  templateNames = _.map(arr, function(t){ return t.name; }); // list of names
}

Template.FooterNav.helpers({
  nextName : function(){
    var currentIndex = templates.indexOf(this._id);
    if(currentIndex === templates.length-1 ){
      currentIndex = -1;
    }
    return templateNames[currentIndex+1];
  },
  prevName : function(){
    var currentIndex = templates.indexOf(this._id);
    if(currentIndex === 0 ){
      currentIndex = templates.length;
    }
    return templateNames[currentIndex-1];
  }
});

Template.FooterNav.events({
  'click #next-template-btn' : function(){
    var currentIndex = templates.indexOf(this._id);
    if(currentIndex === templates.length-1 ){
      currentIndex = -1;
    }
    Router.go('/'+templates[currentIndex+1]);
  },
  'click #previous-template-btn' : function(){
    var currentIndex = templates.indexOf(this._id);
    if(currentIndex === 0 ){
      currentIndex = templates.length;
    }
    Router.go('/'+templates[currentIndex-1]);
  }
});

