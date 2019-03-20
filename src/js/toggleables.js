/**
 * Toggles visibility to the output image
 * @param el {HTMLElement} Title element
 */
function toggleImage(el) {
  let img = document.querySelector("#div" + el.id.substr(3));

  img.style.display === "none"
    ? (img.style.display = "inherit")
    : (img.style.display = "none");
}

/**
 * Toggles visibility to the terminal output. This also removes the whitespace from the bottom of the group object.
 * @param el {HTMLElement} Title element
 */
function toggleTerminal(el) {
  let terminal = document.querySelector("#div" + el.id.substr(3));
  let parent = terminal.parentElement;

  if (terminal.style.display === "none") {
    terminal.style.display = "inherit";
    parent.style.marginBottom = "0px";
  } else {
    terminal.style.display = "none";
    parent.style.marginBottom = "-28px";
  }
}

/**
 * Toggles visibility for the files group content div
 * @param {HTMLElement} el Header element
 */
function toggleHeader(el) {
  let body = el.parentElement.lastElementChild;

  body.style.display === "none"
    ? (body.style.display = "inherit")
    : (body.style.display = "none");
}

/**
 * Toggles disability property of associated input. Associated input id is the same id as el plus '-input'.
 * Eg. el id="test", associated input id = "test-input".
 * @param {HTMLElement} el Checkbox which toggles editability of associated input
 */
function toggleInput(el) {
  let id = `${el.id}-input`;

  //If item is checked, enable input. Else disable
  el.checked
    ? (document.getElementById(id).disabled = false)
    : (document.getElementById(id).disabled = true);
}
