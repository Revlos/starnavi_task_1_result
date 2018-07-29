//Get images set:
//-! For now it is assumed, that will be made only one request
// till response came.
//-! For now only last respCb will be processed.


(function() {//closure

  var imgs_set = {};

  imgs_set.inner = {};

  //Reconnection started:
  imgs_set.inner.startOfRecon = false;

  //imgs_set.inner.respArr = [];

  //Cb to run and pass response:
  imgs_set.inner.respCb = undefined;

  imgs_set.inner.httpRequest = undefined;

  imgs_set.inner.processTheResponse = function() {
    
    if (imgs_set.inner.httpRequest.readyState === XMLHttpRequest.DONE) {
      if (imgs_set.inner.httpRequest.status === 200) {

        //Recursive reconnection stops here:
        imgs_set.inner.startOfRecon = false;

        if(imgs_set.inner.respCb !== undefined) {
          imgs_set.inner.respCb(
            JSON.parse( imgs_set.inner.httpRequest.responseText )
          );
        }

      } else {

        if(!imgs_set.inner.startOfRecon) {
          alert('There was a problem with the request for images.' + 
            ' Automatical process to cennect was started.');
        }

        //Try again and again, until will be good response:
        //-Three seconds delay:
        window.setTimeout( imgs_set.inner.makeRequest, 2000);
        imgs_set.inner.startOfRecon = true;
      }
    }
  };

  imgs_set.inner.makeRequest = function() {

    imgs_set.inner.httpRequest = new XMLHttpRequest();

    if (!imgs_set.inner.httpRequest) {
      alert('Cannot create an XMLHTTP instance');

      //Return [];
      imgs_set.inner.respCb([]);

      return false;
    }

    imgs_set.inner.httpRequest.onreadystatechange = imgs_set.inner.processTheResponse;
    imgs_set.inner.httpRequest.open('GET', 'https://picsum.photos/list');
    imgs_set.inner.httpRequest.send();
  };

  //"Outer" interface:
  imgs_set.outer = {};

  imgs_set.outer.getImagesSet = function(cb) {
    imgs_set.inner.respCb = cb;

    imgs_set.inner.makeRequest();
  };

  //Set connections:
  cs = CsCreate();

  cs.set_reac("img_set.get_imgs_set", imgs_set.outer.getImagesSet);

})();//closure

/*Tests:
var test_1 = function(arr) {
  console.log(arr[1]);
};

CsCreate().say("img_set.get_imgs_set", test_1);
*/