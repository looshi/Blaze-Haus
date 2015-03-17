/*
TemplateMethods
CRUD methods for a single editable Template
*/

Fiber = Npm.require('fibers');
Future = Npm.require('fibers/future');

Meteor.methods({

  /*
  creates a copy of 'Default' Template
  */
  CreateNewTemplate : function(name){

    if(name==='Default'){
      throw new Error("error, cannot use default name")
    }
    var template = defaultTemplate;
    template.name = name;
    template.created = new Date();
    template.modified = new Date();
    delete template._id;
    var newTemplate = TemplateCollection.insert(template);
    return newTemplate;
  },

  DuplicateTemplate : function(_id,_name){

    var template = TemplateCollection.findOne(_id);
    delete template._id;
    template.name = _name;
    template.modified = new Date();
    template.created = new Date();
    var newTemplate = TemplateCollection.insert(template);
    return newTemplate;
  },

  SaveTemplate : function(id,options){
    
    var future = new Future();

    if(options.name==='Default'){
       future.throw("error, cannot use default name");
    }

    if(options.created){
      delete options.created;
    }
    
    TemplateCollection.update({_id:id}, {$set:options}, function(err,res){
      if(err||res===0){
        future.throw("Error saving template ", err);
      }else{
        future.return(res);
      }
    });

    return future.wait();
  },

  DeleteTemplate : function(id){

    var template = TemplateCollection.findOne(id);
    if(template){
      if(template.likes>10){
        throw new Error("only admins can delete Templates with more than 10 likes.");
      }
    }
    if(template.name==='Default'){
      throw new Error("Cannot delete default.");
    }

    return TemplateCollection.remove({_id:id});

  },

  LikeTemplate : function(id){
    
    TemplateCollection.update({_id:id}, {$inc:{likes:1}});
    
  },

  saveHTML : function(newHTML,templateId,userId){

    TemplateCollection.update({_id:templateId},{$set:{html:newHTML,lastModifiedBy:userId}},function(err,res){
      if(err||res===0){
        console.log("saveHTML err",err, res);
      }else{
        //console.log("saveHTML OK!", res);
      }
    });
    
  },

  saveJS : function(newJS,templateId,userId){

    TemplateCollection.update({_id:templateId},{$set:{js:newJS,lastModifiedBy:userId}},function(err,res){
      if(err||res===0){
        console.log("saveJS err",err, res);
      }else{
        //console.log("saveHTML OK!", res);
      }
    });
    
  },

  saveCSS : function(newCSS,templateId,userId){

    TemplateCollection.update({_id:templateId},{$set:{css:newCSS,lastModifiedBy:userId}},function(err,res){
      if(err||res===0){
        console.log("saveCSS error",err, res);
      }else{
        //console.log("saveCSS OK!",res);
      }
    });
    
  },
  RenameTemplate : function(newName,templateId,userId){
    
    if(newName==='Default'){
       throw new Error("error, cannot use default name");
    }

    TemplateCollection.update({_id:templateId},{$set:{name:newName,lastModifiedBy:userId}},function(err,res){
      if(err||res===0){
        console.log("rename error",err, res);
      }else{
        //console.log("saveCSS OK!",res);
      }
    });
    
  },


});