function dmHelp() {
    echo("Use the dm command to check your inbox. Write your new messages to inh-user/dm.csv on github");
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