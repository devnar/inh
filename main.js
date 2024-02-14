function answer(a) {
    if (a.toLowerCase() == "help") {
        sendMessage("$tree<br>$cls<br>$echo<br>$cd (file)<br>$color (color name)");
    } else if (a.toLowerCase() == "cls") {
        document.querySelector(".messages").innerHTML = "";
    } else if (a.toLowerCase() == "tree") {
        sendMessage("PC<br>├───.data<br>├───.attack<br>│&nbsp;&nbsp;  └─worm.exe<br>└───.defence");
    } else if (a.toLowerCase().substring(0, 5) == "color") {
        sendMessage("terminal rengi " +  a.substring(6) + " olarak ayarlandı");
        document.querySelector(".content").style.color = a.substring(6);
    } else if (a.toLowerCase().substring(0, 4) == "echo") {
        sendMessage(a.substring(5));
    } else if (a.toLowerCase().substring(0, 2) == "cd") {
        if (a.substring(3) == "User") {
            document.getElementById("path").innerText = "C:/User>";
        } else if (a.substring(3) == ".attack") {
            document.getElementById("path").innerText = "C:/User/.attack>";
        } else if (a.substring(3) == ".defence") {
            document.getElementById("path").innerText = "C:/User/.defence>";
        } else if (a.substring(3) == ".data") {
            document.getElementById("path").innerText = "C:/User/.data>";
        } else {
            sendMessage("The system cannot find the path specified.");
        }
    } else if (a != "") {
        sendMessage("'" + a + "' is not recognized as an internal or external command, operable program or batch file.");
    }
}