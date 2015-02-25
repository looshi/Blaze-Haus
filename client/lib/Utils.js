
/*
Utils
some helper functions to validate incoming parameters
*/

Utils = {};


Utils.isString = function(s){
  return (typeof s == 'string' || s instanceof String);
}

Utils.isPosString = function(s){
  return (typeof s == 'string' || s instanceof String && s.length>0 );
}

Utils.isPosNumber = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n) && n >= 0 ;
}

Utils.isNumber = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
