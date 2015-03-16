Tracker.autorun(function () {
  // the data that populates the list of Templates on the homepage
  Meteor.subscribe("summaryTemplateData"); 

  // the data that Templates can retrieve via helpers 
  // These subscriptions will be managed individually 
  // once we allow data import https://github.com/looshi/Meteor-Live-Template-Editor/issues/7
  Meteor.subscribe("addressData");
  Meteor.subscribe("peopleData") ;
});
