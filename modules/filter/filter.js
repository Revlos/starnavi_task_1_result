//Filter:

(function() {//closure

  var cs = CsCreate();

  var filter = {};

  //Inner:
  filter.inner = {};

  //Init:
  filter.inner.init = {};

  //Is filter ready:
  filter.inner.init.is_ready = false;

  filter.inner.init.get_imgs_arr = function(cb) {
    cs.say("head.get_imgs_arr", cb);
  };

  filter.inner.init.filter_res_cb = function(result) {
    cs.say("img_panel.build_with", result);
  };

  //Model:
  filter.inner.model = {};

  filter.inner.model._all = true;

  filter.inner.model.size = "All";

  filter.inner.model.author = "All";

  //View:
  filter.inner.view = {};

  filter.inner.view.appl_model_to_view = function() {

    //Apply only when filter is ready:
    if(filter.inner.init.is_ready) {


      if(filter.inner.model._all === true) {

        document.querySelector(".filter__gener__none a").className = "filter__item--selected";

      } else {

        document.querySelector(".filter__gener__none a").removeAttribute("class");

      }

      document.querySelectorAll(".filter__size__sizes a").forEach(function(a_elm) {
        if(a_elm.getAttribute("data-filter-by") === filter.inner.model.size ) {
          a_elm.className = "filter__item--selected";
        } else {
          a_elm.removeAttribute("class");
        }
      });

      document.querySelectorAll(".filter__author__authors a").forEach(function(a_elm) {
        if(a_elm.getAttribute("data-filter-by") === filter.inner.model.author) {
          a_elm.className = "filter__item--selected";
        } else {
          a_elm.removeAttribute("class");
        }
      });
    }    
  };

  //Controller:
  filter.inner.controller = {};

  filter.inner.controller.apply_filter = function() {

    //Apply only when filter is ready:
    if(filter.inner.init.is_ready) {

      filter.inner.init.get_imgs_arr(function(input_imgs_arr) {

        //Unlinked copy:
        var img_arr_copy = JSON.parse(JSON.stringify(input_imgs_arr));
        var interm = [];
        var result = [];

        //Apply:
        if(filter.inner.model._all === false) {

          //Apply sizes:
          //!!! By width:
          switch (filter.inner.model.size) {
            case "All":
              interm = img_arr_copy;
              break;
            case filter.inner.init.size_arr[0]://"Large"
              img_arr_copy.forEach(function(img_data) {
                if(filter.inner.init.size_appl_cond(0, img_data)) {
                  interm.push(img_data);
                }
              });
              //console.log(interm);
              break;
            case filter.inner.init.size_arr[1]://"Medium"
              img_arr_copy.forEach(function(img_data) {
                if(filter.inner.init.size_appl_cond(1, img_data)) {
                  interm.push(img_data);
                }
              });
              break;
            case filter.inner.init.size_arr[2]://"Small"
              img_arr_copy.forEach(function(img_data) {
                if(filter.inner.init.size_appl_cond(2, img_data)) {
                  interm.push(img_data);
                }
              });
              break;
            default:
              throw "Imgs_filter: Trying to apply undefined size case.";
              break;
          }

          //Setting intermediate array as starting array:
          img_arr_copy = interm;
          interm = [];

          //Apply authors:
          switch (filter.inner.model.author) {
            case "All":
              interm = img_arr_copy;
              break;
            default:
              img_arr_copy.forEach(function(img_data) {
                if(img_data.author === filter.inner.model.author) {
                  interm.push(img_data);
                }
              });
              break;
          }

          result = interm;

        } else {
          result = img_arr_copy;
        }

        filter.inner.init.filter_res_cb(result);

      });
    }//end: if(img_filter.interface.ready) {

  };

  //Authors array:
  filter.inner.model.authors_arr = [];

  filter.inner.controller.authors_arr_make = function(img_arr) {
    var ret_arr = [];

    //Torn copy:
    img_arr_copy = JSON.parse(JSON.stringify(img_arr));

    img_arr_copy.forEach(function(img_data) {

      if( ret_arr.indexOf(img_data.author) === -1) {
        ret_arr.push(img_data.author);
      }
    });

    filter.inner.model.authors_arr = ret_arr;
  };

  //List of size names:
  filter.inner.init.size_arr = ["Large", "Medium", "Small"];

  //Check if size condition take place:
  //-Returns true if condition is take place.
  //!!! By width.
  filter.inner.init.size_appl_cond = function( size_indx, data) {
    switch (filter.inner.init.size_arr[size_indx]) {
      case "Large":
        if(data.width >= 1500) {
          return true;
        } else {
          return false
        }
        break;
      case "Medium":
        if(data.width <= 1499 && data.width >= 800) {
          return true;
        } else {
          return false
        }
        break;
      case "Small":
        if(data.width <= 799) {
          return true;
        } else {
          return false
        }
        break;
      default:
        return false;
        break;
    }
  };

  filter.inner.view.append_filters_items = function() {

    //Sizes:
    var sizes_ul = document.querySelector(".filter__size__sizes");

    //Clear and add "all":
    sizes_ul.innerHTML = '<li><a href="javascript:;" data-filter-by="All">All</a></li>';
  
    filter.inner.init.size_arr.forEach(function(size_str) {
      var size_li = document.createElement("li");
  
      size_li.innerHTML = '<a href="javascript:;" data-filter-by="'
        + size_str + '">' + size_str + '</a>';
  
      sizes_ul.appendChild(size_li);
    });
  
    //Authors:
    var authors_ul = document.querySelector(".filter__author__authors");

    //Clear and add "all":
    authors_ul.innerHTML = '<li><a href="javascript:;" data-filter-by="All">All</a></li>';
  
    filter.inner.model.authors_arr.forEach(function(author_str) {
      var author_li = document.createElement("li");
  
      author_li.innerHTML = '<a href="javascript:;" data-filter-by="'
      + author_str + '">' + author_str + '</a>';
  
      authors_ul.appendChild(author_li);
    });
  };

  filter.inner.view.add_cb_to_filters_items = function() {

    //No filter:
    document.querySelector(".filter__gener__none a").onclick = function(e) {
      
      filter.inner.model._all = true;
      filter.inner.model.size = "All";
      filter.inner.model.author = "All";
  
      filter.inner.controller.apply_filter();
  
      filter.inner.view.appl_model_to_view();
    };
  
    //Selected size:
    document.querySelectorAll(".filter__size__sizes a").forEach(function(a_elm) {
  
      a_elm.onclick = function(e) {
      
      filter.inner.model._all = false;
      filter.inner.model.size = e.currentTarget.getAttribute("data-filter-by");
  
      filter.inner.controller.apply_filter();
  
      filter.inner.view.appl_model_to_view();
      };
  
    });
    
  
    //Selected author:
    document.querySelectorAll(".filter__author__authors a").forEach(function(a_elm) {
  
      a_elm.onclick = function(e) {
      
      filter.inner.model._all = false;
      filter.inner.model.author = e.currentTarget.getAttribute("data-filter-by");
  
      filter.inner.controller.apply_filter();
  
      filter.inner.view.appl_model_to_view();
      };
  
    });  
  
  };

  //Outer:
  filter.outer = {};

  filter.outer.build = function() {

    filter.inner.init.get_imgs_arr(function(imgs_arr) {

      filter.inner.controller.authors_arr_make(imgs_arr);
      filter.inner.view.append_filters_items();
      filter.inner.view.add_cb_to_filters_items();

      //Reset filter parameters:
      filter.inner.model._all = true;
      filter.inner.model.size = "All";
      filter.inner.model.author = "All";


      filter.inner.view.appl_model_to_view();
      filter.inner.controller.apply_filter();
    });
  };

  //All ready:
  filter.inner.init.is_ready = true;

  //Init function:
  filter.inner.init.init = function() {

    //Set connections:
    
    //Say filter to build:
    cs.set_reac("filter.build", function() {
      filter.outer.build();
    });
  };

  //Do init:
  filter.inner.init.init();  

})();//closure