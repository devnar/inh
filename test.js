function extension(b) {
    if (b.toLowerCase() == "dice") {
        sendMessage(Math.floor(Math.random() * 7)+1);
    } else if (b != "") {
        sendMessage("'" + b + "' is not recognized as an internal or external command, operable program or batch file.");
    }
}