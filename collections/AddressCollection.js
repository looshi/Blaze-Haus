/*
Address Collection
sample test data set
*/

AddressCollection = new Mongo.Collection('AddressCollection');


// different rules for People
if(Meteor.isClient){
  AddressCollection.allow({
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
  AddressCollection.allow({
    insert: function () {
      return false;
    },
    update: function () {
      return false;
    },
    remove: function () {
      return false;
    }
  });
}

