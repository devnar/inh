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
        echo(`GitHub üzerinde '${fingerprint}.js' dosyasını oluşturun ve dosyanın raw URL'sini buraya girin.`);
    } else {
        const username = rawUrl.split("/")[4];
        inhget(rawUrl);
        document.getElementById("path").innerText = `user@${username}:~$`;
    }
}

function saveRawUrl(rawUrl) {
    const existingUrl = localStorage.getItem("userRawUrl");

    if (existingUrl) {
        const confirmOverwrite = confirm("Bir URL zaten kayıtlı. Yenisiyle değiştirmek istediğinizden emin misiniz?");
        if (!confirmOverwrite) {
            echo("URL değiştirilmedi.");
            return;
        }
    }

    localStorage.setItem("userRawUrl", rawUrl);
    echo("URL başarıyla kaydedildi. Profilin gelmesi için tekrar yükleyin.");
}

document.getElementById("commandInput").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        let inputValue = event.target.value;
        if (!inputValue.trim()) return;
        executeCommand(inputValue);
        event.target.value = "";
    }
});

// Komutları çalıştırma ve hata yakalama
function executeCommand(input) {
    const trimmedInput = input.trim();
    const rawUrl = localStorage.getItem("userRawUrl")
    let output = "";
    let functionCall = "";

    if (trimmedInput.startsWith("https://raw.githubusercontent.com/")) {
        output = "GitHub Raw URL işleme alındı.";
        echo(output);
        saveRawUrl(trimmedInput)
        return;
    }

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

    const username = rawUrl.split("/")[4];
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


// Ekranda çıktı gösterme
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