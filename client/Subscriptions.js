Tracker.autorun(function () {
  Meteor.subscribe("peopleData");         // PeopleCollection document, dataContext provided to the dynamic templates
  Meteor.subscribe("summaryTemplateData"); // summary information for template documents in TemplateCollection
});
