/*
TemplateMethods
CRUD methods for a single editable Template
*/

Fiber = Npm.require('fibers');
Future = Npm.require('fibers/future');

// rate limit requests
if(typeof EasySecurity!=='undefined'){
  EasySecurity.config({
  methods: {
    CreateNewTemplate: { type: 'throttle', ms: 1000  },
    DuplicateTemplate: { type: 'throttle', ms: 1000  },
    DeleteTemplate: { type: 'throttle', ms: 1000  },
    LikeTemplate: { type: 'throttle', ms: 1000  },
    RenameTemplate: { type: 'throttle', ms: 1000  },
    SaveHTML: { type: 'throttle', ms: 2000 },
    SaveCSS: { type: 'throttle', ms: 2000 },
    SaveJS: { type: 'throttle', ms: 2000 },
    SaveJSON: { type: 'throttle', ms: 2000 } 
  }
 });
}


Meteor.methods({

  /*
  creates a copy of 'Default' Template
  */
  CreateNewTemplate : function(name){

    if(name==='Default'){
      throw new Error("error, cannot use default name")
    }

    var template = defaultTemplate;

    if(this.userId){
      template.owner = this.userId;
    }else{
      template.owner = 'anonymous';
    }

    template.name = name;
    template.created = new Date();
    template.modified = new Date();
    template.html = MockHTML.split('Default Template').join(name); // use the filename for <H2> 
    template.html = pako.deflate(template.html);
    delete template._id;
    var newTemplate = TemplateCollection.insert(template);
    return newTemplate;
  },

  DuplicateTemplate : function(templateId,_name){

    var template = TemplateCollection.findOne(templateId);

    if(this.userId){
      template.owner = this.userId;
    }else{
      template.owner = 'anonymous';
    }

    template.likes = 0;

    delete template._id;
    template.name = _name;
    template.modified = new Date();
    template.created = new Date();
    var newTemplate = TemplateCollection.insert(template);
    return newTemplate;
  },

  DeleteTemplate : function(templateId,userId){

    var template = TemplateCollection.findOne(templateId);

    if( !canUpdate(templateId,userId,this.userId) ){
      throw new Error("Cannot delete.");
    }

    if(template.name==='Default'){
      throw new Error("Cannot delete default.");
    }

    return TemplateCollection.remove({_id:templateId});

  },

  LikeTemplate : function(id){
    
    TemplateCollection.update({_id:id}, {$inc:{likes:1}});
    
  },

  SaveHTML : function(newHTML,templateId,userId){

    if( !canUpdate(templateId,userId,this.userId) ){
      throw new Error("Error Cannot saveHTML.");
      return;
    }

    var future = new Future();
    
    var fields = {html:newHTML,lastModifiedBy:userId,modified:new Date()};

    TemplateCollection.update({_id:templateId},{$set:fields},function(err,res){
      if(err||res===0){
        future.throw('SaveHTML error '+err);
      }else{
        future.return(res); 
      }
    });

    return future.wait();
    
  },

  SaveJS : function(newJS,templateId,userId){

    if( !canUpdate(templateId,userId,this.userId) ){
      throw new Error("Error Cannot saveJS.");
      return;
    }

    var future = new Future();

    var fields = {js:newJS,lastModifiedBy:userId,modified:new Date()};

    TemplateCollection.update({_id:templateId},{$set:fields},function(err,res){
      if(err||res===0){
        future.throw("saveJS err",err, res);
      }else{
        future.return(res); 
      }
    });

    return future.wait();
  },

  SaveJSON : function(newJSON,templateId,userId){

    if( !canUpdate(templateId,userId,this.userId) ){
      throw new Error("Error Cannot saveJSON.");
      return;
    }

    var future = new Future();

    var fields = {json:newJSON,lastModifiedBy:userId,modified:new Date()};

    TemplateCollection.update({_id:templateId},{$set:fields},function(err,res){
      if(err||res===0){
        future.throw("saveJSON err",err, res);
      }else{
        future.return(res); 
      }
    });

    return future.wait();
  },

  SaveCSS : function(newCSS,templateId,userId){
    
    if( !canUpdate(templateId,userId,this.userId) ){
      throw new Error("Error Cannot saveCSS.");
      return;
    }

    var future = new Future();

    var fields = {css:newCSS,lastModifiedBy:userId,modified:new Date()};

    TemplateCollection.update({_id:templateId},{$set:fields},function(err,res){
      if(err||res===0){
        future.throw("saveCSS error",err, res);
      }else{
        future.return(res); 
      }
    });

    return future.wait();
  },

  SaveScreenshot : function(imageData,templateId,userId){
    
    if( !canUpdate(templateId,userId,this.userId) ){
      throw new Error("Error Cannot screenshot.");
      return;
    }

    var future = new Future();

    var fields = {screenshot:imageData,lastModifiedBy:userId,modified:new Date()};

    TemplateCollection.update({_id:templateId},{$set:fields},function(err,res){
      if(err||res===0){
        future.throw("SaveScreenshot error",err, res);
      }else{
        future.return(res); 
      }
    });

    return future.wait();
  },
  RenameTemplate : function(newName,templateId,userId){
    

    if( !canUpdate(templateId,userId,this.userId) ){
      throw new Error("Cannot rename.");
    }

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

  PublishTemplate : function(_published,templateId,userId){

    if( !canUpdate(templateId,userId,this.userId) ){
      throw new Error("Cannot publish.");
    }

    TemplateCollection.update({_id:templateId},{$set:{published:_published}},function(err,res){
      if(err||res===0){
        console.log("publish error",err, res);
      }else{
        //console.log("saveCSS OK!",res);
      }
    });
  }

});


/*
canUpdate
returns true if the template was created by anonymous
returns true if the userId == owner
returns false if the template owner is a logged in User and (template.owner !== userId)
*/
var canUpdate = function(templateId,userId,thisUserId){
  
  var template = TemplateCollection.findOne(templateId);
  
  // anonymous templates can be udpated or deleted by everyone
  if(template.owner === 'anonymous'){
    return true;                           
  }

  // double check the user sent their own id
  // templates with owners can only be updated by their owner
  if( (thisUserId===template.owner) && (userId.indexOf(thisUserId)!==-1) ){ 
    return true;                           
  }

  return false;

}
