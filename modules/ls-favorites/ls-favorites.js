//Working with localStorage for favorites:
//-If localStorage is not supported "read" return [], 
// "write" and "delete" will not work.
//-! For now only last respCb will be processed.

(function() {//closure

  var ls_favorites = {};

  ls_favorites.inner = {};

  ls_favorites.inner.supported = false;

  //Check if localStorage is supported:
  if (typeof(Storage) !== "undefined") {
    ls_favorites.inner.supported = true;
  } else {
    alert("LocalStorage is not supported. Favorites will not work.");
  }

  //Key to store:
  ls_favorites.inner.key = "favorite_imgs_arr";

  //Outer interface:
  ls_favorites.outer = {};

  ls_favorites.outer.write = function(array) {
    if(ls_favorites.inner.supported) {

      if(array.lenght === 0) {
        ls_favorites.outer.delete();
      } else {

        var array_str = JSON.stringify(array);
  
        window.localStorage.setItem(ls_favorites.inner.key, array_str);
      }
    }
  };
  
  ls_favorites.outer.read = function(cb) {
    if(ls_favorites.inner.supported) {
      var array_str = window.localStorage.getItem(ls_favorites.inner.key);
  
      if(array_str === null) {
        array_str = "[]";
      }
  
      cb( JSON.parse(array_str) );
    } else {
      cb( [] );
    }
  };
  
  ls_favorites.outer.delete = function() {
    if(ls_favorites.inner.supported) {
      window.localStorage.removeItem(ls_favorites.inner.key);
    }
  };

  //Connections:
  cs = CsCreate();

  cs.set_reac("ls_favorites.write", ls_favorites.outer.write);
  cs.set_reac("ls_favorites.read", ls_favorites.outer.read);
  cs.set_reac("ls_favorites.delete", ls_favorites.outer.delete);

})();//closure


/*
//Tests:

var cs = CsCreate();

var test_arr = [{a:"a", b: 1}, {a:"b", b: 2}, {a:"c", b: 3}];

var fun_1 = function(arr) {
  console.log(arr);
};
*/