
Meteor.publish("singleTemplateData", function (_id) {
  return TemplateCollection.find(_id); 
});

Meteor.publish("summaryTemplateData", function () {
  return TemplateCollection.find({}, {fields: {'name': 1 }} );
});

Meteor.publish("peopleData", function () {
   return PeopleCollection.find({});
});