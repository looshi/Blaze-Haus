if ((typeof MochaWeb === 'undefined')){
  return;
}
  /*
  TODO ask if it's possible to stop this query
  before(function(done){
    var query = PeopleCollection.find().observeChanges({
      added: function (id, fields) {
        query.stop();
        done();
      }
    });
  });
  */

MochaWeb.testOnly(function(){

  describe.skip("Client Subscriptions", function(){

    describe("Default HTML Data", function(){

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

      it("should be available to the client", function(){
        chai.assert.equal(defaultHTML.html,MockHTML);
      });
    });

    describe("Default CSS Data", function(){

      var defaultCSS;

      before(function(done){
        Meteor.autorun(function(){
          var css = StylesCollection.findOne({template:"DefaultTemplate"});
          if (css){
            defaultCSS = css;
            done();
          }
        });
      });

      it("should be available to the client", function(){
        chai.assert.equal(defaultCSS.css,MockCSS);
      });
    });

    describe("Default Sample Data Set", function(){

      var defaultSampleData;

      before(function(done){
        Meteor.autorun(function(){
          var data = PeopleCollection.find().fetch();
          if (data){
            defaultSampleData = data;
            done();
          }
        });
      });

      it("should be available to the client and in tact", function(){
        chai.assert.equal(defaultSampleData.length,39);
        for(var i=0;i<defaultSampleData.length;i++){

          chai.assert(defaultSampleData[i].country.length>3,'every country has a value'+defaultSampleData[i].country);
          chai.assert(defaultSampleData[i].date.length>3,'every date has a value'+defaultSampleData[i].date);
          chai.assert(defaultSampleData[i].city.length>3,'every city has a value'+defaultSampleData[i].city);
          chai.assert(defaultSampleData[i].company.length>3,'every company has a value'+defaultSampleData[i].company);
          chai.assert(defaultSampleData[i].name.length>2,'every name has a value '+defaultSampleData[i].name);
          chai.assert(defaultSampleData[i].color.length>3,'every color has a value'+defaultSampleData[i].color);

          chai.assert.isString(defaultSampleData[i].country,'every country is a string'+defaultSampleData[i].country);
          chai.assert.isString(defaultSampleData[i].date,'every date is a string'+defaultSampleData[i].date);
          chai.assert.isString(defaultSampleData[i].city,'every city is a string'+defaultSampleData[i].city);
          chai.assert.isString(defaultSampleData[i].company,'every company is a string'+defaultSampleData[i].company);
          chai.assert.isString(defaultSampleData[i].name,'every name is a string'+defaultSampleData[i].name);
          chai.assert.isString(defaultSampleData[i].color,'every color is a string'+defaultSampleData[i].color);
        }
      });
    });


  });//--- end Client Subscriptions

});//--- end Test