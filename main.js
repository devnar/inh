function answer(a) {
    if (a.toLowerCase() == "help") {
        sendMessage("CALL&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Calls&nbsp;one&nbsp;batch&nbsp;program&nbsp;from&nbsp;another.<br>CD&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Displays&nbsp;the&nbsp;name&nbsp;of&nbsp;or&nbsp;changes&nbsp;the&nbsp;current&nbsp;directory.<br>CLS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Clears&nbsp;the&nbsp;screen.<br>COLOR&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Sets&nbsp;the&nbsp;default&nbsp;console&nbsp;foreground&nbsp;and&nbsp;background&nbsp;colors.<br>COMP&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Compares&nbsp;the&nbsp;contents&nbsp;of&nbsp;two&nbsp;files&nbsp;or&nbsp;sets&nbsp;of&nbsp;files.<br>COPY&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Copies&nbsp;one&nbsp;or&nbsp;more&nbsp;files&nbsp;to&nbsp;another&nbsp;location.<br>DATE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Displays&nbsp;or&nbsp;sets&nbsp;the&nbsp;date.<br>DEL&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Deletes&nbsp;one&nbsp;or&nbsp;more&nbsp;files.<br>DIR&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Displays&nbsp;a&nbsp;list&nbsp;of&nbsp;files&nbsp;and&nbsp;subdirectories&nbsp;in&nbsp;a&nbsp;directory.<br>ECHO&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Displays&nbsp;messages,&nbsp;or&nbsp;turns&nbsp;command&nbsp;echoing&nbsp;on&nbsp;or&nbsp;off.<br>EXIT&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Quits&nbsp;the&nbsp;CMD.EXE&nbsp;program&nbsp;(command&nbsp;interpreter).&nbsp;differences&nbsp;between&nbsp;them.<br>FIND&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Searches&nbsp;for&nbsp;a&nbsp;text&nbsp;string&nbsp;in&nbsp;a&nbsp;file&nbsp;or&nbsp;files.<br>GOTO&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Directs&nbsp;the&nbsp;Windows&nbsp;command&nbsp;interpreter&nbsp;to&nbsp;a&nbsp;labeled&nbsp;line&nbsp;in&nbsp;a&nbsp;batch&nbsp;program.<br>MD&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Creates&nbsp;a&nbsp;directory.<br>MOVE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Moves&nbsp;one&nbsp;or&nbsp;more&nbsp;files&nbsp;from&nbsp;one&nbsp;directory&nbsp;to&nbsp;another&nbsp;directory.<br>PUSHD&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Saves&nbsp;the&nbsp;current&nbsp;directory&nbsp;then&nbsp;changes&nbsp;it.<br>RD&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Removes&nbsp;a&nbsp;directory.<br>RENAME&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Renames&nbsp;a&nbsp;file&nbsp;or&nbsp;files.<br>REPLACE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Replaces&nbsp;files.<br>SORT&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Sorts&nbsp;input.<br>START&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Starts&nbsp;a&nbsp;separate&nbsp;window&nbsp;to&nbsp;run&nbsp;a&nbsp;specified&nbsp;program&nbsp;or&nbsp;command.<br>SYSTEMINFO&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Displays&nbsp;machine&nbsp;specific&nbsp;properties&nbsp;and&nbsp;configuration.<br>TIME&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Displays&nbsp;or&nbsp;sets&nbsp;the&nbsp;system&nbsp;time.<br>TREE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Graphically&nbsp;displays&nbsp;the&nbsp;directory&nbsp;structure&nbsp;of&nbsp;a&nbsp;drive&nbsp;or&nbsp;path.<br><br>For&nbsp;more&nbsp;information&nbsp;on&nbsp;tools&nbsp;see&nbsp;the&nbsp;command-line&nbsp;reference&nbsp;in&nbsp;the&nbsp;online&nbsp;help.");
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