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
    type:Uint8Array,
    label:"css",
    max: 5000
  },
  html:{
    type:Uint8Array,
    label:"html",
    max: 20000
  },
  js:{
    type:Uint8Array,
    label:"js code",
    max: 20000
  },
  json:{
    type:Uint8Array,
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
  },
  published:{
    type:Boolean,
    label:"published"
  },
  screenshot:{
    type:Uint8Array,
    label:'screenshot',
    max:2000,
    optional:true
  }
});

TemplateCollection.attachSchema(Schemas.TemplateCollection);



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



