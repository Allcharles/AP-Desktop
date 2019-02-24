const electron = require("electron");
const { app } = electron.remote;
const dialog = electron.remote.dialog;
const SUPPORTED_AUDIO_FORMATS = ["wav"];
const IS_WINDOWS = process.platform === "win32";
const AP_LOCATION = IS_WINDOWS
  ? "C:/AP"
  : app.getPath("documents") + "/VRES/AP"; //Linux command is hard coded for my computer.
const AP = IS_WINDOWS
  ? "AnalysisPrograms.exe"
  : AP_LOCATION + "/AnalysisPrograms.exe"; //Linux command is hard coded for my computer.
const DEFAULT_CONFIG = "Towsey.Acoustic";
const CONFIG_DIRECTORY = AP_LOCATION + "/ConfigFiles";
const DEFAULT_OUTPUT_FOLDER =
  app.getPath("documents") + (IS_WINDOWS ? "\\" : "/") + "AP Desktop";
const fs = require("fs");

/** Used in the form to determine inputs */
var analysisList = [];
var audioFiles = [];
var configFiles = [];
var config = 0;
var outputFolder = DEFAULT_OUTPUT_FOLDER;

/** Use in analysis to detemine output */
var analysis = [];
var fileQueue = [];
var analysisQueue = [];
var outputConfig;
var outputOutputFolder;

/** Tracks whether an analysis is running */
var analysisInProgress = false;

/**
 * This function outputs all terminal commands to the console for review.
 * Enable for debugging information.
 */

(function() {
  var oldSpawn = require("child_process").spawn;
  function mySpawn() {
    console.debug("spawn called");
    console.debug(arguments);
    var result = oldSpawn.apply(this, arguments);
    return result;
  }
  require("child_process").spawn = mySpawn;
})();

/**
 * Rebuild analysis form from template
 */
function buildAnalysisForm() {
  const fs = require("fs");

  var template =
    __dirname.substr(0, getFilenameIndex(__dirname) + 1) +
    "html/analysisForm.html";
  var form = fs.readFileSync(template, "utf8");
  document.getElementById("analysis-template-holder").innerHTML = form;

  //Set submit button onclick function
  document
    .querySelector("#AnalysisForm")
    .addEventListener("submit", submitAnalysis);

  //Update config and outputFolder
  setConfig();
  loadDefaultOutputFolder();
}

/**
 * Builds the output template code
 */
function buildOutputTemplate() {
  var template =
    __dirname.substr(0, getFilenameIndex(__dirname) + 1) +
    "html/outputTemplate.html";
  var div = fs.readFileSync(template, "utf8");
  document.getElementById("output-tab").innerHTML = div;
}

/**
 * Analyse button press. Resets output page, updates navigation, and creates analysis details.
 * @param {HTMLObject} e Submit Button
 */
function submitAnalysis(e) {
  e.preventDefault();

  console.log("Config 1: " + configFiles[config].fileName);
  console.log("Output 1: " + outputFolder);

  if (analysisInProgress) {
    alert("Previous Analysis Still Running");
    return;
  }

  //Reset output variables
  fileQueue = [];
  analysisQueue = [];

  //Transfer arrays
  audioFiles.forEach(file => {
    fileQueue.push(file);
  });
  audioFiles = [];
  analysisList.forEach(analysis => {
    analysisQueue.push(analysis);
  });
  analysisList = [];

  console.log("Config 2: " + configFiles[config].fileName);
  console.log("Output 2: " + outputFolder);

  //Tranfer variables
  outputConfig = config;
  outputOutputFolder = outputFolder;

  //Analysis to run [fileIndex, analysisIndex]
  analysis = [0, -1];

  //Update HTML
  buildAnalysisForm();
  buildOutputTemplate();
  document.querySelector("#analysis-tab").style.display = "none";
  document.querySelector("#output-tab").style.display = "inherit";
  document.querySelector("#page").id = "analysis";
  document.querySelector("#output").id = "page";

  //Create loading bars with blank analysis
  fileQueue.forEach(file => {
    let id = generateID(file);
    createLoader(id, file);
  });

  analysisInProgress = true;
  analyse();
}

