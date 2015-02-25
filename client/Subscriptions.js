Tracker.autorun(function () {
  Meteor.subscribe("htmlData");
  Meteor.subscribe("cssData");
  Meteor.subscribe("peopleData");
});
