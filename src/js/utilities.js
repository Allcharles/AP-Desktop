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
      console.log(folder);
      if (folder === undefined) {
        document.querySelector("#eventspinner").style.display = "none";
        document.querySelector("#eventitems").style.display = "none";
        document.querySelector(
          "#EventDetectionHelper .h1-no-hover"
        ).style.marginBottom = "-14px";
      }

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
  for (var i = 0; i < folderList.length; i++) {
    var folder = folderList[i];
    fs.readdir(folder, function(err, fileArray) {
      if (err) return console.log("Err: " + err);
      fileArray.forEach(filename => {
        const fullPath = `${folder}/${filename}`;

        fs.stat(fullPath, function(err, fileData) {
          if (err) return console.log("Err: " + err);

          if (fileData.isFile()) {
            if (
              filename.substr(filename.length - 4) === match &&
              filename.includes(contains)
            ) {
              const file = {};
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
                '" class="checkbox-custom" name="eventDetection" type="checkbox" checked onchange="" /><label for="' +
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
  }
}
