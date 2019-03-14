/**
 * Updates the config file editor
 * @param {number} option Config file option selected
 */
function updateConfigEditor(option) {
  console.log("updateConfigEditor");
  if (option === -1) {
    console.log("Nothing to do");
    let editor = document.getElementById("configFileEditor");
    editor.style.display = "none";
    editor.firstElementChild.innerHTML = "";
    return;
  }

  let file = configFiles[option];

  //Read and update config editor asynchronously
  fs.readFile(file.filePath, function(err, data) {
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
  updateConfigEditor(config);
}

/**
 * Saves the config settings to a new file
 */
function saveConfigOnClick() {
  console.log("Save Config Editor");
}
