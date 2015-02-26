if ((typeof MochaWeb === 'undefined')){
  return;
}

MochaWeb.testOnly(function(){

  describe.skip("Template Inspector", function(){

    describe("Editing HTML", function(){

      var defaultHTML;
      var dataContext;
      var templateInspector;

      before(function(done){
        Meteor.autorun(function(){
          var html = HTMLCollection.findOne({template:"DefaultTemplate"});
          if (html){
            defaultHTML = html;
            done();
          }
        });

        templateInspector = new TemplateInspector(dataContext);

      });

      it("should load HTML data", function(){
        chai.assert.equal(templateInspector.getHTML(),defaultHTML);
      });
    });






  });//--- end Template Inspector

});//--- end Test