function analyse() {
  const FILE = 0;
  const ANALYSIS = 1;

  //Set next analysis details
  if (analysis[ANALYSIS] < analysisQueue.length - 1) {
    analysis[ANALYSIS]++;
  } else {
    if (analysis[FILE] < fileQueue.length - 1) {
      analysis[FILE]++;
      analysis[ANALYSIS] = 0;
    } else {
      analysisInProgress = false;
      return;
    }
  }

  //Determine analysis to run
  let file = fileQueue[analysis[FILE]];
  let filename = getFilename(file);
  filename = filename.substr(0, filename.length - 4);
  let id = generateID(file);
  let analysisType = analysisQueue[analysis[ANALYSIS]];
  updateLoader(id, analysisType);

  //If the file has not be analysed before, create group to store its data
  if (document.querySelector("#gr" + id) === null) createGroup(id, file);

  var terminalOutput;
  if (IS_WINDOWS) {
    console.log(
      "Command: " +
        AP +
        " " +
        analysisType +
        " " +
        file +
        " " +
        configFiles[outputConfig].filePath +
        " " +
        outputOutputFolder +
        "\\" +
        filename +
        " -p"
    );
    terminalOutput = require("child_process").spawn(AP, [
      analysisType,
      file,
      configFiles[outputConfig].filePath,
      outputOutputFolder + "/" + filename,
      "-p"
    ]);
  } else {
    console.log(
      "Command: mono " +
        AP +
        " " +
        analysisType +
        " " +
        file +
        " " +
        configFiles[outputConfig].filePath +
        " " +
        outputOutputFolder +
        "\\" +
        filename +
        " -p"
    );
    terminalOutput = require("child_process").spawn("mono", [
      AP,
      analysisType,
      file,
      configFiles[outputConfig].filePath,
      outputOutputFolder + "/" + filename,
      "-p"
    ]);
  }

  terminalOutput.on("error", function(err) {
    console.error(err);
    finishLoader(generateID(fileQueue[analysis[0]]), false);
  });

  terminalOutput.on("close", function(code) {
    finishLoader(generateID(fileQueue[analysis[0]]), code === 0);
    updateGroup(
      generateID(fileQueue[analysis[0]]),
      fileQueue[analysis[0]],
      code === 0
    );
    analyse();
  });

  terminalOutput.stdout.on("data", function(data) {
    updateProgressBar(data);
    updateTerminalOutput(data);
  });
}

/**
 * Updates files terminal output section
 * @param {string} data Terminal output
 */
function updateTerminalOutput(data) {
  var terminalOutput = document.querySelector(
    "#gr" + generateID(fileQueue[analysis[0]]) + " pre"
  );

  terminalOutput.innerHTML += data;
}

/**
 * Updates the progress bar with the current percentage
 * @param {string} data Terminal output
 */
