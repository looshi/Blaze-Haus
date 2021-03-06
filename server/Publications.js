

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
Publishes the github id and username for all users.
*/ 
Meteor.publish("userData",function(){
  return Meteor.users.find({} , {fields : {'services.github.id':1,'services.github.username':1}} );
})

/* 
User Profile templates
Publishes all the 'published' templates for a user, to show on their profile page
*/ 
Meteor.publish("userProfileTemplates",function(userId){
  var fields = {'name': 1,'likes':1,'owner':1,'created':1,'published':1,'screenshot':1 };
  return TemplateCollection.find({owner:userId},{fields:fields});
})


/* 
templateDataByCreated
Publishes a list of all published non-anonymous Templates sorted by creation date
limited to a few fields, and paging parameters
the reason we publish to a custom client-only collection
is because there are two lists on the homepage, both showing Documents from the Template Collection
this allows the two lists to subscribe to Template Collection changes independently of each other.
*/ 
Meteor.publish("templateDataByCreated", function(index,amount){
    var self = this;

    var handle = getTemplatesBySort(index,amount,{created:-1}).observeChanges({
        added: function(id, fields) {
          self.added("RecentTemplates",id, fields);
        },
        changed: function(id, fields) {
          self.changed("RecentTemplates",id, fields);
          self.flush();
        },
        removed: function (id) {
          self.removed("RecentTemplates",id);
        }
    });

    this.onStop(function() {
        handle.stop();
    });
    self.ready();

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





