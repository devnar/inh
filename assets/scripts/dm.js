function dmHelp() {
    echo("dm")
}

function dm() {
    dmUser.forEach((username) => {
        let rawUrl = localStorage.getItem("userRawUrl");
        const userFingerprint = localStorage.getItem("userFingerprint") + ".js";

        rawUrl = rawUrl.replace(rawUrl.split("/")[3], username);
        rawUrl = rawUrl.replace(userFingerprint, "dm.csv");

        fetch(rawUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error fetching data for ${username}: ${response.statusText}`);
                }
                return response.text();
            })
            .then((data) => {
                const lines = data.split('\n');
                const userMessages = [];

                lines.forEach((line) => {
                    const [user, message] = line.split(',');
                    if (user === username) {
                        userMessages.push(message.trim());
                    }
                });

                if (userMessages.length > 0) {
                    userMessages.forEach((msg) => {
                        echo(`${username}: ${msg}`);
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