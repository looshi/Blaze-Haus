
var userId = Random.id();  // mimic we have a logged in user
var lastHtmlEditorId;      // Last user that edited HTML 
var lastCssEditorId;       // Last user that edited CSS
var cssEditor;             // Code Mirror Instance
var htmlEditor;            // Code Mirror Instance
var peopleData;            // PeopleCollection cursor
var parent;                // Dom element which Template renders into


Template.Editor.rendered = function(){
  
  
  peopleData = PeopleCollection.find();
  parent = document.getElementById('htmlOutput');

  console.log("User id " , userId );

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

      if(lastCssEditorId!==userId && doc.css){
        showAlert("css",lastCssEditorId);
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
      htmlEditor.getDoc().on("change",saveHTML,'dave');
      renderHTML(doc.html,peopleData,parent);
    },
    changed: function(id,doc){

      if(doc.html){
        renderHTML(doc.html,peopleData,parent); 
      }

      if(doc.lastModifiedBy){
        lastHtmlEditorId = doc.lastModifiedBy;  // only update my editor if someone else made the change
      }

      if(lastHtmlEditorId!==userId && doc.html){
        showAlert("html",lastHtmlEditorId);
        htmlEditor.getDoc().off("change",saveHTML,'dave');  // turn off auto save temporarily
        htmlEditor.getDoc().setValue(doc.html);
        htmlEditor.getDoc().on("change",saveHTML,'dave');
      }
    }
  });
}

 
Template.Editor.events({
  'click .restoreDefaults' : function(e){
    e.preventDefault();
    Meteor.call('restoreDefaults');
  }
});


function saveCSS(_codeMirror){
  clearCssError();
  var newCSS = _codeMirror.getValue();
  if(newCSS && newCSS.length>800){
    displayCssError('Too long, must be less than 800 chars.','css'); 
    return;
  }
  if(newCSS){
    Meteor.call('saveCSS',newCSS,userId);
  }
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

function saveHTML(_codeMirror){
  console.log("USER ID " , userId );
  var newHTML = _codeMirror.getValue();
  Meteor.call('saveHTML',newHTML,userId);
}

// renders html with a data context into the parent Dom object
// you can use spacebars {{ }} template tags in newHTML

function renderHTML(newHTML,dataContext,parent){

  clearHtmlError();
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
    displayHtmlError(e);   // display the error to the user
  }
}

// some helper functions 
function displayHtmlError(error,type){
  var el = document.getElementById('htmlError');
  el.className = "";
  el.innerHTML = ''+error;
}
function clearHtmlError(e){
  var el = document.getElementById('htmlError');
  el.className = 'ok';
  el.innerHTML = 'ok';
}
function displayCssError(error,type){
  var el = document.getElementById('cssError');
  el.className = "";
  el.innerHTML = ''+error;
}
function clearCssError(e){
  var el = document.getElementById('cssError');
  el.className = 'ok';
  el.innerHTML = 'ok';
}

function showAlert(file,user){
  var alert = document.getElementById('alertPanel');
  alert.style.display = "block";
  alert.innerHTML = "User " + user +" is editing the " + file + " now!"
  hideAlert();
}
var hideAlert = _.debounce(function(){
  document.getElementById('alertPanel').style.display = 'none';
},3000);
  



