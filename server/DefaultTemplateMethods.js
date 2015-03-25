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

    TemplateCollection.remove({name:'Default'});
    var temp = defaultTemplate;
    temp.published = false;
    TemplateCollection.insert(temp);
    
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
  css: pako.deflate(MockCSS),
  html: pako.deflate(MockHTML),
  likes:0,
  js : pako.deflate(MockJS),
  json : pako.deflate(MockJSON),
  modified: new Date(),  // set these dates inside the methods
  lastModifiedBy: 'System',
  name : "Default",
  owner:'System',
  published:true
}