function updateProgressBar(data) {
  const progressreport = "Completed segment";
  //Check terminal output for successful environment
  if (data.includes(progressreport)) {
    const PARALLEL_MATCH_LENGTH = 3; //1 full match and 3 groups
    const PARALLEL_REGEX = /INFO.+\/(\d+).+ (\d+) /;
    const SERIAL_REGEX = /INFO.+(\d+)\/(\d+)$/;
    var progress = document.querySelector(
      "#pb" + generateID(fileQueue[analysis[0]])
    );
    var res = PARALLEL_REGEX.exec(data.toString());
    if (res !== null && res.length == PARALLEL_MATCH_LENGTH) {
      var percent =
        parseInt((parseFloat(res[2]) / parseFloat(res[1])) * 100) + "%";
      progress.firstElementChild.style.width = percent;
      progress.firstElementChild.firstElementChild.innerHTML = percent;
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
  let index = filePath.lastIndexOf("\\");

  if (index === -1) {
    return filePath.slice(filePath.lastIndexOf("/") + 1);
  } else {
    return filePath.slice(filePath.lastIndexOf("\\") + 1);
  }
}

/**
 * Returns the index of the last / or \ depending on the filepath
 * @param {string} filePath File path
 */
function getFilenameIndex(filePath) {
  let index = filePath.lastIndexOf("\\");

  if (index === -1) {
    return filePath.lastIndexOf("/");
  } else {
    return index;
  }
}

/**
 * Sanitises a file path for windows and linux compatibility.
 * @param {string} filePath File path
 * @returns {string} Sanitised file path
 */
function sanitiseFilePath(filePath) {
  if (IS_WINDOWS) {
    return filePath.replace(new RegExp("/", "g"), "\\");
  } else {
    return filePath.replace(new RegExp("\\", "g"), "/");
  }
}

/**
 * Create the group container for the files details
 * @param {string} id ID of the file
 * @param {string} filePath File path of the audio file
 */
function createGroup(id, filePath) {
  document.querySelector("#output-tab").innerHTML +=
    '<div class="group" id="gr' +
    id +
    '"><div class="question" onclick="toggleHeader(this);"><p class="question-text">' +
    getFilename(filePath) +
    '</p></div><div class="group-content" style="display: none"id="pic' +
    id +
    '"><h1 id="ttl' +
    id +
    '" onclick="toggleTerminal(this);">Terminal Output</h1><div class="header-content-padded" style="margin-bottom: -28px;"><div class="output" style="display: none" id="div' +
    id +
    '"><pre></pre></div></div></div>';
}

/**
 * Updates the group container to include all attached images
 * @param {string} id ID of the file
 * @param {string} filePath  File path of the audio file
 */
function updateGroup(id, filePath, success) {
  if (!success) {
    var group = document.querySelector("#pic" + id).parentElement
      .firstElementChild;
    group.className = "question-fail";

    return;
  }

  filePath = getFilename(filePath);
  var folder =
    outputOutputFolder +
    "/" +
    filePath.substr(0, filePath.length - 4) +
    "/" +
    configFiles[outputConfig].fileName;

  fs.readdir(folder, function(err, filenames) {
    if (err) return console.log("Err: " + err);

    var group = document.querySelector("#pic" + id);

    filenames.forEach(filename => {
      if (filename.substr(filename.length - 4) === ".png") {
        var match = filePath.substr(0, filePath.length - 4) + "__";
        if (
          filename.substr(getFilenameIndex(filename) + 1, match.length) ===
          match
        ) {
          group.innerHTML =
            '<h1 id="ttl' +
            generateID(filename) +
            '" onclick="toggleImage(this);">' +
            filename.substr(
              getFilenameIndex(filename) + 1 + match.length,
              filename.length - 4
            ) +
            '</h1><div class="header-content" id="div' +
            generateID(filename) +
            '" style="display: none"><div class="scrollimage"><img src="' +
            folder +
            "/" +
            filename +
            '" alt="' +
            folder +
            "/" +
            filename +
            ' image" /></div></div>' +
            group.innerHTML;
        }
      }
    });
  });
}

/**
 * Creates the loading details for each of the files
 * @param {string} id ID of the file
 * @param {string} filename File path of the audio file
 */
function createLoader(id, filename) {
  document.querySelector("#filename").innerHTML +=
    "<div class='filename-container'>" + getFilename(filename) + "</div>";
  document.querySelector("#filename-analysis").innerHTML +=
    "<div class='filename-analysis' align='center' id='an" + id + "'>???</div>";
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
  //console.log("ID: " + id);
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
  document.querySelector("#an" + id).innerHTML = "<b>Finished<b>";
  success
    ? (document.querySelector("#pb" + id).innerHTML =
        "<div class='cssProgress-bar cssProgress-active-right cssProgress-success' style='width: 100%;'><span class='cssProgress-label'>100%</span></div>")
    : (document.querySelector("#pb" + id).innerHTML =
        "<div class='cssProgress-bar cssProgress-active-right cssProgress-danger' style='width: 100%;'><span class='cssProgress-label'>100%</span></div>");
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
  var button = document.querySelector("#AnalysisSubmit button");
  if (
    analysisList.length > 0 &&
    audioFiles.length > 0 &&
    configFiles[config].fileName !== ""
  ) {
    button.disabled = false;
  } else {
    button.disabled = true;
  }
}

/**
 * Basic loader to display output folder in form on load.
 */
function loadDefaultOutputFolder() {
  //Update html
  outputFolder = DEFAULT_OUTPUT_FOLDER;
  document.querySelector("#outputFolder li").innerHTML = outputFolder;

  //Create folder incase it does not exist
  var fs = require("fs");
  fs.mkdir(outputFolder, { recursive: true }, err => {
    if (err) console.log("Output folder already exists.");
  });
}

/**
 * Asks the user to select a folder. This updates the outputFolder global variable.
 */
function setOutputFolder() {
  dialog.showOpenDialog(
    {
      properties: ["openDirectory", "createDirectory"],
      title: "Select Output Folder"
    },
    function(folder) {
      var content = document.querySelector("#outputFolder .group-content");

      //No folder selected
      if (folder === undefined) {
        failure("outputFolder");
        outputFolder = DEFAULT_OUTPUT_FOLDER;
      } else {
        success("outputFolder");
        outputFolder = folder[0];
      }

      content.lastElementChild.firstElementChild.innerHTML = outputFolder;
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
 * Sort the config selection into alphabetical order
 */
function sortConfig() {
  //Get options from select table and create an array
  var options = document.querySelectorAll("#config-select option");

  var arr = [];
  options.forEach(option => {
    arr.push({ t: option.innerHTML, v: option.value });
  });

  //Sort list alphabetically ignoring case
  arr.sort(function(o1, o2) {
    var t1 = o1.t.toLowerCase(),
      t2 = o2.t.toLowerCase();

    return t1 > t2 ? 1 : t1 < t2 ? -1 : 0;
  });

  //Update options
  for (var i = 0; i < options.length; i++) {
    options[i].value = arr[i].v;
    options[i].innerHTML = arr[i].t;
    options[i].selected = arr[i].t === DEFAULT_CONFIG ? true : false;
  }
}

/**
 * Update Config Selector with config files
 */
function setConfig() {
  var select = document.querySelector("#config-select");

  configFiles.forEach(file => {
    //Create option for config files
    var option = "<option ";
    option += file.fileName === DEFAULT_CONFIG ? "selected " : "";
    option += "value='" + file.id + "'>" + file.fileName + "</option>";
    select.innerHTML += option;

    //Update default config
    config = file.fileName === DEFAULT_CONFIG ? file.id : config;
  });

  sortConfig();
}

/**
 * Get config files for the drop down list. This searches the CONFIG_DIRECTORY recursively until all .yml files are found.
 * @param {string} folder Folder Path. Defaults to CONFIG_DIRECTORY.
 */
function getConfig() {
  //Parallel Recursive Search (https://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search)
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

  //Get Config Files
  walk(CONFIG_DIRECTORY, function(err, results) {
    if (err) throw err;

    results.forEach(filePath => {
      //Check file is .yml
      if (filePath.substr(filePath.length - 4) === ".yml") {
        var filename = getFilename(filePath);
        filename = filename.substr(0, filename.length - 4);

        var file = {};
        file.id = configFiles.length;
        file.filePath = filePath; //Full file path
        file.fileName = filename; //File name minus file extension
        file.extension = filePath.substr(filePath.length - 4);

        configFiles.push(file);
      }
    });

    setConfig();
  });
}

/**
 * Update the config file to use for the final query
 * @param {Element} el Element object
 */
function updateConfig(el) {
  var option = Number(el.querySelector("option:checked").value);

  if (option !== -1) {
    success("config");
  } else {
    failure("config");
  }

  config = option;
  updateAnalyseButton();
}

/**
 * Check the computers environment, if the system is not setup this will provide details.
 */
let count = 0;
function checkEnvironment() {
  var terminalOutput;

  if (IS_WINDOWS) {
    terminalOutput = require("child_process").spawn(AP, ["CheckEnvironment"]);
  } else {
    terminalOutput = require("child_process").spawn("mono", [
      AP,
      "CheckEnvironment"
    ]);
  }

  terminalOutput.on("error", function(err) {
    console.log(err);
    document.querySelector("#environment").style.display = "inherit";
  });

  terminalOutput.stdout.on("data", function(data) {
    const MAX_ENVIRONMENT_OUTPUT = 3;
    count++;
    document.querySelector("#environment .group-content pre").innerHTML +=
      "\n" + data;

    //Third message from terminal contains the success message
    var match = "SUCCESS - Valid environment";

    //Check terminal output for successful environment
    if (data.includes(match)) {
      document.querySelector("#environment").style.display = "none";
    } else {
      if (count >= MAX_ENVIRONMENT_OUTPUT)
        document.querySelector("#environment").style.display = "inherit";
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
    ["outputFolder", false],
    ["audio2csv-options", false],
    ["AnalysisSubmit", false]
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
          "outputFolder",
          "audio2csv-options",
          "AnalysisSubmit"
        ]);
        break;
    }
  });

  //Enable required inputs
  inputList.forEach(id => {
    if (id[1]) {
      document.querySelector("#" + id[0]).style.display = "inherit";
    } else {
      document.querySelector("#" + id[0]).style.display = "none";
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
