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

  saveHTML : function(newHTML,userId){

    if( newHTML.length<MAX_CHARS && !!userId){
      HTMLCollection.update({template:'DefaultTemplate'},{$set:{html:newHTML,lastModifiedBy:userId}},function(err,res){
        if(err||res===0){
          console.log("saveHTML err",err, res);
        }else{
          console.log("saveHTML OK!", res);
        }
      });
    }
  },

  saveCSS : function(newCSS,userId){
    if(newCSS.length<MAX_CHARS && !!userId){
      StylesCollection.update({template:'DefaultTemplate'},{$set:{css:newCSS,lastModifiedBy:userId}},function(err,res){
        if(err||res===0){
          console.log("saveCSS error",err, res);
        }else{
          console.log("saveCSS OK!",res);
        }
      });
    }
  },

  setDefaults : function(){
  
    if(!StylesCollection.findOne({template:'DefaultTemplate'})){
      StylesCollection.insert({template:'DefaultTemplate',css:MockCSS,lastModifiedBy:'system-set-defaults'});
    }
    
    if(!HTMLCollection.findOne({template:'DefaultTemplate'})){
      HTMLCollection.insert({template:'DefaultTemplate',html:MockHTML,lastModifiedBy:'system-set-defaults'});
    }

    if(!PeopleCollection.findOne()){
      for(var i=0;i<MockPeople.length;i++){
        PeopleCollection.insert(MockPeople[i]);
      }
    }
  },
  // TODO lookup by name
  restoreDefaults : function(){

    HTMLCollection.update({name:'DefaultTemplate'},{$set:{html:MockHTML,lastModifiedBy:'system-restore'}});
    
    StylesCollection.update({name:'DefaultTemplate'},{$set:{css:MockCSS,lastModifiedBy:'system-restore'}});
    
    PeopleCollection.remove({});
    for(var i=0;i<MockPeople.length;i++){
      PeopleCollection.insert(MockPeople[i]);
    }
  }
})

