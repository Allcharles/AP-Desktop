var eventList = [];
var eventSelection = [];

/**
 * Lets the user select what files to analyse
 */
function eventSelectFolder() {
  document.querySelector("#eventspinner").style.display = "inherit";
  document.querySelector("#eventitems").style.display = "none";
  document.querySelector(
    "#EventDetectionHelper .h1-no-hover"
  ).style.marginBottom = "-14px";

  process.dlopen = () => {
    throw new Error("Load native module is not safe");
  };
  //Open file selector dialog
  dialog.showOpenDialog(
    {
      properties: ["openDirectory", "createDirectory", "multiSelections"],
      title: "Select Event Folder"
    },
    function(folder) {
      //Clear EventList and spinner
      eventList = [];
      document.querySelector("#eventspinner").style.display = "none";

      //Hide event items
      document.querySelector("#eventitems").style.display = "none";
      document.querySelector(
        "#EventDetectionHelper .h1-no-hover"
      ).style.marginBottom = "-14px";

      //If no folder is selected
      if (folder !== undefined) {
        //Update EventDetectionInputs
        document.getElementById("EventDetectionInputs").innerHTML = "";
        findFilesRecursive(folder, ".csv", ".Events");
      }
    }
  );
}

/**
 * Finds all files inside a folder recursively
 * @param [list] folderList Folders to search
 * @param [string] match File extension to find
 * @param [string] contains Specific word the file must contain
 */
function findFilesRecursive(folderList, match, contains = "") {
  //Parallel Recursive Search (https://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search)
  var fs = require("fs");
  var path = require("path");
  var walk = function(dir, done) {
    var results = [];
    fs.readdir(dir, function(err, list) {
      if (err) return done(err);
      var pending = list.length;
      if (!pending) return done(null, results);
      list.forEach(function(file) {
        file = path.resolve(dir, file);
        fs.stat(file, function(err, stat) {
          if (stat && stat.isDirectory()) {
            walk(file, function(err, res) {
              results = results.concat(res);
              if (!--pending) done(null, results);
            });
          } else {
            results.push(file);
            if (!--pending) done(null, results);
          }
        });
      });
    });
  };

  //Get .csv files
  folderList.forEach(dir => {
    walk(dir, function(err, results) {
      if (err) throw err;

      results.forEach(filepath => {
        var fullFilename = filepath.substr(filepath.lastIndexOf("\\") + 1);
        var filename = fullFilename.substr(
          0,
          fullFilename.lastIndexOf("_") - 1
        );

        var file = {};
        file.id = eventList.length;
        file.filePath = filepath; //Full file path
        file.fileName = filename; //File name minus file extension
        file.extension = filepath.substr(filepath.length - match.length);

        if (file.extension === match && fullFilename.includes(contains)) {
          //First element found
          if (eventList.length === 0) {
            //Display event items
            document.querySelector("#eventitems").style.display = "inherit";
            document.querySelector(
              "#EventDetectionHelper .h1-no-hover"
            ).style.marginBottom = "0px";

            document.getElementById("EventDetectorForm").style.display =
              "inherit";
            document.getElementById("EventDetectorAnswerForm").style.display =
              "none";
          }

          eventList.push(file);

          document.getElementById("EventDetectionInputs").innerHTML +=
            '<li><input id="util' +
            generateID(file.filePath) +
            '" value="' +
            file.id +
            '" class="checkbox-custom" name="eventDetection" type="checkbox" checked onchange="" /><label for="util' +
            generateID(file.filePath) +
            '" class="checkbox-custom-label">' +
            file.fileName +
            "</label></li>";
        }
      });
    });
  });
}

/**
 * Creates the event detector utility.
 * @param [object] el HTML element
 */
function createEventDetectionUtility(el) {
  el.preventDefault();

  //Verify inputs
  var input = document.getElementById("EventDetectorForm");
  var selection = input.querySelectorAll("input:checked");

  //If no items selected, return
  if (selection.length === 0) {
    return;
  }

  //Update selection list with new selections
  eventSelection = [];
  for (var i = 0; i < selection.length; i++) {
    eventSelection.push(eventList[Number(selection[i].value)]);
  }

  //Update forms and disable buttons
  input.style.display = "none";
  document.getElementById("EventDetectorAnswerForm").style.display = "inherit";
  eventDetectionUtilityNext(el);
}

/**
 * Updates event detector form.
 * @param [object] el HTML element
 */
function eventDetectionUtilityNext(el) {
  el.preventDefault();

  //If no selection left, allow user to select more
  if (eventSelection.length === 0) {
    document.getElementById("EventDetectorForm").style.display = "inherit";
    document.getElementById("EventDetectorAnswerForm").style.display = "none";
  }

  //Grab selection and find related files
  var csv = eventSelection.pop().filePath;
  var imageFiles = [];
  var soundFiles = [];
}

/**
 * Checks all inputs in the event detection helper
 */
function checkAll() {
  document
    .querySelectorAll("#EventDetectionInputs input")
    .forEach(function(node) {
      node.checked = true;
    });
}

/**
 * Unchecks all inputs in the event detection helper
 */
function uncheckAll() {
  document
    .querySelectorAll("#EventDetectionInputs input")
    .forEach(function(node) {
      node.checked = false;
    });
}
