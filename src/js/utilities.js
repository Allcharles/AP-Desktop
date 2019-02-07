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

  folderList.forEach(dir => {
    walk(dir, function(err, results) {
      if (err) throw err;

      results.forEach(filepath => {
        var filename = filepath.substr(filepath.lastIndexOf("\\") + 1);
        filename = filename.substr(0, filename.length - match.length);

        var file = {};
        file.id = eventList.length;
        file.filePath = filepath; //Full file path
        file.fileName = filename; //File name minus file extension
        file.extension = filepath.substr(filepath.length - 4);
        eventList.push(file);

        console.log(file);

        document.getElementById("EventDetectionForm").innerHTML +=
          '<li><input id="util' +
          generateID(file.filePath) +
          '" value="' +
          file.id +
          '" class="checkbox-custom" name="eventDetection" type="checkbox" onchange="" /><label for="util' +
          generateID(file.filePath) +
          '" class="checkbox-custom-label">' +
          file.fileName +
          "</label></li>";
      });
    });
  });

  /*
  for (var i = 0; i < folderList.length; i++) {
    var folder = folderList[i];
    console.log(folder);
    fs.readdir(folder, function(err, fileArray) {
      if (err) return console.log("Err: " + err);
      fileArray.forEach(filename => {
        var fullPath = `${folder}/${filename}`;

        fs.stat(fullPath, function(err, fileData) {
          if (err) return console.log("Err: " + err);

          if (fileData.isFile()) {
            if (
              filename.substr(filename.length - 4) === match &&
              filename.includes(contains)
            ) {
              var file = {};
              file.id = eventList.length;
              file.filePath = fullPath; //Full file path
              file.fileName = filename.substr(0, filename.length - 4); //File name minus file extension
              file.extension = match;
              eventList.push(file);

              document.getElementById("EventDetectionForm").innerHTML +=
                '<li><input id="util' +
                generateID(file.filePath) +
                '" value="' +
                file.id +
                '" class="checkbox-custom" name="eventDetection" type="checkbox" onchange="" /><label for="util' +
                generateID(file.filePath) +
                '" class="checkbox-custom-label">' +
                file.fileName +
                "</label></li>";
            }
          } else {
            //This is a folder, search rescursively
            findFilesRecursive([fullPath], match, contains);
          }
        });
      });
    });
  }*/
}
