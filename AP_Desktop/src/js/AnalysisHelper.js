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
  document.body.onfocus = function() {
    var files = document.querySelector("#audio .group-content");
    files.lastElementChild.style.display = "none";

    if (audioFiles.length == 0) {
      files.firstElementChild.style.display = "inherit";
    }

    document.body.onfocus = null;
  };

  var files = document.querySelector("#audiofiles");
  files.click();
  failure("audio");
  document.querySelector("#audio .group-content ul").style.display = "none";
}

/**
 * Update list of audio files
 * @param {object} el Element object
 */
function updateAudio(el) {
  audioFiles = el.files;

  if (audioFiles.length > 0) {
    success("audio");

    var files = document.querySelector("#audio .group-content");
    files.firstElementChild.style.display = "none";
    files.lastElementChild.style.display = "inherit";
    files.lastElementChild.innerHTML = "";

    for (var file = 0; file < audioFiles.length; file++) {
      files.lastElementChild.innerHTML +=
        '<li class="files">' + audioFiles[file].name + "</li>";
    }
  } else {
    failure("audio");

    var files = document.querySelector("#audio .group-content");
    files.firstElementChild.style.display = "inherit";
    files.lastElementChild.style.display = "none";
    files.lastElementChild.innerHTML = "";
  }
}

/**
 * Get config files for the drop down list
 */
function getConfig() {
  var folder = "C:\\AP\\ConfigFiles";
}

/**
 * Check the computers environment, if the system is not setup this will provide details.
 */
function checkEnvironment() {
  var terminal = require("child_process").spawn("AnalysisPrograms.exe", [
    "CheckEnvironment"
  ]);

  terminal.on("error", function(err) {
    document.querySelector("#environment").style.display = "inherit";
  });

  terminal.stdout.on("data", function(data) {
    var match = "SUCCESS - Valid environment";

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
