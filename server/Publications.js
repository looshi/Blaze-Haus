
Meteor.publish("singleTemplateData", function (_id) {
  return TemplateCollection.find(_id); 
});

Meteor.publish("summaryTemplateData", function () {
  return TemplateCollection.find({}, {fields: {'name': 1,'likes':1 }} );
});

Meteor.publish("peopleData", function () {
   return PeopleCollection.find({});
});

Meteor.publish("addressData", function () {
   return AddressCollection.find({});
});