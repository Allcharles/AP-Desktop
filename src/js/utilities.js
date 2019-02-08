var eventList = [];

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
      if (folder === undefined) {
        document.querySelector("#eventspinner").style.display = "none";
        document.querySelector("#eventitems").style.display = "none";
        document.querySelector(
          "#EventDetectionHelper .h1-no-hover"
        ).style.marginBottom = "-14px";
      }

      eventList = [];
      document.getElementById("EventDetectionForm").innerHTML = "";
      findFilesRecursive(folder, ".csv", ".Events");

      document.querySelector("#eventspinner").style.display = "none";
      document.querySelector("#eventitems").style.display = "inherit";
      document.querySelector(
        "#EventDetectionHelper .h1-no-hover"
      ).style.marginBottom = "0px";
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
function eventDetectionUtility(el) {
  el.preventDefault();

  const remote = require("electron").remote;
  const BrowserWindow = remote.BrowserWindow;

  var win = new BrowserWindow({ width: 539, height: 420 });
  win.loadURL(`file://${__dirname}/eventDetector.html`);
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
