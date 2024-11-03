function getBrowserFingerprint() {
    const userAgent = navigator.userAgent;
    const language = navigator.language || navigator.userLanguage;
    const screenResolution = `${screen.width}x${screen.height}`;
    const colorDepth = screen.colorDepth;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const platform = navigator.platform;

    const fingerprint = userAgent + language + screenResolution + colorDepth + timezone + platform;
    return hash(fingerprint);
}

function hash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0;
    }
    return hash.toString();
}

function saveFingerprint() {
    const fingerprint = getBrowserFingerprint();
    localStorage.setItem("userFingerprint", fingerprint);
    return fingerprint;
}

function getFingerprint() {
    return localStorage.getItem("userFingerprint") || saveFingerprint();
}

function login() {
    const rawUrl = localStorage.getItem("userRawUrl");
    
    if (!rawUrl) {
        const fingerprint = getFingerprint();
        echo(`Create '${fingerprint}.js' file in the "inh-user" repo on GitHub and enter your GitHub username there.`);
    } else {
        const username = rawUrl.split("/")[3];
        inhget(rawUrl);
        document.getElementById("path").innerText = `user@${username}:~$`;
    }
}

function saveRawUrl(user) {
    const existingUrl = localStorage.getItem("userRawUrl");
    const fingerprint = getFingerprint();

    if (existingUrl) {
        const confirmOverwrite = confirm("A URL is already saved. Are you sure you want to replace it with a new one?");
        if (!confirmOverwrite) {
            echo("URL was not changed.");
            return;
        }
    }

    localStorage.setItem("userRawUrl", `https://raw.githubusercontent.com/${user}/inh-user/refs/heads/main/${fingerprint}.js`);
    echo("URL saved successfully. Reload to see your profile.");
}

document.getElementById("commandInput").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        let inputValue = event.target.value;
        if (!inputValue.trim()) return;
        executeCommand(inputValue);
        event.target.value = "";
    }
});

// Execute commands and catch errors
function executeCommand(input) {
    const trimmedInput = input.trim();
    const rawUrl = localStorage.getItem("userRawUrl")
    let output = "";
    let functionCall = "";
    
    if (!rawUrl) {
        saveRawUrl(trimmedInput)
        return;
    }

    if (trimmedInput.split(" ").length === 1) {
        functionCall = `${trimmedInput}()`;
        output = `Function call created: ${functionCall}`;
    } else {
        const parts = trimmedInput.split(" -");
        if (parts.length > 1) {
            const functionName = parts.shift();
            const parameters = parts;
            functionCall = `${functionName}("${parameters.join('", "')}")`;
            output = `Function call created: ${functionCall}`;
        } else {
            output = "Invalid command.";
        }
    }

    const username = rawUrl.split("/")[3];
    echo(`user@${username}:~$ ${input}`);

    if (functionCall !== "") {
        try {
            eval(functionCall);
        } catch (error) {
            echo(error.message);
        }
    } else {
        echo(output);
    }
}

// Display output on screen
function echo(inputValue, isPin) {
    if (isPin === true || isPin === "true") {
        document.querySelector(".pin").innerHTML =
            "<br>" + "<pre class='command'>" + inputValue + "</pre>" + "<br>";
    } else {
        document.querySelector(".messages").innerHTML +=
            "<br>" + "<span class='command'>" + inputValue + "</span>" + "<br>";
        document.getElementById("end").click();
        document.getElementById("commandInput").focus();
    }
}


document.getElementById("commandInput").focus();
document.body.addEventListener("click", function () {
    document.getElementById("commandInput").focus();
});
getFingerprint();
login();
