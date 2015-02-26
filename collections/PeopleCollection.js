/*
People Collection
sample test data set
used as a default to populate the editor
also used for testing against , since it should never change
*/

PeopleCollection = new Mongo.Collection('PeopleCollection');


// different rules for People
if(Meteor.isClient){
  PeopleCollection.allow({
    insert: function () {
      return false;
    },
    update: function () {
      return true;
    },
    remove: function () {
      return false;
    }
  });
}
if(Meteor.isServer){
  PeopleCollection.allow({
    insert: function () {
      return true;
    },
    update: function () {
      return true;
    },
    remove: function () {
      return true;
    }
  });
}

