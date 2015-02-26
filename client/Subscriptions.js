Tracker.autorun(function () {
  Meteor.subscribe("templateData");
  Meteor.subscribe("peopleData");
});
