//Images panel:

(function() {

  var cs = CsCreate();

  var img_panel = {};

  //Inner:
  img_panel.inner = {};

  //Init things:
  img_panel.inner.init = {};

  img_panel.inner.init.img = {};
  img_panel.inner.init.img.max_on_page = 20;

  img_panel.inner.init.pag = {};
  img_panel.inner.init.pag.max_in_row = 5;




  //Model:
  img_panel.inner.model = {};

  //Images:
  img_panel.inner.model.img = {};
  //All images:
  img_panel.inner.model.img.imgs_arr = [];
  img_panel.inner.model.img.imgs_num = 0;
  //Array of imgs to show in select page:
  img_panel.inner.model.img.show_arr = [];

  //Pagination:
  img_panel.inner.model.pag = {};
  img_panel.inner.model.pag.max_num = undefined;
  img_panel.inner.model.pag.arr_all = [];
  //This is number of selected item in the "img_panel.model.pag_arr_all".
  img_panel.inner.model.pag.sel = 0;
  //Part of pag to show:
  img_panel.inner.model.pag.show_arr = [];


  //View:
  img_panel.inner.view = {};

  //!!! Add showing favor star.
  //!!! Make without removing elements:
  img_panel.inner.view.show_img_arr = function() {

    //!!! Add checking for various cases.
    var ret_str = "";

    img_panel.inner.model.img.show_arr.forEach(function(img) {
      //Img container:
      ret_str += '<div class="img_panel__imgs__img_cont" data-img-star-on="' +
        img.in_favor + '">';
      //Img a:
      ret_str += '<a href="javascript:;" class="img_panel__imgs__img_a" data-img-id="' + 
        img.id + '">';
      //Src part:
      ret_str += '<img src="https://picsum.photos/200?image=' + img.id + '">';
      //Img /a:
      ret_str +='</a>';
      //Img star:
      ret_str +='<a class="img_panel__imgs__star" href="javascript:;"' + 
        'data-img-id="' + img.id +'" data-img-star-on="' + img.in_favor + '">';
      ret_str += '<i class="fas fa-star"></i></a>';
      //Img /cont:
      ret_str +='</div>';
    });

    document.querySelector(".img_panel__imgs").innerHTML = ret_str;
    
    //Adding onclick events.
    //-Imgs a:
    var img_a_all = document.querySelectorAll(".img_panel__imgs__img_a");
    img_a_all.forEach(function(img_a){
      img_a.onclick = function(e) {

        var img_id = Number.parseInt(
          e.currentTarget.getAttribute("data-img-id"),
          10
        );
        
        cs.say("one_img_show.show_img", img_panel.inner.controller.get_img_data_by_id(img_id));

        e.stopPropagation();
      };
    });
    //-Imgs star:
    var img_star_all = document.querySelectorAll(".img_panel__imgs__star");
    img_star_all.forEach(function(img_star){
      img_star.onclick = function(e) {

        var img_id = Number.parseInt(
          e.currentTarget.getAttribute("data-img-id"),
          10
        );

        //Toggle favor:
        //-Change models:
        img_panel.inner.controller.toggle_imgs_favor(img_id);
        //-Change star in view:
        if(e.currentTarget.getAttribute("data-img-star-on") === "true") {
          e.currentTarget.setAttribute("data-img-star-on", "false");
          //Parent:
          e.currentTarget.parentElement.setAttribute("data-img-star-on", "false");
        } else {
          e.currentTarget.setAttribute("data-img-star-on", "true");
          //Parent:
          e.currentTarget.parentElement.setAttribute("data-img-star-on", "true");
        }
        
        //Stop propagation to imgs container:
        e.stopPropagation();
      };
    });
  };

  img_panel.inner.view.show_nav_num = function() {

    var html_str = "";
  
    img_panel.inner.model.pag.show_arr.forEach(function(numb){
  
      //Selected pag number:
      if(numb === img_panel.inner.model.pag.arr_all[
        img_panel.inner.model.pag.sel
      ]) {
        html_str += '<li><a href="javascript:;"' + 
        ' class="img_panel__nav__num__item img_panel__nav__num__item--selected"' + 
        ' data-pag-num="' + numb + '">' + numb + '</a></li>';
      } else {
        //Other:
        html_str += '<li><a href="javascript:;" class="img_panel__nav__num__item" data-pag-num="'
        + numb + '">' + numb + '</a></li>';
      }
    });
  
    document.querySelector(".img_panel__nav__num").innerHTML = html_str;
  
    //Adding onclick events.
    var pag_elements = document.querySelectorAll(".img_panel__nav__num__item");
    pag_elements.forEach(function(pag_elm){
      pag_elm.onclick = function(e) {
        var pag_num = e.currentTarget.getAttribute("data-pag-num");
        img_panel.inner.controller.pag_clicked(pag_num);
      };
    });
  };


  //Controller:
  img_panel.inner.controller = {};

  //Build:
  img_panel.inner.controller.build = {};

  img_panel.inner.controller.build.set_imgs_num = function() {

    img_panel.inner.model.img.imgs_num = img_panel.inner.model.img.imgs_arr.length;
  };

  img_panel.inner.controller.build.set_pag_max_num = function() {

    img_panel.inner.model.pag.max_num = 
      Math.ceil(
        img_panel.inner.model.img.imgs_num/img_panel.inner.init.img.max_on_page
      );
  };

  img_panel.inner.controller.build.make_pag_arr_all = function() {

    img_panel.inner.model.pag.arr_all = (function() {
      var ret_arr = [];
      for(var i = 0; i < img_panel.inner.model.pag.max_num; i++) {
        ret_arr.push(i+1);
      };
  
      return ret_arr;
    })();
  };

  img_panel.inner.controller.get_img_data_by_id = function(img_id) {

    var ret_img_data;

    img_panel.inner.model.img.imgs_arr.forEach(function(img_data) {
      if(img_data.id === img_id) {
        //Torn copy:
        ret_img_data = JSON.parse( JSON.stringify( img_data ) );
      }
    });

    return ret_img_data;
  };

  img_panel.inner.controller.get_img_indx_by_id = function(img_id) {

    var ret_img_indx;

    img_panel.inner.model.img.imgs_arr.forEach(function(img_data, img_indx) {
      if(img_data.id === img_id) {
        ret_img_indx = img_indx;
      }
    });

    return ret_img_indx;
  };

  //Generate "pag.show_arr".
  img_panel.inner.controller.gen_pag_show_arr = function() {

    //If take place empty imgs array:
    if(img_panel.inner.model.img.imgs_arr.length === 0) {
      return [1];
    }

    var ret_arr_1 = [
      img_panel.inner.model.pag.arr_all[
        img_panel.inner.model.pag.sel
      ]
    ];

    var i_back = img_panel.inner.model.pag.sel;
    var i_front = img_panel.inner.model.pag.sel;

    while(true) {
      i_back--;
      if(i_back >=  0) {
        ret_arr_1.push(img_panel.inner.model.pag.arr_all[i_back]);
      }

      if(ret_arr_1.length === img_panel.inner.init.pag.max_in_row ) {
        break;
      }

      i_front++;
      if(i_front < img_panel.inner.model.pag.arr_all.length) {
        ret_arr_1.push(img_panel.inner.model.pag.arr_all[i_front]);
      }

      if(ret_arr_1.length === img_panel.inner.init.pag.max_in_row ) {
        break;
      }

      if(i_back < 0 && i_front >= img_panel.inner.model.pag.arr_all.length ) {
        break;
      }

    };

    img_panel.inner.model.pag.show_arr = ret_arr_1.sort(function(a, b) {
      if(a < b ) {
        return -1;
      } else if(a === b) {
        return 0;
      } else {
        return 1;
      }
    });
  };

  img_panel.inner.controller.gen_img_show_arr = function() {
    var beg_index = 0;
    var end_index = 0;
    var pag_num = img_panel.inner.model.pag.arr_all[img_panel.inner.model.pag.sel];
  
    beg_index = (pag_num - 1)*img_panel.inner.init.img.max_on_page;
    end_index = (function() {
      if(pag_num === img_panel.inner.model.pag.max_num) {
        return img_panel.inner.model.img.imgs_num - 1;
      } else {
        return beg_index + img_panel.inner.init.img.max_on_page - 1;
      }
    })();
  
    //Torn copy:
    img_panel.inner.model.img.show_arr = JSON.parse(
      JSON.stringify(
        img_panel.inner.model.img.imgs_arr.slice(beg_index, end_index + 1)
      )
    );
  };

  img_panel.inner.controller.gen_and_show_all = function() {

    img_panel.inner.controller.gen_img_show_arr();
    img_panel.inner.view.show_img_arr();
    img_panel.inner.controller.gen_pag_show_arr();
    img_panel.inner.view.show_nav_num();
  
    //console.log("!updated");
  };

  //!!! "data" as string:
  img_panel.inner.controller.pag_clicked = function(what_clicked) {

    var prev_sel_pag = img_panel.inner.model.pag.sel;

    switch(what_clicked) {
      case "to_beg":
        img_panel.inner.model.pag.sel = 0;
        break;
      case "to_end":
        img_panel.inner.model.pag.sel = img_panel.inner.model.pag.max_num - 1;
        break;
      case "prev":
        if(img_panel.inner.model.pag.sel !== 0) {
          img_panel.inner.model.pag.sel--;
        }
        break;
      case "next":
        if(img_panel.inner.model.pag.sel !== img_panel.inner.model.pag.max_num - 1) {
          img_panel.inner.model.pag.sel++;
        }
        break;
      //!!! Or pag index:
      default:
        img_panel.inner.model.pag.sel = Number.parseInt( what_clicked, 10 ) - 1;
        break;
    }

    if(prev_sel_pag !== img_panel.inner.model.pag.sel) {
      img_panel.inner.controller.gen_and_show_all();
    }
  };

  img_panel.inner.controller.toggle_imgs_favor = function(img_id) {

    var img_indx = img_panel.inner.controller.get_img_indx_by_id(img_id);

    var img_data = img_panel.inner.model.img.imgs_arr[img_indx];

    //Toggle in local model:
    img_panel.inner.model.img.imgs_arr[img_indx].in_favor = !img_data.in_favor;

    img_data = img_panel.inner.model.img.imgs_arr[img_indx];

    //Toggle in head model:
    //-Pass torn copy:
    cs.say("head.toggle_img_in_favor", JSON.parse(JSON.stringify(img_data)));
  };

  //Outer:
  img_panel.outer = {};

  img_panel.outer.build_with = function(img_arr) {

    //Torn copy:
    img_panel.inner.model.img.imgs_arr = JSON.parse(
      JSON.stringify(
        img_arr
      )
    );

    //Set all what is needed for build:
    img_panel.inner.model.pag.sel = 0;
    img_panel.inner.controller.build.set_imgs_num();
    img_panel.inner.controller.build.set_pag_max_num();
    img_panel.inner.controller.build.make_pag_arr_all();
    img_panel.inner.controller.gen_and_show_all();

  };

  //Init:
  img_panel.inner.init.init = function () {

    document.querySelector(".img_panel__nav__beg").onclick = function() {
      img_panel.inner.controller.pag_clicked("to_beg");
    };

    document.querySelector(".img_panel__nav__prev").onclick = function() {
      img_panel.inner.controller.pag_clicked("prev");
    };

    document.querySelector(".img_panel__nav__next").onclick = function() {
      img_panel.inner.controller.pag_clicked("next");
    };

    document.querySelector(".img_panel__nav__end").onclick = function() {
      img_panel.inner.controller.pag_clicked("to_end");
    };

    //Set connections:
    cs.set_reac("img_panel.build_with", function(imgs_arr) {
      img_panel.outer.build_with(imgs_arr);
    });
  };

  //Do init:
  img_panel.inner.init.init();

})();