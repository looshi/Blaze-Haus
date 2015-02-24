HTMLCollection = new Meteor.Collection('HTMLCollection');
StylesCollection = new Meteor.Collection('StylesCollection');
PeopleCollection = new Meteor.Collection('PeopleCollection');

if (Meteor.isClient){

var userId = Random.id();  // mimic we have a logged in user
var lastHtmlEditorId;      // Last user that edited HTML 
var lastCssEditorId;       // Last user that edited CSS
var cssEditor;             // Code Mirror Instance
var htmlEditor;            // Code Mirror Instance
var peopleData;            // PeopleCollection cursor
var parent;                // Dom element which Template renders into

Meteor.startup(function(){

  // fake a user id
  Meteor.call('setDefaults',userId);

  // data we're going to provide to the template
  peopleData = PeopleCollection.find();

  // parent Dom element the Template is rendered into
  parent = document.getElementById('htmlOutput');

});

  StylesCollection.find().observeChanges({
    added: function(id, doc) {
      var textArea = document.getElementById('cmCss');
      cssEditor = CodeMirror.fromTextArea(textArea);
      cssEditor.getDoc().setValue(doc.css);
      cssEditor.getDoc().on("change",saveCSS);
      renderCSS(doc.css);
    },
    changed: function(id,doc){

      if(doc.css){
        renderCSS(doc.css);
      }
      
      if(doc.lastModifiedBy){
        lastCssEditorId = doc.lastModifiedBy;
      }

      if(lastCssEditorId!==userId){
        console.log("Someone else made an edit to the css!");
        showAlert("css");
        cssEditor.getDoc().off("change",saveCSS);  // turn off auto save temporarily
        cssEditor.getDoc().setValue(doc.css);
        cssEditor.getDoc().on("change",saveCSS);
      }
    }
  });

  HTMLCollection.find().observeChanges({
    added: function(id, doc) {
      
      var textArea = document.getElementById('cmHtml');
      htmlEditor = CodeMirror.fromTextArea(textArea);
      htmlEditor.getDoc().setValue(doc.html);
      htmlEditor.getDoc().on("change",saveHTML);
      renderHTML(doc.html,peopleData,parent);
    },
    changed: function(id,doc){

      if(doc.html){
        renderHTML(doc.html,peopleData,parent); 
      }

      if(doc.lastModifiedBy){
        lastHtmlEditorId = doc.lastModifiedBy;  // only update my editor if someone else made the change
      }

      if(lastHtmlEditorId!==userId){
        console.log("Someone else made an edit to the html!");
        showAlert("html");
        htmlEditor.getDoc().off("change",saveHTML);  // turn off auto save temporarily
        htmlEditor.getDoc().setValue(doc.html);
        htmlEditor.getDoc().on("change",saveHTML);
      }
    }
  });


  Template.MainTemplate.events({
    'click .restoreDefaults' : function(e){
        e.preventDefault();
        Meteor.call('restoreDefaults',userId);
    }
  })


  function saveCSS(codeMirror){
    newCSS = codeMirror.getValue();
    var id = StylesCollection.findOne({name:'myStyle'})._id;
    StylesCollection.update(id,{$set:{css:newCSS,lastModifiedBy:userId}});
  }

  // apply the css string to the CSSOM
  // http://stackoverflow.com/questions/524696/how-to-create-a-style-tag-with-javascript
  function renderCSS(newCSS){

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

  function saveHTML(codeMirror){

    newHTML = codeMirror.getValue();
    var id = HTMLCollection.findOne({name:'myHtml'})._id;
    HTMLCollection.update(id,{$set:{html:newHTML,lastModifiedBy:userId}});
  }

  // renders html with a data context into the parent Dom object
  // you can use spacebars {{ }} template tags in newHTML
  
  function renderHTML(newHTML,dataContext,parent){

    clearError();
    // going to 'try' it all, because we're auto-saving on each edit so
    // the malformed Blaze Template syntax will throw a lot of errors
    try{
      // create the 'HTMLjs' which is used internally by the template
      // https://meteorhacks.com/how-blaze-works.html
      var htmlJS = SpacebarsCompiler.compile(newHTML);
      var evaled = eval(htmlJS);
      var view = Blaze.With(dataContext,evaled);

      // clear the output and re-render it
      parent.innerHTML = "";
      Blaze.render(view,parent);
      
    }catch(e){ 
      displaySyntaxError(e);   // display the error to the user
    }
  }

  // some helper functions 
  function displaySyntaxError(e){
    var errorPanel = document.getElementById('errorPanel');
    errorPanel.innerHTML = ''+e;
  }
  
  function clearError(e){
    var errorPanel = document.getElementById('errorPanel');
    errorPanel.innerHTML = '';
  }

  function showAlert(file){
    var alert = document.getElementById('alertPanel');
    alert.style.display = "block";
    alert.innerHTML = "Someone else is editing the " + file + " now!"
    hideAlert();
  }
  var hideAlert = _.debounce(function(){
    document.getElementById('alertPanel').style.display = 'none';
  },3000);
  
}

if (Meteor.isServer){

  Meteor.methods({

    setDefaults : function(userId){
    
      if(!StylesCollection.findOne({name:'myStyle'})){
        StylesCollection.insert({name:'myStyle',css:MockCSS,lastModifiedBy:userId});
      }
      
      if(!HTMLCollection.findOne({name:'myHtml'})){
        HTMLCollection.insert({name:'myHtml',html:MockHTML,lastModifiedBy:userId});
      }

      if(!PeopleCollection.findOne()){
        for(var i=0;i<MockPeople.length;i++){
          PeopleCollection.insert(MockPeople[i]);
        }
      }
    },

    restoreDefaults : function(userId){

      HTMLCollection.update({name:'myHtml'},{$set:{html:MockHTML,lastModifiedBy:'adminId'}});
      
      StylesCollection.update({name:'myStyle'},{$set:{css:MockCSS,lastModifiedBy:'adminId'}});
      
      PeopleCollection.remove({});
      for(var i=0;i<MockPeople.length;i++){
        PeopleCollection.insert(MockPeople[i]);
      }
    }
  })

}
