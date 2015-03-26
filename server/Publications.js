

/* 
singleTemplateData
Publishes the current template used in the Editor, including all editable fields.
*/ 

Meteor.publish("singleTemplateData", function (_id,_userId) {

  var self = this;
  var initializing = true;

  var handle = TemplateCollection.find(_id).observeChanges({
    added: function (id, fields) {

      if(!initializing){
        self.added("CurrentTemplate",_id , fields  );
      }

    }, 
    changed: function (id, fields) {

      var userMadeChange = (_userId===TemplateCollection.findOne(_id).lastModifiedBy);

      // send changes to code if another user made the change
      // send changes to likes
      // send changes to template name
      if( !userMadeChange || fields.name || fields.likes || fields.screenshot ){
        self.changed("CurrentTemplate",id,fields);  // Only publish changes if a different user made the edit, or user renamed template
      }      
    },
    removed: function (id) {
      self.removed("CurrentTemplate",id);
    }
  });

  initializing = false;
  self.added("CurrentTemplate", _id, TemplateCollection.findOne(_id) );
  self.ready();
  self.onStop( function(){handle.stop();});

});


/* 
userData
Publishes the current template used in the Editor, including all editable fields.
*/ 
Meteor.publish("userData",function(){
  return Meteor.users.find({} , {fields : {'services.github.id':1,'services.github.username':1}} );
})



/* 
templateDataByCreated
Publishes a list of all published non-anonymous Templates sorted by creation date
limited to a few fields, and paging parameters
*/ 
Meteor.publish("templateDataByCreated", function (index,amount) {

  return getTemplatesBySort(index,amount,{created:-1});

});

/* 
templateDataByLikes
Publishes a list of all published non-anonymous Templates sorted by number of likes
limited to a few fields, and paging parameters
*/ 
Meteor.publish("templateDataByLikes", function (index,amount) {

  return getTemplatesBySort(index,amount,{likes:-1});

});

var getTemplatesBySort = function(index,amount,_sort){
  index = parseInt(index);
  amount = parseInt(amount);
  var skipAmt = amount*index;

  var fields = {'name': 1,'likes':1,'owner':1,'created':1,'published':1,'screenshot':1 };
  var match = {owner:{$ne:'anonymous'},published:true};

  return TemplateCollection.find(match,{sort:_sort,fields:fields,limit:amount,skip:skipAmt});
}

/* 
GetNumberOfPublishedTemplates
Returns the total number of non-anonymous published documents in the TemplateCollection
*/ 
Meteor.methods({

  GetNumberOfPublishedTemplates:function(){
  
    var match = {owner:{$ne:'anonymous'},published:true};
    return TemplateCollection.find(match).count();

  },


});





