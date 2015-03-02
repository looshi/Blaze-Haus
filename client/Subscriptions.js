Tracker.autorun(function () {
  Meteor.subscribe("summaryTemplateData"); // summary information for template documents in TemplateCollection
  Meteor.subscribe("addressData"); // summary information for template documents in TemplateCollection
});
