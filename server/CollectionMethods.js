var MAX_CHARS = 800; 

Meteor.startup(function(){


  Meteor.call('setDefaults');

  // restore the defaults every hour
  var hour = 1000 * 60 * 60;
  Meteor.setInterval(function(){
    Meteor.call('restoreDefaults');
  },hour); 

});

Meteor.methods({

  saveHTML : function(newHTML,templateId,userId){

    if( newHTML.length<MAX_CHARS && !!userId){
      TemplateCollection.update({_id:templateId},{$set:{html:newHTML,lastModifiedBy:userId}},function(err,res){
        if(err||res===0){
          console.log("saveHTML err",err, res);
        }else{
          console.log("saveHTML OK!", res);
        }
      });
    }
  },

  saveCSS : function(newCSS,templateId,userId){
    if(newCSS.length<MAX_CHARS && !!userId){
      TemplateCollection.update({_id:templateId},{$set:{css:newCSS,lastModifiedBy:userId}},function(err,res){
        if(err||res===0){
          console.log("saveCSS error",err, res);
        }else{
          console.log("saveCSS OK!",res);
        }
      });
    }
  },

  setDefaults : function(){

    defaultTemplate.lastModified = new Date();
    defaultTemplate.created = new Date();

    TemplateCollection.upsert({name:'DefaultTemplate'},{$set:defaultTemplate});

    if(!PeopleCollection.findOne()){
      for(var i=0;i<MockPeople.length;i++){
        PeopleCollection.insert(MockPeople[i]);
      }
    }
  },
  // TODO lookup by name
  restoreDefaults : function(){

    defaultTemplate.modified = new Date();

    TemplateCollection.update({name:'DefaultTemplate'},{$set:defaultTemplate});

    PeopleCollection.remove({});
    for(var i=0;i<MockPeople.length;i++){
      PeopleCollection.insert(MockPeople[i]);
    }
  }
});

defaultTemplate = {
  //created: new Date(),
  css: MockCSS,
  dataContext: 'peopleCollectionId', // TODO look this up in the restore routine
  html: MockHTML,
  //modified: new Date(),  // set these dates inside the methods
  lastModifiedBy: 'System',
  name:'DefaultTemplate',
  owner:'System'
}




