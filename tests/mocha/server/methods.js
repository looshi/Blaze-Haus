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
        modified: new Date(), 
        lastModifiedBy: 'System',
        name : 'myname',
        owner:'System'
      }
    var edits = {
        created: new Date(),
        css: 'emycss',
        dataContext: 'emydata', 
        html: 'emyhtml',
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
    it('should be able to save css' , function(){
      chai.assert.equal(savedTemplate.css,edits.css);
    });
    it('should be able to save name' , function(){
      chai.assert.equal(savedTemplate.name,edits.name);
    });
    it('should be able to save lastModifiedBy' , function(){
      chai.assert.equal(savedTemplate.lastModifiedBy,edits.lastModifiedBy);
    });
    it('should be able to save modified' , function(){
      chai.assert.notEqual(savedTemplate.modified,edits.modified);
    });
    it('should not update created field' , function(){
      chai.assert.equal(savedTemplate.created.toString(),createdDate.toString());
    });

  });

  
});



