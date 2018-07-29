//Head:

(function() {//closure

  var cs = CsCreate();

  var head_md = {};

  //"Inner" part:
  head_md.inner = {};

  //Init part:--------------------------------------------
  head_md.inner.init = {};

  //Will call for rebuilding imgs show
  // and pass img_arr:
  head_md.inner.init.img_show_fun = function(imgs_arr) {

    //Filter will by himself get imgs_arr:
    cs.say("filter.build");
  };

  head_md.inner.init.views = ["All images", "Favorites"];

  head_md.inner.init.img_cont_on_attrb =  "data-head-md-on";

  head_md.inner.init.get_imgs_arr = function(cb) {

    cs.say("img_set.get_imgs_set", function(ret_imgs_arr) {
      //Torn copy:
      head_md.inner.model.imgs_arr = JSON.parse(
        JSON.stringify( ret_imgs_arr )
      );

      cb();
    });
  };

  //Create in_favor property in all items in imgs_arr:
  head_md.inner.init.create_favor_prop = function() {
    head_md.inner.model.imgs_arr.forEach(function(img_arr_itm) {
      img_arr_itm.in_favor = false;
    });
  };

  //Spread favor flags on to the imgs array:
  head_md.inner.init.spread_favor_imgs = function(done_cb) {

    cs.say("ls_favorites.read", function(favor_arr) {

      if(favor_arr.lenght !== 0) {
        favor_arr.forEach(function(favor_arr_img) {
          if(favor_arr_img.hasOwnProperty("in_favor")) {
            var imgs_arr_indx = head_md.inner.controller.index_of_img_by_id(
              head_md.inner.model.imgs_arr,
              favor_arr_img
            );
            if(imgs_arr_indx !== -1) {
              head_md.inner.model.imgs_arr[imgs_arr_indx].in_favor = 
                favor_arr_img.in_favor;

              head_md.inner.model.favor_imgs_num++;
            }
          }
        });
      }

      done_cb();
    });
  };

  //Model:-------------------------------------------------------
  head_md.inner.model = {};

  //What view to show:
  head_md.inner.model.view_on = undefined;

  //Images array (it will also include "in favorites" flags):
  head_md.inner.model.imgs_arr = [];

  //Favorite images number:
  head_md.inner.model.favor_imgs_num = 0;

  //Controller:
  head_md.inner.controller = {};

  //Search index of "img" by ID in "search_arr":
  //-Will return -1 if not found.
  head_md.inner.controller.index_of_img_by_id = function(search_arr, img) {

    var ret_indx = -1;

    search_arr.forEach(function(sel_img, sel_img_indx) {
      if(sel_img.id === img.id) {
        ret_indx = sel_img_indx;
      }
    });

    return ret_indx;
  };

  //Get from imgs_arr only that imgs that is in favor:
  head_md.inner.controller.get_favor_part = function() {
    var ret_arr = [];

    if(head_md.inner.model.favor_imgs_num !== 0) {
      head_md.inner.model.imgs_arr.forEach(function(sel_img) {
        if(sel_img.in_favor === true){
          ret_arr.push(sel_img);
        }
      });
    }

    return ret_arr;
  };

  //Toggle images in favor:
  //-Accepts image data.
  head_md.inner.controller.toggle_img_in_favor = function(img_data) {

    var toggle_img_indx = head_md.inner.controller.index_of_img_by_id(
      head_md.inner.model.imgs_arr, img_data);


    if( toggle_img_indx !== -1) {
      if(head_md.inner.model.imgs_arr[toggle_img_indx].in_favor === true) {
        //Remove from favor:
        head_md.inner.model.imgs_arr[toggle_img_indx].in_favor = false;
        //Decrement favor imgs num:
        head_md.inner.model.favor_imgs_num--;
      } else {
        //Add to favor:
        head_md.inner.model.imgs_arr[toggle_img_indx].in_favor = true;
        //Increment favor imgs num:
        head_md.inner.model.favor_imgs_num++;
      }
    }

    //Push changed favor part to local storage:
    //console.log("LocalStorage.write");
    cs.say("ls_favorites.write", head_md.inner.controller.get_favor_part());

    //Changes in view:
    switch (head_md.inner.model.view_on) {
      case head_md.inner.init.views[0]://All images
        //Update header:
        head_md.inner.view.update_header();
        break;
      case head_md.inner.init.views[1]://Favorits
        //If we are in favorites and there no images in favor - go to all images:
        if(head_md.inner.model.favor_imgs_num === 0) {
          head_md.inner.controller.go_to_all();
        }
        break;
      default:
        break;
    }
  };

  head_md.inner.controller.go_to_all = function() {
    head_md.inner.model.view_on = head_md.inner.init.views[0];//All images
  
    head_md.inner.view.update_header();
    head_md.inner.view.build_img_show();
  };

  head_md.inner.controller.go_to_favorites = function() {
    head_md.inner.model.view_on = head_md.inner.init.views[1];//Favorites
  
    head_md.inner.view.update_header();
    head_md.inner.view.build_img_show();
  };

  //View:----------------------------------------------------
  head_md.inner.view = {};

  head_md.inner.view.update_header = function() {
    var on_elm = document.querySelector(".head_md__head__on");
    var go_a_elm = document.querySelector(".head_md__head__go a");

    switch (head_md.inner.model.view_on) {
      case head_md.inner.init.views[0]://All images
        on_elm.innerHTML = head_md.inner.init.views[0];
        if(head_md.inner.model.favor_imgs_num === 0) {
          go_a_elm.innerHTML = '';
        } else {
          go_a_elm.innerHTML = '<i class="fas fa-star"></i>';
        }
        break;
      case head_md.inner.init.views[1]://Favorits
        on_elm.innerHTML = head_md.inner.init.views[1];
        go_a_elm.innerHTML = '<i class="fas fa-arrow-left"></i>';
        break;
      default:
        break;
    }
  };

  head_md.inner.view.build_img_show = function() {

    var imgs_cont_elm = document.querySelector(".head_md__imgs_cont");

    switch (head_md.inner.model.view_on) {
      case head_md.inner.init.views[0]://All images
        imgs_cont_elm.setAttribute(
          head_md.inner.init.img_cont_on_attrb,
          "all"
        );
        head_md.inner.init.img_show_fun(
          head_md.inner.model.imgs_arr
        );
        break;
      case head_md.inner.init.views[1]://Favorits
        imgs_cont_elm.setAttribute(
          head_md.inner.init.img_cont_on_attrb,
          "favor"
        );
        head_md.inner.init.img_show_fun(
          head_md.inner.model.favor_imgs_arr
        );
        break;
      default:
        break;
    }
  };


  //"Outer" part:
  head_md.outer = {};

  head_md.outer.toggle_img_in_favor = function(img_data) {
    head_md.inner.controller.toggle_img_in_favor(img_data);
  };

  head_md.outer.get_imgs_arr = function(cb) {
    
    //Pass different sings in different views:
    if(head_md.inner.model.view_on === head_md.inner.init.views[0]/*All*/) {
      //Torn copy of all:
      cb(
        JSON.parse(
          JSON.stringify(
            head_md.inner.model.imgs_arr
          )
        )
      );
    } else if(head_md.inner.model.view_on === head_md.inner.init.views[1]/*Favor*/) {
      //Torn copy of favorites only:
      cb(
        JSON.parse(
          JSON.stringify(
            head_md.inner.controller.get_favor_part()
          )
        )
      );
    } else {
      //Pass all:
      cb(
        JSON.parse(
          JSON.stringify(
            head_md.inner.model.imgs_arr
          )
        )
      );
    }

  };

  //Some init part:------------------------------------
  //- Initialization:
  head_md.inner.init.init = function() {

    //Set starting view:
    head_md.inner.model.view_on = head_md.inner.init.views[0];
    //Get starting arrays of images:
    head_md.inner.init.get_imgs_arr(function() {
      //Create "in_favor" property:
      head_md.inner.init.create_favor_prop();
      //Spread favor images:
      head_md.inner.init.spread_favor_imgs(function() {

        //Adding onclick events:
        document.querySelector(".head_md__head__go a").onclick = function() {
          switch (head_md.inner.model.view_on) {
            case head_md.inner.init.views[0]://All images
              if(head_md.inner.model.favor_imgs_num !== 0) {
                head_md.inner.controller.go_to_favorites();
              }
              break;
            case head_md.inner.init.views[1]://Favorits
              head_md.inner.controller.go_to_all();
              break;
            default:
              break;
          }
        };

        //In the end - set reactions:
        cs.set_reac("head.toggle_img_in_favor", function(img_data) {
          head_md.outer.toggle_img_in_favor(img_data);
        });

        cs.set_reac("head.get_imgs_arr", function(cb) {
          head_md.outer.get_imgs_arr(cb);
        });

        head_md.inner.view.update_header();
        head_md.inner.view.build_img_show();

      });

    });
  
  };

  //Make init:
  head_md.inner.init.init();



})();//closure