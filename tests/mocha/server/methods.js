if ((typeof MochaWeb === 'undefined')){
return;
}

MochaWeb.testOnly(function(){


  describe("CreateNewTemplate - Server", function(){  

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
  

  describe("DuplicateTemplate  - Server", function(){

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
        if(k!=="_id"&&k!=="modified"&&k!=="created"&&k!=="name"&&k!=="owner"){
          chai.assert.equal( duplicateTemplate[k] , originalTemplate[k] );
        }     
      }
    });

    it("should set owner to anonymous since user not logged in" , function(){
      chai.assert(duplicateTemplate.owner==='anonymous'); 
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


  describe("Delete Anonymous Template - Server", function(){

    var deletedTemplate;

    var options = {
        created: new Date(),
        css: 'mycss',
        dataContext: 'mydata', 
        html: 'myhtml',
        js: 'myjs',
        json : "myjson",
        likes:0,
        modified: new Date(), 
        lastModifiedBy: 'System',
        name : 'DeleteMe',
        owner:'anonymous'
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

