/*
  Data
  represents the data context for the CurrentTemplate being edited
  client only collection
*/

if(Meteor.isClient){

  Data = new Mongo.Collection(null);
}