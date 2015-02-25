if ((typeof MochaWeb === 'undefined')){
  return;
}

MochaWeb.testOnly(function(){



  describe("Client Subscriptions", function(){
    
    /*
    TODO ask if it's possible to stop this query
    before(function(done){
      query = PeopleCollection.find().observeChanges({
        added: function (id, fields) {
          query.stop();
          done();
        }
      });
    });
    */
    var defaultHTML;

    before(function(done){
      Meteor.autorun(function(){
        var html = HTMLCollection.findOne({template:"DefaultTemplate"});
        if (html){
          defaultHTML = html;
          done();
        }
      });
    });
    
    it("should have default html data", function(){
      chai.assert.equal(defaultHTML.html,MockHTML);
    });



  });



});