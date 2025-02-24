
let usernameID;
let passwordID;
let submitLoginBtn;

let loginElementsCreated = false; // flag to check if login elements are created or not

function drawLogin() {
  background(230);


  fill(50);
  textSize(48);
  textFont("Comic Sans MS");
  text("Login", width / 2, 150);

 
  if (!loginElementsCreated) {
    createLoginElements();
    loginElementsCreated = true;
  }
}


function createLoginElements() {

  usernameID = createInput("");
  usernameID.attribute("placeholder", "Username");
  usernameID.position(width / 2 - 100, 300);
  usernameID.size(200);


  passwordID = createInput("", "password");
  passwordID.attribute("placeholder", "Password");
  passwordID.position(width / 2 - 100, 350);
  passwordID.size(200);


  submitLoginBtn = createButton("Login");
  submitLoginBtn.position(width / 2 - 50, 400);
  submitLoginBtn.mousePressed(handleLogin);
}


function handleLogin() {
  let username = usernameID.value();
  let password = passwordID.value();
  console.log("Login attempted with:", username, password);


  mode = Mode.title;


  removeLoginElements();
}


function removeLoginElements() {
  if (usernameID) {
    usernameID.remove();
    usernameID = null;
  }
  if (passwordID) {
    passwordID.remove();
    passwordID = null;
  }
  if (submitLoginBtn) {
    submitLoginBtn.remove();
    submitLoginBtn = null;
  }
  loginElementsCreated = false;
}

