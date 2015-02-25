HTMLCollection = new Meteor.Collection('HTMLCollection');
StylesCollection = new Meteor.Collection('StylesCollection');
PeopleCollection = new Meteor.Collection('PeopleCollection');



// allow everything for now
HTMLCollection.allow({
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

StylesCollection.allow({
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