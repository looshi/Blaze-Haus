Template.ScreenshotButton.events({

  'click #screenshotButton' : function(){

    var self = this;

    html2canvas($('#htmlOutput'), {
        onrendered: function(canvas) {

          var max_size=100;
          // scale down cropped image if larger than max_size
          var canvasWidth = canvas.width;
          var canvasHeight = canvas.height;
          if ( canvasWidth > canvasHeight ) {
            if (canvasWidth > max_size) {
                canvasHeight *= max_size / canvasWidth;
                canvasWidth = max_size;
            }
          } else {
            if (canvasHeight > max_size) {
                canvasWidth *= max_size / canvasWidth;
                canvasHeight = max_size;
            }
          }
          
          //draw scaled down cropped image 
          var smallCanvas = document.createElement('canvas');
          smallCanvas.width = canvasWidth;
          smallCanvas.height = canvasHeight;
          smallCanvas.getContext('2d').drawImage(canvas,0,0,canvasWidth,canvasHeight);
          var imageData =  pako.deflate(smallCanvas.toDataURL());

          var userId;
          if(Meteor.userId()){
            userId = Meteor.userId();
          }else{
            userId = Session.get('AnonymousUserId');
          }
          Session.set('UserEditMessage','Saving screenshot...');
          Meteor.call('SaveScreenshot',imageData,self._id,userId,function(err,res){
            if(err){
              console.warn("save screenshot fail",err);
              Session.set('UserEditMessage','Error saving screenshot.');
            }else{
              Session.set('UserEditMessage','All changes saved.');
            }
          });

        },
      });


  }


})