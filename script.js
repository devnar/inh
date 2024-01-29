function handleInput(event) {
    if (event.keyCode === 13) {
        sendCommand(document.getElementById("path").textContent + event.target.value);
        answer(event.target.value)
        event.target.value = '';
    }
}

function answer(a) {
    if (a == "help") {
        sendCommand("$tree<br>$cls<br>$echo<br>$cd (file)<br>$color (color name)")
    }
    else if (a == "cls") {
        document.querySelector('.messages').innerHTML = ""
    }
    else if (a == "tree") {
        sendCommand("PC<br>├───.data<br>├───.attack<br>│&nbsp;&nbsp;  └─worm.exe<br>└───.defence")
    }
    else if (a.substring(0, 5) == "color") {
        document.querySelector('.content').style.color = a.substring(6);
    }
    else if (a.substring(0, 4) == "echo") {
        sendCommand(a.substring(5))
    }
    else if (a.substring(0, 2) == 'cd') {
        if (a.substring(3) == "User") {
            document.getElementById("path").innerText = "C:/User>";
        } else if (a.substring(3) == ".attack") {
            document.getElementById("path").innerText = "C:/User/.attack>";
        } else if (a.substring(3) == ".defence") {
            document.getElementById("path").innerText = "C:/User/.defence>";
        } else if (a.substring(3) == ".data") {
            document.getElementById("path").innerText = "C:/User/.data>";
        } else {
            sendCommand("The system cannot find the path specified.")
        }
    }
    else if(a != "") {
        sendCommand("'" + a + "' is not recognized as an internal or external command, operable program or batch file.")
    }
}

function sendCommand(inputValue) {
    const newLine = document.createElement('br');
    const commandSpan = document.createElement('span');
    commandSpan.classList.add('command');
    commandSpan.innerHTML = inputValue;
    document.querySelector('.messages').appendChild(newLine);
    document.querySelector('.messages').appendChild(commandSpan);
}