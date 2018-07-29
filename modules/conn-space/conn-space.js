//Connection space:
//-!This is not the events.
//-There can be only one reaction to statement.
//-Reaction function will always get "data_or_cb" as argument,
//even when it is "undefined", as in case when "cs_outer.say" don't get data.

//Function to get cs interface:
var CsCreate;

(function() {//closure

  //Inner obj:
  var cs_inner = {};

  //-Array of statm and react:
  cs_inner.st_and_react_arr = [];

  //--Return "-1" if there no such statement.
  cs_inner.indexOfStatement = function(statement) {

    var statm_indx = -1;

    if(cs_inner.st_and_react_arr.length !== 0) {
      for(var i = 0; i < cs_inner.st_and_react_arr.length; i++) {
        if(cs_inner.st_and_react_arr[i].statement === statement) {
          statm_indx = i;
          break;
        }
      }
    }

    return statm_indx;
  };

  //Outer interface:
  var cs_outer = {};

  //Constructor for st and react object:
  var StatementAndReaction = function() {
    this.statement = "";
    //Function:
    this.reaction = undefined;
    this.arr_of_data = [];
  };

  //Make or add statement:
  cs_outer.say = function(statement, data_or_cb = undefined) {

    //Check if there already present such statement:
    //-If no "statm_indx" will be "-1".
    var statm_indx = cs_inner.indexOfStatement(statement);

    //If not present:
    if(statm_indx === -1) {
      //Create one:
      var new_st_and_re = new StatementAndReaction();
      new_st_and_re.statement = statement;
  
      //!Must be present:
      //-Some statement can go without data or cb, but they must be processed later.
      new_st_and_re.arr_of_data.push(data_or_cb);

      cs_inner.st_and_react_arr.push(new_st_and_re);
    } else {
      //If present:

      //If setted reaction:
      if(cs_inner.st_and_react_arr[statm_indx].reaction !== undefined) {
        cs_inner.st_and_react_arr[statm_indx].reaction(data_or_cb);
      } else {
        //Else just push to process later:
        cs_inner.st_and_react_arr[statm_indx].arr_of_data.push(data_or_cb);
      }
    }

  };

  //Set reaction to statement:
  cs_outer.set_reac = function(statement, reaction) {

    //Check if there already present such statement:
    //-If no, "statm_indx" will be "-1".
    var statm_indx = cs_inner.indexOfStatement(statement);

    //If not present:
    if(statm_indx === -1) {
      //Create one:
      var new_st_and_re = new StatementAndReaction();
      new_st_and_re.statement = statement;
      new_st_and_re.reaction = reaction;

      cs_inner.st_and_react_arr.push(new_st_and_re);
      statm_indx = cs_inner.indexOfStatement(statement);

    } else {
      //If present, check if already setted react:
      //-if setted - throw error:
      //!Reaction for one statement can be only one and setted only once.
      if(cs_inner.st_and_react_arr[statm_indx].reaction !== undefined) {
        throw "cs: You can set reaction only once.";
      } else {
        //Set:
        cs_inner.st_and_react_arr[statm_indx].reaction = reaction;
        //Run thru "arr_of_data" if not empty and clear it:
        if(cs_inner.st_and_react_arr[statm_indx].arr_of_data.length !== 0) {
          cs_inner.st_and_react_arr[statm_indx].arr_of_data.forEach(
            function(data_or_cb) {
              cs_inner.st_and_react_arr[statm_indx].reaction(data_or_cb);
            }
          );
        }
      }
    }

    //Delete the property:
    //!Array of data only needed till that moment when will be present reaction:
    delete cs_inner.st_and_react_arr[statm_indx].arr_of_data;

  };


  //Make singleton:
  CsCreate = function() {
    return cs_outer;
  };
  
})();//closure