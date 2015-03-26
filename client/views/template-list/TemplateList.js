/*
TemplateList
Lists all Templates in the database with summary information.
*/

Template.TemplateList.created = function (){
  
  // pages is an Array of date values which are used to query the paging data
  this.numPages = new ReactiveVar;
  this.numPages.set([]);

  this.numTemplates = new ReactiveVar;
  this.numTemplates.set(0);
}

Template.TemplateList.rendered = function(){

  var self = this;        
  var router = Router.current();
  var amount = router.params.amount;
  if(amount===0){
    amount=1;
  }
  var self = this;
  Meteor.call("GetNumberOfPublishedTemplates",function(err,res){
    if(!err){
      self.numTemplates.set(res);
      if(res>0){
        var pages = [];
        var num = res/amount;
        var count = 0;
        while(count<num){
          pages.push({index:count,amount:amount});
          count++;
        }
        self.numPages.set(pages);
      }
    }
  });
  $('#pageAmount').val(amount);
}

Template.TemplateList.events({
  'change #pageAmount' : function(e){
    console.log("changed : " , e );
    var router = Router.current();
    var amount = e.currentTarget.value;
    Router.go('/browse/0/'+amount)
  }
})


Template.TemplateList.helpers({

  getTopRated : function(){
    return TemplateCollection.find({},{sort:{likes:-1}});
  },
  getLatest : function(){
    return RecentTemplates.find({},{sort:{created:-1}});
  },
  getNumTemplates : function(){
    return Template.instance().numTemplates.get();
  },
  getPages : function(){
    return Template.instance().numPages.get();
  },
  getSelectedPage : function(page){
    var router = Router.current();
    if(router && router.params && router.params.index){
      console.log("am i selected ? " , router.params.index,page);
      if(router.params.index==page){
        return "selected-page";
      }
    }
  }
})