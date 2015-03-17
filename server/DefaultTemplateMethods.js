Meteor.startup(function(){

  Meteor.call('CreateDefaultTemplate');
  Meteor.call('CreateAddressCollection');
  Meteor.call('CreatePeopleCollection');

});

Meteor.methods({

  CreateDefaultTemplate : function(){

    if(!TemplateCollection.findOne()){
      TemplateCollection.insert(defaultTemplate);
    }
  },

  CreatePeopleCollection : function(){

    if(!PeopleCollection.findOne()){
      for(var i=0;i<MockPeople.length;i++){
        PeopleCollection.insert(MockPeople[i]);
      }
    }
  },

  CreateAddressCollection : function(){

    if(!AddressCollection.findOne()){
      for(var i=0;i<MockPeople.length;i++){
        AddressCollection.insert(AddressData[i]);
      }
    }
  }


});

defaultTemplate = {
  created: new Date(),
  css: MockCSS,
  dataContext: 'peopleCollectionId', // TODO look this up in the restore routine
  html: MockHTML,
  likes:0,
  js : MockJS,
  modified: new Date(),  // set these dates inside the methods
  lastModifiedBy: 'System',
  name : "Default",
  owner:'System'
}




