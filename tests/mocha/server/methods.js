if ((typeof MochaWeb === 'undefined')){
return;
}

MochaWeb.testOnly(function(){


  describe("CreateTemplate", function(){  

    var response;
    var name = "myname";
    var newTemplate;
    
    before(function(done){  
      Meteor.call('CreateNewTemplate',name,function(err,res){
        if(err){
          response = err;
          done();
        }else{
          response = res;
          newTemplate = TemplateCollection.findOne({_id:response});
          done();
        }
      });
    });

    it('should save the name' , function(){
      chai.assert.equal(newTemplate.name, name);
    });

    it("should contain default html", function(){
      chai.assert.equal(newTemplate.html,MockHTML);
    });

    it("should contain default css", function(){
      chai.assert.equal(newTemplate.css,MockCSS);
    });

     it("should contain default js", function(){
      chai.assert.equal(newTemplate.js,MockJS);
    });

  });
  
  describe("SaveTemplate", function(){

    var response;
    var name = "myname";
    var savedTemplate;
    var createdDate = new Date(0);

    var options = {
        created: createdDate,
        css: 'mycss',
        dataContext: 'mydata', 
        html: 'myhtml',
        js: 'myjs',
        modified: new Date(), 
        lastModifiedBy: 'System',
        likes:2,
        name : 'myname',
        owner:'System'
      }
    var edits = {
        created: new Date(),
        css: 'emycss',
        dataContext: 'emydata', 
        html: 'emyhtml',
        js: 'emyjs',
        likes:3,
        modified: new Date(), 
        lastModifiedBy: 'eSystem',
        name : 'emyname',
        owner:'eSystem'
    }
    before(function(done){  

      var id = TemplateCollection.insert(options);
     
      Meteor.call('SaveTemplate',id,edits,function(err,res){
        if(err){
          response = err;
          done();
        }else{
          response = res;
          savedTemplate = TemplateCollection.findOne(id);
          done();
        }
      });
    });

    it('response should be 1' , function(){
      chai.assert.equal(response,1);
    });
    it('should be able to save html' , function(){
      chai.assert.equal(savedTemplate.html,edits.html);
    });
    it('should be able to save js' , function(){
      chai.assert.equal(savedTemplate.js,edits.js);
    });
    it('should be able to save css' , function(){
      chai.assert.equal(savedTemplate.css,edits.css);
    });
    it('should be able to save name' , function(){
      chai.assert.equal(savedTemplate.name,edits.name);
    });
    it('should be able to save lastModifiedBy' , function(){
      chai.assert.equal(savedTemplate.lastModifiedBy,edits.lastModifiedBy);
    });
    it('should be able to save likes' , function(){
      chai.assert.equal(savedTemplate.likes,edits.likes);
    });
    it('should be able to save modified' , function(){
      chai.assert.notEqual(savedTemplate.modified,edits.modified);
    });
    it('should not update created field' , function(){
      chai.assert.equal(savedTemplate.created.toString(),createdDate.toString());
    });

  });
  

  describe("DuplicateTemplate", function(){

    var originalTemplate;
    var duplicateTemplate;
    var response;
    var oldCount;

    before(function(done){  

      originalTemplate = TemplateCollection.findOne();
      oldCount = TemplateCollection.find().count();
     
      Meteor.call('DuplicateTemplate',originalTemplate._id,"duplicate",function(err,res){
        if(err){
          response = err;
          done();
        }else{
          response = res;
          duplicateTemplate = TemplateCollection.findOne(res);
          done();
        }
      });
    });

    it("should respond with _id string" , function(){
      chai.assert.isString(response);
    });

    it("should create template with identical values" , function(){
      
      for(var k in originalTemplate){
        if(k!=="_id"&&k!=="modified"&&k!=="created"&&k!=="name"){
          chai.assert.equal( duplicateTemplate[k] , originalTemplate[k] );
        }     
      }
    });

    it("should set modified and created to about now" , function(){
      var now = new Date().getTime()-10000;   // ten seconds ago
      chai.assert(duplicateTemplate.created>now); 
      chai.assert(duplicateTemplate.modified>now);
      
    });

    it("should increase the Template collection count by 1" , function(){
      var newCount = TemplateCollection.find().count();
      chai.assert.equal(newCount,oldCount+1);
    });

  });


  describe("DeleteTemplate", function(){

    var deletedTemplate;

    var options = {
        created: new Date(),
        css: 'mycss',
        dataContext: 'mydata', 
        html: 'myhtml',
        js: 'myjs',
        likes:0,
        modified: new Date(), 
        lastModifiedBy: 'System',
        name : 'DeleteMe',
        owner:'System'
      }

    before(function(done){  

      var id = TemplateCollection.insert(options);
     
      Meteor.call('DeleteTemplate',id,function(err,res){
        if(err){
          response = err;
          done();
        }else{
          response = res;
          deletedTemplate = TemplateCollection.findOne(id);
          done();
        }
      });
    });

    it("should respond with 1" , function(){
      chai.assert.equal(1,response);
    });

    it("should delete the template" , function(){
      chai.assert.equal(null,deletedTemplate);
    });

  });
  
});



