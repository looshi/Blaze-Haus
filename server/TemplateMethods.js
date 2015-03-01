Meteor.methods({

  saveHTML : function(newHTML,templateId,userId){
    if( newHTML.length<MAX_CHARS && !!userId){
      TemplateCollection.update({_id:templateId},{$set:{html:newHTML,lastModifiedBy:userId}},function(err,res){
        if(err||res===0){
          console.log("saveHTML err",err, res);
        }else{
          console.log("saveHTML OK!", res);
        }
      });
    }
  },

  saveCSS : function(newCSS,templateId,userId){
    if(newCSS.length<MAX_CHARS && !!userId){
      TemplateCollection.update({_id:templateId},{$set:{css:newCSS,lastModifiedBy:userId}},function(err,res){
        if(err||res===0){
          console.log("saveCSS error",err, res);
        }else{
          console.log("saveCSS OK!",res);
        }
      });
    }
  },



});