if ((typeof MochaWeb === 'undefined')){
return;
}

MochaWeb.testOnly(function(){


  describe("Template Methods - Anonymous User - Client", function(){  

    var response;
    var name = "myname";
    var newTemplate;
    
    before(function(done){  

      Meteor.logout();

      Meteor.call('CreateNewTemplate',name,function(err,res){
        if(err){
          response = err;
          done();
        }else{
          response = res;
          Router.go("/"+response);
        }
      
      });

      setInterval(function() { 
        if(  CurrentTemplate.findOne({_id:response}) ){
          newTemplate = CurrentTemplate.findOne({_id:response});
          done();
        }
      }, 200);

    });

    describe("CreateNewTemplate",function(){
      it('owner is anonymous' , function(){
        chai.assert.equal(newTemplate.owner, 'anonymous');
      });

      it('should save the name' , function(){
        chai.assert.equal(newTemplate.name, name);
      });

      it("should contain default html", function(){
        chai.assert(newTemplate.html.indexOf("Today is : {{currentDate}}")!==-1);
      });

      it("should contain default css", function(){
        chai.assert.equal(newTemplate.css,MockCSS);
      });

       it("should contain default js", function(){
        chai.assert.equal(newTemplate.js,MockJS);
      });

      it("should contain default json", function(){
        chai.assert.equal(newTemplate.json,MockJSON);
      });
    });

    describe("Save template which is not owned by anonymous", function(){

      var response;
      var template;
      var origHTML;

      before(function(done){
        template = TemplateCollection.findOne( { owner:{$ne:'anonymous' }});
        origHTML = template.html;
        
        Meteor.call('SaveHTML','this html should not be saved',template._id,Meteor.userId(),function(err,res){
          if(err||res===0){
            response = err;
            done();
          }else{
            response = res;
            done();
          }
        });
      });

      it('should not update' , function(){
        chai.assert.equal(response.message,'Internal server error [500]');
        template = TemplateCollection.findOne( {_id:template._id});
        chai.assert.equal(template.html,origHTML);
      });

    });

  });
  

  describe("Template Methods - Logged In User - Client", function(){  

    var response;
    var name = "myname";
    var newTemplate;
    var userId;
    var origModified;
    var origCreated;
    
    before(function(done){  

      Meteor.logout();

      Meteor.loginWithPassword("userOne@example.com", "passOne", function(err) {
        
        if(err){
          done();
        }
        
        Meteor.call('CreateNewTemplate',name,function(error,res){
          if(err){
            response = error;
            done();
          }else{
            response = res;
            Router.go("/"+response);
          }
        });

      });

      setInterval(function() { 
        if(  CurrentTemplate.findOne({_id:response}) && Meteor.userId() ){
          newTemplate = CurrentTemplate.findOne({_id:response});
          userId = Meteor.userId();
          origModified = newTemplate.modified.getTime()-1;  // subtract 1 millisecond, sometimes the test runs so fast
          origCreated = newTemplate.created;                // that after updates, the modified ms is equal to original ms
          done();
        }
      }, 200);

    });

    describe("CreateNewTemplate",function(){

      it('owner is logged in user' , function(){
        chai.assert.equal(newTemplate.owner, userId);
      });

      it('should save the name' , function(){
        chai.assert.equal(newTemplate.name, name);
      });

      it("should contain default html", function(){
        chai.assert(newTemplate.html.indexOf("Today is : {{currentDate}}")!==-1);
      });

      it("should contain default css", function(){
        chai.assert.equal(newTemplate.css,MockCSS);
      });

       it("should contain default js", function(){
        chai.assert.equal(newTemplate.js,MockJS);
      });

      it("should contain default json", function(){
        chai.assert.equal(newTemplate.json,MockJSON);
      });
    });

    describe("Save HTML", function(){
      
      var htmlResponse;

      before(function(done){
        Meteor.call('SaveHTML','edited',newTemplate._id,Meteor.userId(),function(err,res){
          if(err){
            htmlResponse = err;
            done();
          }else{
            htmlResponse = res;
            done();
          }
        });
      });

      it('response should be 1' , function(){
        chai.assert.equal(htmlResponse,1);
      });

      it('should be able to save html' , function(){
        newTemplate = CurrentTemplate.findOne({_id:response}); // have to fetch it again, we don't publish changes
        chai.assert.equal(newTemplate.html,'edited');          // to the owner who made the last edit
      });
    });

    describe("Save JS", function(){
      
      var jsResponse;

      before(function(done){
        Meteor.call('SaveJS','edited javascript',newTemplate._id,Meteor.userId(),function(err,res){
          if(err){
            jsResponse = err;
            done();
          }else{
            jsResponse = res;
            done();
          }
        });
      });

      it('response should be 1' , function(){
        chai.assert.equal(jsResponse,1);
      });

      it('should be able to save js' , function(){
        newTemplate = CurrentTemplate.findOne({_id:response}); // have to fetch it again, we don't publish changes
        chai.assert.equal(newTemplate.js,'edited javascript');          // to the owner who made the last edit
      });

      it('should save lastModifiedBy' , function(){
        chai.assert.equal(newTemplate.lastModifiedBy,userId);
      });
      
      it('should change the modified date' , function(){
        chai.assert.notEqual(newTemplate.modified.getTime(),origModified);
      });
      
      it('should not update created field' , function(){
        chai.assert.equal(newTemplate.created.getTime(),origCreated.getTime());
      });
    });


    describe("Save JSON", function(){
      
      var jsonResponse;

      before(function(done){
        Meteor.call('SaveJSON','edited json',newTemplate._id,Meteor.userId(),function(err,res){
          if(err){
            jsonResponse = err;
            done();
          }else{
            jsonResponse = res;
            newTemplate = CurrentTemplate.findOne({_id:response});
            done();
          }
        });
      });

      it('response should be 1' , function(){
        chai.assert.equal(jsonResponse,1);
      });

      it('should be able to save' , function(){
        chai.assert.equal(newTemplate.json,'edited json');
      });
      
      it('should save lastModifiedBy' , function(){
        chai.assert.equal(newTemplate.lastModifiedBy,userId);
      });
      
      it('should change the modified date' , function(){
        chai.assert.notEqual(newTemplate.modified.getTime(),origModified);
      });
      
      it('should not update created field' , function(){
        chai.assert.equal(newTemplate.created.getTime(),origCreated.getTime());
      });

    });

    describe("Save CSS", function(){
      
      var cssResponse;

      before(function(done){
        Meteor.call('SaveCSS','edited css',newTemplate._id,Meteor.userId(),function(err,res){
          if(err){
            cssResponse = err;
            done();
          }else{
            cssResponse = res;
            done();
          }
        });
      });

      it('response should be 1' , function(){
        chai.assert.equal(cssResponse,1);
      });

      it('should be able to save css' , function(){
        newTemplate = CurrentTemplate.findOne({_id:response});
        chai.assert.equal(newTemplate.css,'edited css');
      });
      
      it('should save lastModifiedBy' , function(){
        chai.assert.equal(newTemplate.lastModifiedBy,userId);
      });
      
      it('should change the modified date' , function(){
        chai.assert.notEqual(newTemplate.modified.getTime(),origModified);
      });
      
      it('should not update created field' , function(){
        chai.assert.equal(newTemplate.created.getTime(),origCreated.getTime());
      });
    });

    describe("Save template which user does not own", function(){

      var response;
      var template;
      var origHTML;

      before(function(done){
        template = TemplateCollection.findOne( { owner:{$ne:Meteor.userId() }});
        origHTML = template.html;
        Meteor.call('SaveHTML','edited html should not be saved',template._id,Meteor.userId(),function(err,res){
          if(err||res===0){
            response = err;
            done();
          }else{
            response = res;
            done();
          }
        });
      });

      it('should not update' , function(){
        chai.assert.equal(response.message,'Internal server error [500]');
        template = TemplateCollection.findOne( {_id:template._id});
        chai.assert.equal(template.html,origHTML);
      });

    });

  });// end Template Methods - Logged in user





});
    













