var MAX_CHARS = 800;

Meteor.methods({

  /*
  creates a copy of Default Template
  */
  CreateNewTemplate : function(name){
    
    if(name==='Default Template'){
      throw new Error("error, cannot use default name")
    }
    var template = TemplateCollection.findOne({name:'Default Template'});
    template.name = name;
    template.created = new Date();
    template.modified = new Date();
    delete template._id;
    var newTemplate = TemplateCollection.insert(template);
    return newTemplate;
  },

  SaveTemplate : function(id,options){
    
    if(options.name==='Default Template'){
      throw new Error("error, cannot use default name")
    }
    
    TemplateCollection.update({_id:id}, {$set:options}, function(err,res){
      if(err||res===0){
        throw new Error("Error saving template ", err);
      }else{
        return res;
      }
    });
  },

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