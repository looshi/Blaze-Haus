/*
  CurrentTemplate
  represents the current editable template
  client only collection
*/

if(Meteor.isClient){

  CurrentTemplate = new Mongo.Collection("CurrentTemplate");
}