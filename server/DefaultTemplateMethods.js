Meteor.startup(function(){

  Meteor.call('CreateDefaultTemplate');

});

Meteor.methods({

  CreateDefaultTemplate : function(){

    TemplateCollection.remove({});
    
    defaultTemplate.modified = new Date();
    defaultTemplate.created = new Date();

    TemplateCollection.insert(defaultTemplate);

    if(!PeopleCollection.findOne()){
      for(var i=0;i<MockPeople.length;i++){
        PeopleCollection.insert(MockPeople[i]);
      }
    }
  },

  RestoreDefaultTemplate : function(){

    defaultTemplate.modified = new Date();

    TemplateCollection.update({name:'Default'},{$set:defaultTemplate});

    PeopleCollection.remove({},function(err,res){
     if(err){
        console.warn("PeopleCollection remove error " , err );
      }else{
        console.warn("PeopleCollection remove ok " , res );
        for(var i=0;i<MockPeople.length;i++){
          PeopleCollection.insert(MockPeople[i]);
        }
      }
    });

  }

});

defaultTemplate = {
  //created: new Date(),
  css: MockCSS,
  dataContext: 'peopleCollectionId', // TODO look this up in the restore routine
  html: MockHTML,
  //modified: new Date(),  // set these dates inside the methods
  lastModifiedBy: 'System',
  name : "Default",
  owner:'System'
}




