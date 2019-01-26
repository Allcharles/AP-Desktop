const electron = require("electron");
const dialog = electron.remote.dialog;
const { ipcRenderer } = electron;
const SUPPORTED_AUDIO_FORMATS = ["wav"];
const AP = "AnalysisPrograms.exe";
const DEFAULT_CONFIG = "Towsey.Acoustic.yml";
const CONFIG_DIRECTORY = "C:\\AP\\ConfigFiles";

var analysisList = [];
var audioFiles = [];
var config = DEFAULT_CONFIG;
var outputFolder = "";
var audio2csvEnum = Object.freeze({ parallel: "-p" });
var audio2csvOptions = [audio2csvEnum.parallel];

function submitForm(e) {
  e.preventDefault();

  document.querySelector("#analysis-tab").style.display = "none";
  document.querySelector("#output-tab").style.display = "inherit";

  analysisList.forEach(type => {
    switch (type) {
      case "audio2csv":
        audio2csvAnalysis();
        break;
    }
  });
}

function audio2csvToggle() {
  let advancedOptions = document.querySelector("#audio2csv-options")
    .lastElementChild;

  if (advancedOptions.style.display == "none") {
    advancedOptions.style.display = "inherit";
  } else {
    advancedOptions.style.display = "none";
  }
}

function audio2csvAnalysis() {
  const os = require("os");
  const fileCount = audioFiles.length;
  var threadPool = [];
  var count = 0;

  //Limit number of files being processed to the number of cores on a computer
  for (let i = 0; i < 1; i++) {
    //os.cpus().length; i++) {
    if (i < fileCount) {
      //Create progress bar in output page
      var filename = audioFiles[i].slice(audioFiles[i].lastIndexOf("\\") + 1);
      document.querySelector("#filename").innerHTML +=
        "<div class='filename-container'>" + filename + "</div>";
      document.querySelector("#filename-loader").innerHTML +=
        "<div class='progress3' id='" +
        i +
        "'> <div class='cssProgress-bar cssProgress-active-right cssProgress-success' style='width: 0%;'> <span class='cssProgress-label'>0%</span> </div> </div>";

      //Add file to thread pool
      threadPool.push([audioFiles[i]]);
      count++;
    }
  }

  audioFiles.forEach(file => {
    var terminal = require("child_process").spawn(AP, [
      "audio2csv",
      file,
      CONFIG_DIRECTORY + "\\" + config,
      outputFolder,
      audio2csvEnum.parallel
    ]);

    terminal.on("error", function(err) {
      console.log(err);
    });

    terminal.stdout.on("data", function(data) {
      const progressreport = "Completed segment";

      //Check terminal output for successful environment
      if (data.includes(progressreport)) {
        const PARALLEL_MATCH_LENGTH = 3; //1 full match and 3 groups
        const PARALLEL_REGEX = /INFO.+\/(\d+).+ (\d+) /;
        const SERIAL_REGEX = /INFO.+(\d+)\/(\d+)$/;

        var progress = document.querySelector("#filename-loader div div");
        var res = PARALLEL_REGEX.exec(data.toString());

        if (res !== null && res.length == PARALLEL_MATCH_LENGTH) {
          var percent =
            parseInt((parseFloat(res[2]) / parseFloat(res[1])) * 100) + "%";

          progress.style.width = percent;
          progress.firstElementChild.innerHTML = percent;

          console.log(percent);
        }
      }
    });
  });
}

/**
 * Updates whether the analysis button is disabled or not
 */
function updateAnalyseButton() {
  console.debug("Analysis List: " + analysisList.length);
  console.debug("Audio Files: " + audioFiles.length);
  console.debug("Config: " + config);
  console.debug("Output Folder: " + outputFolder);

  var button = document.querySelector("#submit button");
  if (
    analysisList.length > 0 &&
    audioFiles.length > 0 &&
    config !== "" &&
    outputFolder !== ""
  ) {
    button.disabled = false;
  } else {
    button.disabled = true;
  }
}

function setOutputFolder() {
  dialog.showOpenDialog(
    {
      properties: ["openDirectory", "createDirectory"],
      title: "Select Output Folder"
    },
    function(folder) {
      var content = document.querySelector("#output .group-content");

      //No folder selected
      if (folder === undefined) {
        failure("output");
        outputFolder = "";

        //Show "no folder" message and hide folder location
        content.firstElementChild.style.display = "inherit";
        content.lastElementChild.style.display = "none";
        content.lastElementChild.innerHTML = "";
      } else {
        success("output");
        outputFolder = folder;

        //Hide "no folder" message and show folder location
        content.firstElementChild.style.display = "none";
        content.lastElementChild.style.display = "inherit";
        content.lastElementChild.innerHTML = outputFolder;
      }

      updateAnalyseButton();
    }
  );
}

/**
 * Get audio files
 */
