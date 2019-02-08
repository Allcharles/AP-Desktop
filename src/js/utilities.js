var eventList = [];
var eventSelection = [];
var eventEvents = [];

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
  var fs = require("fs");

  //If no selection left, allow user to select more
  if (eventSelection.length === 0) {
    document.getElementById("EventDetectorForm").style.display = "inherit";
    document.getElementById("EventDetectorAnswerForm").style.display = "none";
    return;
  } else if (eventEvents.length === 0) {
    //Grab selection and find related files
    const EVENT_START = 0;
    const EVENT_DURATION = 2;
    const SPECIES = 8;
    const FILENAME_CELL = 14;
    var csv = eventSelection.pop().filePath;
    var path = csv.substr(0, csv.lastIndexOf("\\") + 1);

    //Read csv file
    var data = fs.readFileSync(csv, "utf8");
    var rows = data.toString().split("\n");

    //Skip the header row and
    for (let i = 1; i < rows.length; i++) {
      var cell = rows[i].split(",");
      var filename = cell[FILENAME_CELL];

      //This removes the last line which can be sometimes left empty
      if (filename === undefined) continue;

      //Push important details to list
      eventEvents.push({
        image: path + filename + "__Image.png",
        sound: path + filename + ".wav",
        species: cell[SPECIES],
        start: parseFloat(cell[EVENT_START]),
        duration: parseFloat(cell[EVENT_DURATION])
      });
    }

    console.log("Updating List of Events");
    console.log(eventEvents);
  }

  //Get event details
  var eventDetails = eventEvents.pop();
  console.log("Event: ");
  console.log(eventDetails);

  //Update form with details
  var form = document.getElementById("EventDetectorAnswerForm");
  form.querySelector("#EventDetectorSound source").src = eventDetails.sound;
  form.querySelector("#EventDetectorSound").load();
  form.querySelector("#EventDetectorSpectrogram").src = eventDetails.image;
  form.querySelector("#EventDetectorAnimal").value = eventDetails.species;
}

/**
 * Enables or disables the ability for the individual to enter in information about the animal and leave comments.
 */
function toggleEvent(el) {
  if (el.checked) {
    document.getElementById("EventDetectorAnimal").disabled = false;
    document.getElementById("EventDetectorComment").disabled = false;
  } else {
    document.getElementById("EventDetectorAnimal").disabled = true;
    document.getElementById("EventDetectorComment").disabled = true;
  }
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
