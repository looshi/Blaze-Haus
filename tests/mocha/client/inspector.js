if ((typeof MochaWeb === 'undefined')){
  return;
}
MochaWeb.testOnly(function(){

describe("Inspector", function(){

  describe("should set data in each codemirror instance", function(){

    before(function(done){

      var defaultTemplate;

      Meteor.autorun(function(){
        var data = TemplateCollection.findOne({name:"Default Template"});
        if (data){
          defaultTemplate = data;
          done();
        }
      });

    });

    it("should set data in the html editor",function(){
      
    });

    it("should set data in the css editor",function(){

    });


  });


});

});