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
    max: 2000
  },
  html:{
    type:String,
    label:"html",
    max: 2000
  },
  js:{
    type:String,
    label:"js code",
    max: 2000
  },
  json:{
    type:[Object],
    label:"json collection data",
    blackbox : true
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

// allow it all for now
TemplateCollection.allow({
  insert: function () {
    return true;
  },
  update: function () {  // TODO don't allow name : 'DefaultTemplate' 
    return true;
  },
  remove: function () {
    return true;
  }
});