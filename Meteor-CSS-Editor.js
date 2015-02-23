
Styles = new Meteor.Collection('Styles');

if (Meteor.isClient){

  Meteor.subscribe('Styles');

  // get the styles only once, doesn't need to be reactive in this case
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

  // apply the css string to the CSSOM
  // this is from : http://stackoverflow.com/questions/524696/how-to-create-a-style-tag-with-javascript
  function applyCSS(newCSS){
    newCSS = newCSS.split('<br>').join("");
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
  // add a style if none exists yet
  Meteor.startup(function () {
    var myCSS = "body{background-color:#ff9900;}"
    if(!Styles.findOne({name:'myStyle'})){
      Styles.insert({name:'myStyle',css:myCSS});
    }
  });

}
