
Meteor.publish("singleTemplateData", function (_id) {
  return TemplateCollection.find(_id); 
});

Meteor.publish("summaryTemplateData", function () {
  return TemplateCollection.find(); 
});

Meteor.publish("peopleData", function () {
   return PeopleCollection.find({});
});