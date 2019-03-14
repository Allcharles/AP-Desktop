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
    const regex = /^[\w,\s-]+$/m;
    let format = regex.exec(input.value);
    if (format == null) return;

    reset.style.display = "inline-flex";
    input.style.display = "none";
    document.getElementById("editTemplateCancel").style.display = "none";

    let id = configFiles.length;
    let folder = configFiles[config].getFolder();
    let filename = configFiles[config].getFilename() + "." + input.value;
    let filePath = `${folder}${filename}.yml`;

    fs.writeFileSync(
      filePath,
      document.getElementById("configFileEditor").firstElementChild.value
    );

    //Add file to config files
    configFiles.push(new ConfigFile(id, folder, filename, ".yml"));

    //Add file to selection
    let select = document.querySelector("#config-select");
    for (let i = 0; i < select.childElementCount; i++) {
      select[i].selected = "";
    }
    select.innerHTML += `<option value="${id}" selected>${filename}</option>`;
    sortConfig();
    config = id;
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
