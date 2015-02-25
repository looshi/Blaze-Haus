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
      HTMLCollection.update({name:'myHtml'},{$set:{html:newHTML,lastModifiedBy:userId}},function(err,res){
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
      StylesCollection.update({name:'myStyle'},{$set:{css:newCSS,lastModifiedBy:userId}},function(err,res){
        if(err||res===0){
          console.log("saveHTML err",err, res);
        }else{
          console.log("saveCSS OK!",res);
        }
      });
    }
  },

  setDefaults : function(){
  
    if(!StylesCollection.findOne({name:'myStyle'})){
      StylesCollection.insert({name:'myStyle',css:MockCSS,lastModifiedBy:'system-set-defaults'});
    }
    
    if(!HTMLCollection.findOne({name:'myHtml'})){
      HTMLCollection.insert({name:'myHtml',html:MockHTML,lastModifiedBy:'system-set-defaults'});
    }

    if(!PeopleCollection.findOne()){
      for(var i=0;i<MockPeople.length;i++){
        PeopleCollection.insert(MockPeople[i]);
      }
    }
  },

  restoreDefaults : function(){

    HTMLCollection.update({name:'myHtml'},{$set:{html:MockHTML,lastModifiedBy:'system-restore'}});
    
    StylesCollection.update({name:'myStyle'},{$set:{css:MockCSS,lastModifiedBy:'system-restore'}});
    
    PeopleCollection.remove({});
    for(var i=0;i<MockPeople.length;i++){
      PeopleCollection.insert(MockPeople[i]);
    }
  }
})

