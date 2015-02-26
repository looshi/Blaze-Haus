
Meteor.publish("templateData", function () {
   return TemplateCollection.find({});
});

Meteor.publish("peopleData", function () {
   return PeopleCollection.find({});
});