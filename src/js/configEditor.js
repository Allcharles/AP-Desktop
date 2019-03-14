/** Tracks any unsaved changes to the editor. If a person
 * tries to run an analysis with unsaved changes, this
 * should prompt them to save the changes.
 */
let editorChanged = false;

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
  fs.readFile(file.getFilePath(), function(err, data) {
    if (err) {
      return console.log(err);
    }

    let editor = document.getElementById("configFileEditor");
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
  let reset = document.getElementById("editTemplateReset");

  //Determine if you should show the option to set the template name or save the file
  if (reset.style.display == "none") {
    let input = document.getElementById("editTemplateInput");
    let id;
    let folder;
    let filename;
    let filePath;

    //If this is a new file
    if (input.value != "") {
      const regex = /^[\w,\s-]+$/m;
      let format = regex.exec(input.value);
      if (format == null) return;

      id = configFiles.length;
      folder = configFiles[config].getFolder();
      filename = configFiles[config].getFilename() + "." + input.value;
      filePath = `${folder}${filename}.yml`;
    } else {
      //Save data to old template
      id = configFiles.length;
      folder = configFiles[config].getFolder();
      filename = configFiles[config].getFilename();
      filePath = `${folder}${filename}.yml`;
    }

    //Reset header to hide input and cancel options
    reset.style.display = "inline-flex";
    input.style.display = "none";
    document.getElementById("editTemplateCancel").style.display = "none";

    //Rewrite file
    fs.writeFileSync(
      filePath,
      document.getElementById("configFileEditor").firstElementChild.value
    );

    //If this is a new file
    if (input.value != "") {
      //Add file to config files
      configFiles.push(new ConfigFile(id, folder, filename, ".yml"));

      //Add file to selection
      let select = document.querySelector("#config-select");
      for (let i = 0; i < select.childElementCount; i++) {
        select[i].selected = "";
      }
      select.innerHTML += `<option value="${id}" selected>${filename}</option>`;
      sortConfig();

      //Update selected config
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
