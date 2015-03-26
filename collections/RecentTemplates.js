/*
  RecentTemplates
  templates that have been recently created and published
  client only collection
*/

if(Meteor.isClient){
  RecentTemplates = new Mongo.Collection("RecentTemplates");
}