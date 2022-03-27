var socket;
var connected = false;
var willConnect = false;

var host = "localhost";
var port = 12000;
var loginForm;

var printerName;
var comandoString;

var session = false;

var popUp = new bootstrap.Toast(document.getElementById("liveToast"));

$("#host").on("change", () => {
  host = $("#host").val();
  console.log(host);
});

$("#port").on("change", () => {
  port = $("#port").val();
  console.log(port);
});

$("#conectar").on("click", () => {
  if (!session) {
    willConnect = true;
    handleLog();
  } else {
    startSioConnection();
  }
});

$("#logInOutBtn").on("click", () => {
  willConnect = false;
  handleLog();
});

$("#sendPrintersBtn").on("click", () => {
  socket.emit("sendPrinters");
});

$("#back-to-fb").on("click", () => {
  window.open(`http://${host}:${port}`, "other");
});


$("#submitForm").submit(function (event) {
  event.preventDefault();
});

$('#requestClients').on('click', () => {
    console.log("#requestClients");
    socket.emit('request_clients_list', (clients) => {
        console.log(clients);
    });
})

function startSioConnection() {
  if (connected) {
    socket.disconnect();
    drawLogStatus();
  } else {
    socket = ConectarSio(host, port, session.username, session.password);
    socket.on("connect", () => drawLogStatus());
  }
}

function loadLogin() {
  let localSession = localStorage.getItem("user");
  if (localSession) {
    console.log("Hay un usuario guardado: ", localSession);
    session = JSON.parse(localSession);
    drawLogStatus();
  } else {
    session = false;
    drawLogStatus();
  }
}

function popLoginForm() {
  loginForm = new bootstrap.Modal(document.getElementById("loginModal"));
  loginForm.show();
}

function handleLog() {
  if (!session) {
    popLoginForm();
  } else {
    session = localStorage.removeItem("user");
    drawLogStatus();
  }
}

function handleSubmit() {
  let username = $("#usernameInput").val();
  let password = $("#passwordInput").val();

  let user = {
    username: username,
    password: password,
  };

  console.log(username, password);
  localStorage.setItem("user", JSON.stringify(user));
  session = user;
  console.log(user);

  loginForm.hide();

  if (willConnect) {
    startSioConnection();
  }
  drawLogStatus();
}

function drawLogStatus() {
  if (session && connected) {
    $("#logInOutBtn").html("Log Out");
    $("#logInOutBtn").prop("disabled", true);
  } else if (!session) {
    $("#logInOutBtn").html("Log In");
  } else if (session && !connected) {
    $("#logInOutBtn").html("Log Out");
    $("#logInOutBtn").prop("disabled", false);
  }
}



loadLogin();
