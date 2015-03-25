Template.TemplateListItem.helpers({

  screenshot : function(){
    if(this && this.screenshot){
      var screenshot = pako.inflate(this.screenshot);
      return String.fromCharCode.apply(null, new Uint16Array(screenshot));
    }
  }

});