function getAudio() {
  //Display loading animation
  document.querySelector("#audio .group-content p").style.display = "none";
  document.querySelector("#audio .group-content ul").style.display = "none";
  document.querySelector("#audiospinner").style.display = "inherit";

  process.dlopen = () => {
    throw new Error("Load native module is not safe");
  };
  //Open file selector dialog
  dialog.showOpenDialog(
    {
      properties: ["openFile", "multiSelections"],
      filters: [{ name: "Audio", extensions: SUPPORTED_AUDIO_FORMATS }],
      title: "Select Audio Files"
    },
    function(filePaths) {
      document.querySelector("#audiospinner").style.display = "none";

      if (filePaths === undefined || filePaths.length == 0) {
        failure("audio");

        document.querySelector("#audio .group-content p").style.display =
          "inherit";
        document.querySelector("#audio .group-content ul").style.display =
          "none";

        audioFiles = [];
      } else {
        success("audio");

        document.querySelector("#audio .group-content p").style.display =
          "none";
        document.querySelector("#audio .group-content ul").style.display =
          "inherit";

        audioFiles = filePaths;

        updateAudio();
      }

      updateAnalyseButton();
    }
  );
}

/**
 *
 */
function updateAudio() {
  //Display list of files
  var files = document.querySelector("#audio .group-content ul");
  files.innerHTML = "";

  //Add files to list
  for (var file = 0; file < audioFiles.length; file++) {
    files.innerHTML += '<li class="files">' + audioFiles[file] + "</li>";
  }
}

/**
 * Get config files for the drop down list
 */
function getConfig() {
  var fs = require("fs");
  var folder = CONFIG_DIRECTORY;

  fs.readdir(folder, function(err, filenames) {
    if (err) return console.log("Err: " + err);

    var select = document.querySelector("#config-select");
    filenames.forEach(filename => {
      if (filename.substr(filename.length - 4) === ".yml") {
        if (filename === DEFAULT_CONFIG)
          select.innerHTML +=
            "<option selected value='" +
            filename +
            "'>" +
            filename +
            "</option>";
        else
          select.innerHTML +=
            "<option value='" + filename + "'>" + filename + "</option>";
      }
    });
  });

  /*fs.readFile("C:/AP/ConfigFiles/Towsey.Acoustic.yml", "utf8", function(
    err,
    data
  ) {
    if (err) return console.log("Err: " + err);
    else return console.log("Data:\n" + data);
  });*/
}

/**
 * Update the config file to use for the final query
 * @param {Element} el Element object
 */
function updateConfig(el) {
  if (el.selectedIndex !== 1) {
    success("config");
    config = el.querySelector("option:checked").value;
  } else {
    failure("config");
    config = "";
  }

  updateAnalyseButton();
}

/**
 * Check the computers environment, if the system is not setup this will provide details.
 */
let count = 0;
function checkEnvironment() {
  var terminal = require("child_process").spawn(AP, ["CheckEnvironment"]);

  terminal.on("error", function(err) {
    document.querySelector("#environment").style.display = "inherit";
  });

  terminal.stdout.on("data", function(data) {
    count++;
    document.querySelector("#environment .group-content pre").innerHTML +=
      "\n" + data;

    //Third message from terminal contains the success message
    if (count == 3) {
      var match = "SUCCESS - Valid environment";

      //Check terminal output for successful environment
      if (data.includes(match)) {
        document.querySelector("#select").style.display = "inherit";
        document.querySelector("#environment").style.display = "none";
      } else {
        document.querySelector("#select").style.display = "none";
        document.querySelector("#environment").style.display = "inherit";
      }
    }
  });
}

/**
 * Determines what inputs are required to complete the analysis
 * @param {Element} el Element object
 */
function selectAnalysis(el) {
  var inputList = [
    ["audio", false],
    ["config", false],
    ["output", false],
    ["audio2csv-options", false],
    ["submit", false]
  ];

  //Check if item exists
  if (el.checked) {
    analysisList.push(el.value);
  } else {
    analysisList.splice(analysisList.indexOf(el.value), 1);
  }

  //Determine list of inputs required
  analysisList.forEach(analysisType => {
    switch (analysisType) {
      case "audio2csv":
        addItems(inputList, [
          "audio",
          "config",
          "output",
          "audio2csv-options",
          "submit"
        ]);
        break;
    }
  });

  //Enable required inputs
  inputList.forEach(id => {
    if (id[1]) {
      form.querySelector("#" + id[0]).style.display = "inherit";
    } else {
      form.querySelector("#" + id[0]).style.display = "none";
    }
  });
}

/**
 * Add items to array if they do not exist
 * @param {array} inputList Array of elements to update
 * @param {array} items Array of items to change inputList
 */
function addItems(inputList, items) {
  inputList.forEach(element => {
    items.forEach(item => {
      if (element[0] === item) {
        element[1] = true;
        return;
      }
    });
  });
}

/**
 * Displays a group element as a failure
 * @param {string}  id  ID of the group
 */
function failure(id) {
  var title = document.querySelector("#" + id + " .question");
  if (title !== null) title.setAttribute("class", "question-fail");
  else return;

  var extra = document.querySelector("#" + id + " a .question-button");
  if (extra !== null) extra.setAttribute("class", "question-button-fail");
}

/**
 * Displays a group element as a success
 * @param {string}  id  ID of the group
 */
function success(id) {
  var title = document.querySelector("#" + id + " .question-fail");
  if (title !== null) title.setAttribute("class", "question");
  else return;

  var extra = document.querySelector("#" + id + " a .question-button-fail");
  if (extra !== null) extra.setAttribute("class", "question-button");
}
