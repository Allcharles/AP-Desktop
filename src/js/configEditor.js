/**
 * Updates the config file editor
 * @param {number} option Config file option selected
 */
function updateConfigEditor(option) {
  if (option === -1) {
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
    editor.firstElementChild.innerHTML = data.toString();
  });
}

/**
 * Resets the config settings
 */
function resetConfigOnClick() {
  console.log("Reset Config Editor");
  updateConfigEditor(config);
}

/**
 * Saves the config settings to a new file
 */
function saveConfigOnClick() {
  console.log("Save Config Editor");
}
