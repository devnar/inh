function help() {
    echo("CALL &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Calls one batch program from another.<br>CD&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Displays the name of or changes the current directory.<br>CLS &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Clears the screen.<br>COLOR &nbsp;&nbsp;&nbsp;&nbsp;Sets the default console foreground and background colors.<br>COPY &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Copies one or more files to another location.<br>DATE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Displays or sets the date.<br>DEL &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Deletes one or more files.<br>DIR &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Displays a list of files and subdirectories in a directory.<br>ECHO &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Displays messages, or turns command echoing on or off.<br>FIND &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Searches for a text string in a file or files.<br>GOTO &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Directs the Windows command interpreter to a labeled line in a Web Site.<br>MD&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Creates a directory.<br>MOVE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Moves one or more files from one directory to another directory.<br>RD&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Removes a directory.<br>RENAME&nbsp;&nbsp;&nbsp;&nbsp;Renames a file or files.<br>REPLACE&nbsp;&nbsp;&nbsp;Replaces files.<br>SORT &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Sorts input.<br>INFO&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Displays machine specific properties and configuration.<br>TIME &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Displays or sets the system time.<br>TREE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Graphically displays the directory structure of a drive or path.<br><br>For more information on tools see the command-line reference in the online help.");
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

function color(a) {
    echo("terminal rengi " +  a + " olarak ayarlandı");
    document.querySelector(".content").style.color = a;
}

function sget(url) {
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