function help(script) {
    if(!script) {
        echo("I'm Not Hacker [V 3.0] (c) NAR.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br><br>CLS &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Clears the screen.<br>COLOR &nbsp;&nbsp;&nbsp;&nbsp;Sets the default console foreground and background colors.<br>DATE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Displays or sets the date.<br>ECHO &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Displays messages, or turns command echoing on or off.<br>GOTO &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Directs the Windows command interpreter to a labeled line in a Web Site.<br>INHGET&nbsp;&nbsp;&nbsp;&nbsp;Upload and run codes from github or anywhere.<br>RELOAD&nbsp;&nbsp;&nbsp;&nbsp;Restarts the console.<br>TIME &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Displays or sets the system time.<br><br>For more information on tools see the command-line reference in the online help.");
    } else {
        eval(`${script}Help()`)
    }
}

function cls() {
    document.querySelector(".messages").innerHTML = "";
}

function date() {
    const today = new Date();
    let month = today.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    echo(today.getDate() + "." + month + "." + today.getFullYear())
}

function time() {
    const today = new Date();
    echo(today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds())
}

function reload() {
   window.location.reload()
}

function color(a) {
    document.querySelector(".content").style.color = a;
    document.querySelector(".input-box").style.color = a;
    document.querySelector("#path").style.color = a;
}

function inhget(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var script = document.createElement('script');
            script.innerHTML = xhr.responseText;
            document.body.appendChild(script);
        }
    };
    xhr.send();
}

function dm() {
    dmUser.forEach((u) => {
        let rawUrl = localStorage.getItem("userRawUrl");
        const username = rawUrl.split("/")[3];
        const userFingerprint = localStorage.getItem("userFingerprint") + ".js";

        rawUrl = rawUrl.replace(rawUrl.split("/")[3], u);
        rawUrl = rawUrl.replace(userFingerprint, "dm.csv");

        fetch(rawUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error fetching data for ${u} ${response.statusText}`);
                }
                return response.text();
            })
            .then((data) => {
                const lines = data.split('\n');
                const userMessages = [];

                lines.forEach((line) => {
                    const [user, message] = line.split(',');
                    if (user === username || user === "all") {
                        userMessages.push(message.trim());
                    }
                });

                if (userMessages.length > 0) {
                    userMessages.forEach((msg) => {
                        echo(`${u}: ${msg}`);
                    });
                } else {
                    echo(`No messages found for ${username}`);
                }
            })
            .catch((error) => {
                echo(error);
            });
    });
}