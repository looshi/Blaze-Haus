/*
DefaultTemplateMethods
creates initial 'default' template
creates sample data collections
*/

Meteor.startup(function(){

  Meteor.call('CreateDefaultTemplate');
  Meteor.call('CreateAddressCollection');
  Meteor.call('CreatePeopleCollection');

});

Meteor.methods({

  CreateDefaultTemplate : function(){

    TemplateCollection.remove({});

    if(!TemplateCollection.findOne()){
      
      var id = TemplateCollection.insert(defaultTemplate);

      console.log( " INSERTING " , TemplateCollection.findOne() );
      
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
  html: MockHTML,
  likes:0,
  js : MockJS,
  json : MockJSON,
  modified: new Date(),  // set these dates inside the methods
  lastModifiedBy: 'System',
  name : "Default",
  owner:'System'
}




