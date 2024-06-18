const firebaseConfig = {
    apiKey: "AIzaSyB0I6HaO1o7t66aRmLwN16e4gwL7aWWkAQ",
    databaseURL: "https://algoritmicwar-default-rtdb.firebaseio.com",
};
firebase.initializeApp(firebaseConfig);

function updateUI(user) {
    if (user) {
        firebase.database().ref('users/' + user.uid).on('value', (snapshot) => {
            echo(snapshot.val().username + " Sign in");
            document.getElementById("path").innerText = "user@" + snapshot.val().username + ":~$";
        });
        firebase.database().ref('users/' + user.uid + "/f").on('value', (snapshot) => {
            document.getElementById("initialize").innerHTML = snapshot.val().initialize;
            document.getElementById("editArea").innerText = snapshot.val().initialize;
        });
    } else {
        echo("login pls")
    }
}

function writeUsername(userId, value) {
    firebase.database().ref('users/' + userId).set({
      username: value
    });
}

function writeIntialize(value) {
    firebase.database().ref('users/' + localStorage.getItem("uid") + "/f").set({
        initialize: value
    });
}

function readIntilize() {
    firebase.database().ref('users/' + localStorage.getItem("uid") + "/f").on('value', (snapshot) => {
        echo(snapshot.val().initialize)
    });
}

function nano() {
    echo("<button onclick='saveButton()'>ctrl + s</button> to save");
    document.querySelector("table").style.display = "none";
    document.querySelector("textarea").style.display = "block";
}

function saveButton() {
    if (document.getElementById("editArea").style.display == "block") {
        writeIntialize(document.getElementById("editArea").value);
        document.querySelector("table").style.display = "block";
        document.querySelector("textarea").style.display = "none";
        echo("changes saved and reload...");
        reload()
    }
}

document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 's' && document.getElementById("editArea").style.display == "block") {
        writeIntialize(document.getElementById("editArea").value);
        document.querySelector("table").style.display = "block";
        document.querySelector("textarea").style.display = "none";
        echo("changes saved and reload...");
        reload()
    }
});

function signIn(a, b) {
    var email = a;
    var password = b;
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        var user = userCredential.user;
        localStorage.setItem("uid", user.uid);
      })
      .catch((error) => {
        echo(error.message)
      });
}

function signUp(a, b, c) {
    var email = a;
    var password = b;
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        var user = userCredential.user;
        localStorage.setItem("uid", user.uid);
        writeUsername(user.uid, "username", c);
      })
      .catch((error) => {
        echo(error.message)
      });
}

function signOut() {
    firebase.auth().signOut().then(() => {
        echo("successfully sign out");
      }).catch((error) => {
        echo(error.message);
      });
} 

firebase.auth().onAuthStateChanged(updateUI);

/*  /////////////////  */


document.getElementById("commandInput").focus();

document.body.addEventListener('click', function() {
    document.getElementById("commandInput").focus();
});

document.getElementById("commandInput").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        let inputValue = event.target.value;
        if (!inputValue.trim()) return;
        executeCommand(inputValue);
        event.target.value = "";
    }
});

function executeCommand(input) {
    const trimmedInput = input.trim();

    let output = "";
    let functionCall = "";

    if (trimmedInput.split(" ").length === 1) {
        functionCall = `${trimmedInput}()`;
        output = `Fonksiyon çağrısı oluşturuldu: ${functionCall}`;
    } else {
        const parts = trimmedInput.split(" -");
        if (parts.length > 1) {
            const functionName = parts.shift();
            const parameters = parts;

            functionCall = `${functionName}("${parameters.join('", "')}")`;
            output = `Fonksiyon çağrısı oluşturuldu: ${functionCall}`;
        } else {
            output = "Geçersiz komut.";
        }
    }

    firebase.database().ref("users/" + localStorage.getItem("uid")).on('value', (snapshot) => {
        echo("user@" + snapshot.val().username + ":~$ " + input);
    });

    if (functionCall !== "") {
        try {
            eval(functionCall);
        } catch (error) {
            // Hata durumunda hatayı yakalayın
            echo(`Hata oluştu: ${error.message}`);
        }
    } else {
        echo(output);
    }
}

/*
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}*/

function echo(inputValue, isPin) {
    if (isPin == true || isPin == "true") {
        document.querySelector(".pin").innerHTML = "<br>" + "<span class='command'>" + inputValue + "</span>" + "<br>";
    } else {
        document.querySelector(".messages").innerHTML += "<br>" + "<span class='command'>" + inputValue + "</span>" + "<br>";
        document.getElementById("end").click()
        document.getElementById("commandInput").focus();
    }
}