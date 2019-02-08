var eventList = [];

//Captures submit button and changes onsubmit event
const form = document.querySelector("#form");
form.addEventListener("submit", testing);

function testing(el) {
  el.preventDefault();

  console.log("testing");
}
