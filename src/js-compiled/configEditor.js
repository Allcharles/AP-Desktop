"use strict";

/** Tracks any unsaved changes to the editor. If a person
 * tries to run an analysis with unsaved changes, this
 * should prompt them to save the changes.
 */
var editorChanged = false;
/**
 * Sets editorChanged to true, this disables the analysis button.
 */

function onConfigEditorChange() {
  if (!editorChanged) {
    editorChanged = true;
    updateAnalyseButton();
  }
}
/**
 * When text area loses focus, check if the user has made any changes.
 * If not, set editorChanged to false.
 */


function checkConfigEditorChanges() {
  if (editorChanged) {
    //Check if any changes have occured
    if (document.getElementById("configFileEditor").firstElementChild.value !== configFiles[config].getContents()) {
      //File changes detected, show save file message.
      dialog.showMessageBox({
        message: "Please save any changes to the file before running analysis.",
        buttons: ["OK"]
      });
    } else {
      editorChanged = false;
      updateAnalyseButton();
    }
  }
}
/**
 * Updates the config file editor
 * @param {number} option Config file option selected
 */


function updateConfigEditor(option) {
  console.log("updateConfigEditor");

  if (option === -1) {
    console.log("Nothing to do");
    var editor = document.getElementById("configFileEditor");
    editor.style.display = "none";
    editor.firstElementChild.innerHTML = "";
    return;
  }

  var file = configFiles[option]; //Read and update config editor asynchronously

  fs.readFile(file.getFilePath(), function (err, data) {
    if (err) {
      return console.log(err);
    }

    var editor = document.getElementById("configFileEditor");
    editor.style.display = "inherit";
    editor.firstElementChild.value = data.toString();
  });
}
/**
 * Resets the config settings
 */


function resetConfigOnClick() {
  editorChanged = false;
  updateConfigEditor(config);
  updateAnalyseButton();
}
/**
 * Saves the config settings to a new file
 */


function saveConfigOnClick() {
  var reset = document.getElementById("editTemplateReset"); //Determine if you should show the option to set the template name or save the file

  if (reset.style.display == "none") {
    var input = document.getElementById("editTemplateInput");
    var id;
    var folder;
    var filename;
    var filePath; //If this is a new file

    if (input.value != "") {
      var regex = /^[\w,\s-]+$/m;
      var format = regex.exec(input.value);
      if (format == null) return;
      id = configFiles.length;
      folder = configFiles[config].getFolder();
      filename = configFiles[config].getFilename() + "." + input.value;
      filePath = "".concat(folder).concat(filename, ".yml");
    } else {
      //Save data to old template
      id = configFiles.length;
      folder = configFiles[config].getFolder();
      filename = configFiles[config].getFilename();
      filePath = "".concat(folder).concat(filename, ".yml");
    } //Reset text area changes tracker


    editorChanged = false; //Reset header to hide input and cancel options

    reset.style.display = "inline-flex";
    input.style.display = "none";
    document.getElementById("editTemplateCancel").style.display = "none"; //Rewrite file

    fs.writeFileSync(filePath, document.getElementById("configFileEditor").firstElementChild.value); //If this is a new file

    if (input.value != "") {
      //Add file to config files
      configFiles.push(new ConfigFile(id, folder, filename, ".yml")); //Add file to selection

      var select = document.querySelector("#config-select");

      for (var i = 0; i < select.childElementCount; i++) {
        select[i].selected = "";
      }

      select.innerHTML += "<option value=\"".concat(id, "\" selected>").concat(filename, "</option>");
      sortConfig(); //Update selected config

      config = id;
    }
  } else {
    reset.style.display = "none";
    document.getElementById("editTemplateInput").style.display = "inherit";
    document.getElementById("editTemplateCancel").style.display = "inline-flex";
  }
}
/**
 * Cancels the save operation for the config editor
 */


function cancelConfigOnClick() {
  document.getElementById("editTemplateReset").style.display = "inline-flex";
  document.getElementById("editTemplateCancel").style.display = "none";
  document.getElementById("editTemplateInput").style.display = "none";
}