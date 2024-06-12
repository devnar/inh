const firebaseConfig = {
    apiKey: "AIzaSyB0I6HaO1o7t66aRmLwN16e4gwL7aWWkAQ",
    authDomain: "https://algoritmicwar.firebaseapp.com/__/auth/handler",
};
firebase.initializeApp(firebaseConfig);

var provider = new firebase.auth.GithubAuthProvider();
firebase
  .auth()
  .signInWithPopup(provider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;
    var token = credential.accessToken;

    // The signed-in user info.
    var user = result.user;
    echo(user)
  }).catch((error) => {
    echo(error.message)
});

/* /// */
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

    echo(`user@localhost:~$ ${input}`);

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

function echo(inputValue) {
    document.querySelector(".messages").innerHTML += "<br>" + "<span class='command'>" + inputValue + "</span>" + "<br>";
}