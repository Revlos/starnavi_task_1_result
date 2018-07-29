//One image show:

(function() {//closure

  //Connections space:
  var cs = CsCreate();

  var one_img_show = {};

  //Inner:
  one_img_show.inner = {};

  //Model:
  one_img_show.inner.model = {};

  //Id of prev shownd image:
  one_img_show.inner.model.prev_img_id = -1;

  //To show img:
  one_img_show.inner.model.show = false;

  //What zoom show "in" or "out":
  one_img_show.inner.model.zoom = "out";

  //What img show. Its data:
  one_img_show.inner.model.img_data = {};

  //View:
  one_img_show.inner.view = {};

  //Apply show to view:
  one_img_show.inner.view.app_show_to_view = function() {
    document.querySelector(".one_img_show").
      setAttribute("data-show", one_img_show.inner.model.show);
  };

  //Apply zoom to view:
  one_img_show.inner.view.app_zoom_to_view = function() {
    document.querySelector(".one_img_show__img").
      setAttribute("data-zoom", one_img_show.inner.model.zoom);
  };

  //Apply img_data to view:
  one_img_show.inner.view.app_img_data_to_view = function() {
    var src_to_set = 'https://picsum.photos/' + 
    one_img_show.inner.model.img_data.width + '/' +
    one_img_show.inner.model.img_data.height + 
    '?image=' + one_img_show.inner.model.img_data.id;

    document.querySelector(".one_img_show__img").
    setAttribute("src", src_to_set);
  };


  //Outer:
  one_img_show.outer = {};

  one_img_show.outer.show_img = function(img_data) {

    //Torn copy:
    one_img_show.inner.model.img_data = JSON.parse(JSON.stringify(img_data));

    //Set src attr:
    //-Check if need to be changed:
    if(one_img_show.inner.model.prev_img_id !== 
    one_img_show.inner.model.img_data.id) {
      one_img_show.inner.view.app_img_data_to_view();
    }
    //Set new value:
    one_img_show.inner.model.prev_img_id = one_img_show.inner.model.img_data.id;

    //Set zoom:
    one_img_show.inner.model.zoom = "out";
    one_img_show.inner.view.app_zoom_to_view();

    //Set show:
    //Set zoom:
    one_img_show.inner.model.show = "true";
    one_img_show.inner.view.app_show_to_view();
  }

  //Init:
  one_img_show.inner.init = function() {

    //Add onclick events:
    //-Exit from imgs show:
    document.querySelector(".one_img_show").onclick = function() {
      one_img_show.inner.model.show = false;
      one_img_show.inner.model.zoom = "out";
      one_img_show.inner.view.app_show_to_view();
      one_img_show.inner.view.app_zoom_to_view();
    };
    //Zoom:
    document.querySelector(".one_img_show__img").onclick = function(e) {
      //Change zoom and apply mod to view:
      if(one_img_show.inner.model.zoom === "in") {
        one_img_show.inner.model.zoom = "out";
      } else {
        one_img_show.inner.model.zoom = "in";
      }
      
      one_img_show.inner.view.app_zoom_to_view();

      e.stopPropagation();
    };

    //Add connections:
    cs.set_reac("one_img_show.show_img", function(img_data) {
      one_img_show.outer.show_img(img_data);
    });
  };

  //Make init:
  one_img_show.inner.init();

})();//closure