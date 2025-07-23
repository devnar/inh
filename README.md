# 🧠 INH Terminal – *I'm Not Hacker*

**INH** (short for *I'm Not Hacker*) is an open-source, modern, and modular terminal platform for developers. It allows you to run JavaScript-based terminal mini-apps through a simple CLI and server infrastructure.

🎯 **Goal**
To provide a platform where developers can create, share, and run their own terminal tools — similar to `npm`, `pip`, or `cargo` — but focused exclusively on **JavaScript terminal packages**.

---

## 🚀 Features

* 🔌 **Modular Architecture**: Packages are fetched from GitHub as `.zip` files and executed in your terminal.
* 🗃️ **Package Management**: Manage apps using intuitive commands like `install`, `uninstall`, `dev`, `upload`, `list` and `update`.
* 🌐 **Firebase-Backed Server**: Uses Firebase Realtime Database for persistent, cloud-hosted package records.
* 🛠️ **Self-Updating CLI**: Keep the CLI up to date using `inh update`.
* 📦 **Custom Terminal Apps**: Easily create and share your own JavaScript-based terminal tools.
* 🪄 **Simple Package Format**: Each package only needs an `package.json` file for configuration.

---

## 💻 CLI Commands

```bash
dev <folderPath>        # Run a local INH package from a folder path
install|i <name>        # Download and install a package by name
list [options]          # List packages
status                  # Check if the remote registry server is online
uninstall|u <name>      # Remove an installed package
update                  # Update the CLI script from the GitHub source
upload <githubRepoUrl>  # Upload a package to the registry using a GitHub repo URL
```

---

## ✨ Contribute

INH is an open-source, community-driven project. New commands, ideas, and pull requests are always welcome!

```bash
git clone https://github.com/devnar/inh
cd inh
npm install
npm link
```
