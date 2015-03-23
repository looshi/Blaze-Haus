/*
Template Collection
represents on editable template
consisting of a data context, Template HTML, and CSS
eventually helper functions too
*/


TemplateCollection = new Mongo.Collection('TemplateCollection');

if(!Schemas)
var Schemas = {};

Schemas.TemplateCollection = new SimpleSchema({

  created: {
    type: Date,
    label: "created"
  },
  css:{
    type:String,
    label:"css",
    max: 5000
  },
  html:{
    type:String,
    label:"html",
    max: 20000
  },
  js:{
    type:String,
    label:"js code",
    max: 20000
  },
  json:{
    type:String,
    label:"json collection data",
    max : 20000
    //blackbox : true
  },
  likes:{
    type:Number,
    label:"likes"
  },
  modified:{
    type:Date,
    label:"lastModified - Date last update occured"
  },
  lastModifiedBy:{
    type:String,
    label:"lastModifiedBy - user id who last modified this template"
  },
  name:{
    type:String,
    label:"title of this template",
    max: 30
  },
  owner:{
    type:String,
    label:"owner - user id"
  }
});

TemplateCollection.attachSchema(Schemas.TemplateCollection);




if(Meteor.isClient){

  TemplateCollection.allow({
    insert: function () {
      return false;
    },
    update: function () {
      return false;
    },
    remove: function () {
      return false;
    }
  });

}
if(Meteor.isServer){
  TemplateCollection.allow({
    insert: function () {
      return true;
    },
    update: function () {
      return true;
    },
    remove: function () {
      return true;
    }
  });
}


