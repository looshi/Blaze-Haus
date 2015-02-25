
Meteor.publish("htmlData", function () {
   return HTMLCollection.find({});
});

Meteor.publish("cssData", function () {
   return StylesCollection.find({});
});

Meteor.publish("peopleData", function () {
   return PeopleCollection.find({});
});