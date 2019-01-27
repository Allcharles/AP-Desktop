const electron = require("electron");
const dialog = electron.remote.dialog;
const { ipcRenderer } = electron;
const SUPPORTED_AUDIO_FORMATS = ["wav"];
const AP = "AnalysisPrograms.exe";
const DEFAULT_CONFIG = "Towsey.Acoustic.yml";
const CONFIG_DIRECTORY = "C:\\AP\\ConfigFiles";

/** Used in the form to determine inputs */
var analysisList = [];
var audioFiles = [];
var config = DEFAULT_CONFIG;
var outputFolder = "";
var audio2csvEnum = Object.freeze({ parallel: "-p" });
var audio2csvOptions = [audio2csvEnum.parallel];

/** Use in analysis to detemine output */
var analysis = [];
var fileQueue = [];
var analysisQueue = [];

function submitForm(e) {
  e.preventDefault();

  document.querySelector("#analysis-tab").style.display = "none";
  document.querySelector("#output-tab").style.display = "inherit";

  //Create loading bars with blank analysis
  audioFiles.forEach(file => {
    let id = file.replace(/[ |\/|\\]/g, "");
    createLoader(id, file);
  });

  //Transfer arrays
  audioFiles.forEach(file => {
    fileQueue.push(file);
  });
  audioFiles = [];
  analysisList.forEach(analysis => {
    analysisQueue.push(analysis);
  });
  analysisList = [];

  analysis = [0, 0];

  analyse();
}

function analyse() {
  const FILE = 0;
  const ANALYSIS = 1;

  //Determine analysis to run
  let file = fileQueue[analysis[FILE]];
  let id = generateID(file);
  let analysisType = analysisQueue[analysis[ANALYSIS]];
  updateLoader(id, analysisType);

  //If the file has not be analysed before, create group to store its data
  if (document.querySelector("#" + id) === undefined) createGroup();

  var terminal = require("child_process").spawn(AP, [
    analysisType,
    file,
    config,
    outputFolder,
    "-p"
  ]);

  terminal.on("error", function(err) {
    console.error(err);
    finishLoader("#" + generateID(fileQueue[analysis[0]]), false);
  });

  terminal.on("close", function(code) {
    analyse();
    finishLoader("#" + generateID(fileQueue[analysis[0]]), true);
  });

  terminal.stdout.on("data", function(data) {
    const progressreport = "Completed segment";

    //Check terminal output for successful environment
    if (data.includes(progressreport)) {
      const PARALLEL_MATCH_LENGTH = 3; //1 full match and 3 groups
      const PARALLEL_REGEX = /INFO.+\/(\d+).+ (\d+) /;
      const SERIAL_REGEX = /INFO.+(\d+)\/(\d+)$/;

      var progress = document.querySelector(
        "#" + generateID(fileQueue[analysis[0]])
      );
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

  //Set next analysis details
  if (analysis[ANALYSIS] < analysisQueue.length - 1) {
    analysis[ANALYSIS]++;
  } else {
    if (analysis[FILE] < fileQueue.length - 1) {
      analysis[FILE]++;
      analysis[ANALYSIS] = 0;
    } else {
      return;
    }
  }
}

/**
 * Returns the ID of the file path. This is done by hashing the file path.
 * @param {string} filePath File path
 */
function generateID(filePath) {
  var hash = 0;
  if (filePath.length == 0) return hash;
  for (let i = 0; i < filePath.length; i++) {
    let char = filePath.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; //Converts output to 32bit integer
  }

  return hash.toString();
}

/**
 * Returns the filename from the file path
 * @param {string} filePath File path
 */
function getFilename(filePath) {
  return filePath.slice(filePath.lastIndexOf("\\") + 1);
}

/**
 * Create the group container for the files detailsa
 * @param {string} id ID of the file
 * @param {string} filename File path of the audio file
 */
function createGroup(id, filename) {}

/**
 * Creates the loading details for each of the files
 * @param {string} id ID of the file
 * @param {string} filename File path of the audio file
 */
function createLoader(id, filename) {
  document.querySelector("#filename").innerHTML +=
    "<div class='filename-container'>" +
    filename.slice(filename.lastIndexOf("\\") + 1) +
    "</div>";
  document.querySelector("#filename-analysis").innerHTML +=
    "<div class='filename-container' id='an" + id + "'>???</div>";
  document.querySelector("#filename-loader").innerHTML +=
    "<div class='progress3' id='pb" +
    id +
    "'> <div class='cssProgress-bar cssProgress-active-right' style='width: 0%;'> <span class='cssProgress-label'>0%</span> </div> </div>";
}

/**
 * Changes the progress bar to yellow and adds an analysis detail
 * @param {string} id ID of the file
 * @param {string} analysis Analysis type to run
 */
function updateLoader(id, analysis) {
  document.querySelector("#an" + id).innerHTML = analysis;
  document.querySelector("#pb" + id).innerHTML =
    "<div class='cssProgress-bar cssProgress-active-right cssProgress-warning' style='width: 0%;'><span class='cssProgress-label'>0%</span></div>";
}

/**
 * Changes the progress bar to green and removes the analysis detail
 * @param {string} id ID of the file
 * @param {boolean} success True if successful
 */
function finishLoader(id, success) {
  document.querySelector("#an" + id).innerHTML = "???";
  success
    ? (document.querySelector("#pb" + id).innerHTML =
        "<div class='cssProgress-bar cssProgress-active-right cssProgress-success' style='width: 0%;'><span class='cssProgress-label'>0%</span></div>")
    : (document.querySelector("#pb" + id).innerHTML =
        "<div class='cssProgress-bar cssProgress-active-right cssProgress-danger' style='width: 0%;'><span class='cssProgress-label'>0%</span></div>");
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
