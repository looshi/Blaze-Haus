Tracker.autorun(function () {
  // the data that populates the list of Templates on the homepage
  Meteor.subscribe("summaryTemplateData"); 
  Meteor.subscribe("userData");
});
