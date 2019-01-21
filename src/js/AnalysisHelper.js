const electron = require("electron");
const dialog = electron.remote.dialog;
const { ipcRenderer } = electron;
const SUPPORTED_AUDIO_FORMATS = ["wav"];
const AP = "AnalysisPrograms.exe";

var analysisList = [];
var audioFiles = [];

function submitForm(e) {
  e.preventDefault();
  const item = form.querySelectorAll("input[name='analysis']:checked");

  if (item.length !== 0) {
    success("audio");
  } else {
    failure("audio");
  }
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
  var fs = reqiure("fs");
  var folder = "C:\\AP\\ConfigFiles";
}

/**
 * Check the computers environment, if the system is not setup this will provide details.
 */
function checkEnvironment() {
  var terminal = require("child_process").spawn(AP, ["CheckEnvironment"]);

  terminal.on("error", function(err) {
    document.querySelector("#environment").style.display = "inherit";
  });

  terminal.stdout.on("data", function(data) {
    var match = "SUCCESS - Valid environment";

    //Check terminal output for successful environment
    if (data.includes(match)) {
      document.querySelector("#select").style.display = "inherit";
      document.querySelector("#environment").style.display = "none";
    } else {
      document.querySelector("#select").style.display = "none";
      document.querySelector("#environment").style.display = "inherit";

      document.querySelector("#environment .group-content pre").innerHTML +=
        "\n" + data;
    }
  });
}

/**
 * Determines what inputs are required to complete the analysis
 * @param {object} el Element object
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
