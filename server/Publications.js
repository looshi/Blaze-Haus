

/* 
singleTemplateData
Publishes the current template used in the Editor, including all editable fields.
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

      var userMadeChange = (_userId===TemplateCollection.findOne(_id).lastModifiedBy);

      if( !userMadeChange || fields.name ){
        self.changed("CurrentTemplate",id,fields);  // Only publish changes if a different user made the edit
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


/* 
summaryTemplateData
Publishes the entire list of all Templates, limited to a few fields.
*/ 
Meteor.publish("summaryTemplateData", function () {
  return TemplateCollection.find({}, {fields: {'name': 1,'likes':1 }} );
});


// sample data publication
Meteor.publish("peopleData", function () {
   return PeopleCollection.find({});
});

// sample data publication
Meteor.publish("addressData", function () {
   return AddressCollection.find({});
});