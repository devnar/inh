function answer(a) {
    if (a.toLowerCase() == "help") {
        sendCommand("$tree<br>$cls<br>$echo<br>$cd (file)<br>$color (color name)");
    }else if (a != "") {
        sendCommand("'" + a + "' is not recognized as an internal or external command, operable program or batch file.");
    }
}