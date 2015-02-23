

Styles = new Meteor.Collection('Styles');
Styles.allow({
  insert: function () {
    return true;
  },
  remove: function (){
    return true;    
  },
  update: function() {
     return true;    
  }
});


if (Meteor.isClient){

  Meteor.subscribe('Styles');
  var loaded = false;

  Styles.find().observeChanges({
    added: function(id, doc) {
      document.getElementById('cssEditor').innerHTML = doc.css;
      applyCSS(doc.css);
    }
  });

  Template.MainTemplate.events({
    'input #cssEditor' : function(e){
      var css = e.target.innerHTML;
      applyCSS(css);
      var id = Styles.findOne({name:'myStyle'})._id;
      Styles.update(id,{$set:{css:css}});
    }
  });

  // this is from : http://stackoverflow.com/questions/524696/how-to-create-a-style-tag-with-javascript
  function applyCSS(newCSS){
    newCSS = newCSS.split('<br>').join("");
    console.log("new css " , newCSS );
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    if (style.styleSheet){
      style.styleSheet.cssText = newCSS;
    } else {
      style.appendChild(document.createTextNode(newCSS));
    }
    head.appendChild(style);
  }

}

if (Meteor.isServer){

  Meteor.startup(function () {

    var myCSS = "body{background-color:#ff9900;}"

    if(!Styles.findOne({name:'myStyle'})){
      Styles.insert({name:'myStyle',css:myCSS});
    }

  });

}
