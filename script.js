const main = document.querySelector("main");
const result = document.querySelector(".result");

var numberOfFields = 0;
let allFields = [];
function createFields(sqrtNumberOfFields) {
  var gridTemplateValues = "";
  var index = 0;
  for (let line = 0; line < sqrtNumberOfFields; line++) {
    for (let column = 0; column < sqrtNumberOfFields; column++) {
      let div = document.createElement("div");
      div.setAttribute("class", "field");
      div.setAttribute("id", `[${line}][${column}]`);
      main.appendChild(div);
      var item = new field(0, div);
      allFields[index] = item;
      createListeners(item);
      index++;
    }
    gridTemplateValues += " 5vw";
  }
  main.style.gridTemplateColumns = gridTemplateValues;
  main.style.gridTemplateRows = gridTemplateValues;
  numberOfFields = Math.pow(sqrtNumberOfFields, 2);
}

function addBombs(numberOfBombs) {
  let selectedFields = [];
  for (let index = 0; index < numberOfBombs; index++) {
    var newField = allFields[Math.floor(Math.random() * numberOfFields)];
    if (selectedFields.indexOf(newField) == -1) {
      selectedFields.push(newField);
      newField.setAroundBombs("💣");
    } else {
      index--;
    }
  }
  return numberOfBombs;
}

function createListeners(item) {
  element = item.getField();
  item.getField().addEventListener("click", () => {
    revealValue(item, item.getField())
  });
  element.addEventListener("contextmenu", (event) => {
    if (item.getField().innerText == "🚩") {
      item.getField().innerHTML = "";
    } else if (item.getField().innerText == "") {
      item.getField().innerHTML = "🚩";
    }
  });
}

function revealValue(item, div) {
  if (div.innerText == "🚩") {
    div.innerHTML = "";
  } else {
    if(item.getCounted()==false){
      item.setCounted(true);
      verifyVictory(item, div, true);
    }else{
      verifyVictory(item, div, false);
    }
    div.innerText = item.getAroundBombs();
    div.style.background = "rgb(235, 231, 181)";

  }
  if (div.innerText == 0) {
    div.innerText="";
    var indexOfElement = allFields.indexOf(item);
    setTimeout(() => {
      spreadConditionals(item, indexOfElement);
    },100);

  }
}


function calculateAroundBombs() {
  var index = 0;
  for (let line = 0; line < Math.sqrt(numberOfFields); line++) {
    for (let column = 0; column < Math.sqrt(numberOfFields); column++) {
      conditionals(line, column, index, Math.sqrt(numberOfFields));
      index++;
    }
  }
}

function conditionals(line, column, index, sqrtNumberOfFields) {
  var value = 0;
  if (allFields[index].getAroundBombs() != "💣") {
    if (
      line > 0 &&
      allFields[index - sqrtNumberOfFields].getAroundBombs() == "💣"
    ) {
      value++;
    }
    if (
      line < sqrtNumberOfFields - 1 &&
      allFields[index + sqrtNumberOfFields].getAroundBombs() == "💣"
    ) {
      value++;
    }
    if (
      column < sqrtNumberOfFields - 1 &&
      allFields[index + 1].getAroundBombs() == "💣"
    ) {
      value++;
    }
    if (column > 0 && allFields[index - 1].getAroundBombs() == "💣") {
      value++;
    }
    if (line > 0 && column > 0 && allFields[index - sqrtNumberOfFields - 1].getAroundBombs() == "💣") {
      value++;
    }
    if (line > 0 && column < sqrtNumberOfFields - 1 && allFields[index - sqrtNumberOfFields + 1].getAroundBombs() == "💣") {
      value++;
    }
    if (line < sqrtNumberOfFields - 1 && column > 0 && allFields[index + sqrtNumberOfFields - 1].getAroundBombs() == "💣") {
      value++;
    }
    if (line < sqrtNumberOfFields - 1 && column < sqrtNumberOfFields - 1 && allFields[index + sqrtNumberOfFields + 1].getAroundBombs() == "💣") {
      value++;
    }
    allFields[index].setAroundBombs(allFields[index].getAroundBombs() + value);

  }
}

class field {
  setAroundBombs(aroundBombs) {
    this.aroundBombs = aroundBombs;
  }
  setField(field) {
    this.field = field;
  }
  getField() {
    return this.field;
  }
  getAroundBombs() {
    return this.aroundBombs;
  }
  setCounted(counted){
    this.counted=counted;
  }
  getCounted(){
    return this.counted;
  }
  constructor(aroundBombs, field) {
    this.aroundBombs = aroundBombs;
    this.field = field;
    this.counted = false;
  }
}

function spreadConditionals(element, index) {
  lateralIndex = Math.ceil((index + 1) % sqrtNumberOfFields);
  lateralIndex == 0 ? lateralIndex = 9 : "";
  function verifyCounted(element){
    if(element.getCounted()==false){
      revealValue(element, element.getField());
    }}
  if (index < (numberOfFields - sqrtNumberOfFields)) {
    element = allFields[index + sqrtNumberOfFields];
    verifyCounted(element);
  }
  if (index > sqrtNumberOfFields - 1) {
    element = allFields[index - sqrtNumberOfFields];
    verifyCounted(element);
  }
  if (lateralIndex > 1) {
    element = allFields[index - 1];
    verifyCounted(element);
  }
  if (lateralIndex < 9) {
    element = allFields[index + 1];
    verifyCounted(element);
  }
  if (lateralIndex > 1 && index > sqrtNumberOfFields - 1) {
    element = allFields[index - sqrtNumberOfFields - 1];
    verifyCounted(element);
  }
  if (lateralIndex > 1 && index < (numberOfFields - sqrtNumberOfFields)) {
    element = allFields[index + sqrtNumberOfFields - 1];
    verifyCounted(element);
  }
  if (lateralIndex < 9 && index < (numberOfFields - sqrtNumberOfFields)) {
    element = allFields[index + sqrtNumberOfFields + 1];
    verifyCounted(element);
  }
  if (lateralIndex < 9 && index > sqrtNumberOfFields - 1) {
    element = allFields[index - sqrtNumberOfFields + 1];
    verifyCounted(element);
  }
}

function verifyVictory(item, element ,boolean) {
  if (element.innerText == "") {
    if(boolean==true){
    fieldsActive--;}
  } if (fieldsActive - allBombs == 0) {
      result.style.display = "flex";
  }
  if (item.getAroundBombs() == "💣") {
        let span = document.querySelector("span");
        element.style.background="white";
        element.style.border = "1px solid black";
        element.style.borderRadius = "10px";
        element.style.zIndex = "2";
        result.style.display = "flex"; 
        span.innerHTML = "YOU LOSE<BR>";
        span.style.zIndex = "1";
  }

}

createFields(9);
var fieldsActive = numberOfFields;
const sqrtNumberOfFields = Math.sqrt(numberOfFields);
allBombs = addBombs(sqrtNumberOfFields+1);
calculateAroundBombs();

window.addEventListener("contextmenu", (e) => e.preventDefault());
