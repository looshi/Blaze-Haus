
/*
  only publish changes if a different user made the edit
*/
Meteor.publish("singleTemplateData", function (_id,_userId) {

  var self = this;
  var initializing = true;

  TemplateCollection.find(_id).observeChanges({
    added: function (id, fields) {

      if(!initializing){
        self.added("CurrentTemplate",_id , fields  );
      }

    }, 
    changed: function (id, fields) {
      if(_userId!==TemplateCollection.findOne(_id).lastModifiedBy){
        self.changed("CurrentTemplate",id,fields);
      }      
    },
    removed: function (id) {
      self.removed("CurrentTemplate",id);
    }
  });

  initializing = false;
  self.added("CurrentTemplate", _id, TemplateCollection.findOne(_id) );
  self.ready();

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