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
    max: 1000
  },
  dataContext:{
    type:String,
    label:"_id of Data Collection to use as the data context for this template"
  },
  html:{
    type:String,
    label:"html",
    max: 1000
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
    max: 100
  },
  owner:{
    type:String,
    label:"owner - user id"
  }
});

// not sure why but simple schema is not working, disabling for now
//TemplateCollection.attachSchema(Schemas.TemplateCollection);

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