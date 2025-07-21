# 🧠 INH Terminal – *I'm Not Hacker*

**INH** (short for *I'm Not Hacker*) is an open-source, modern, and modular terminal platform for developers. It allows you to run JavaScript-based terminal mini-apps through a simple CLI and server infrastructure.

🎯 **Goal**
To provide a platform where developers can create, share, and run their own terminal tools — similar to `npm`, `pip`, or `cargo` — but focused exclusively on **JavaScript terminal packages**.

---

## 🚀 Features

* 🔌 **Modular Architecture**: Packages are fetched from GitHub as `.zip` files and executed in your terminal.
* 🗃️ **Package Management**: Manage apps using intuitive commands like `install`, `uninstall`, `run`, `upload`, `list`, `status`, and `update`.
* 🌐 **Firebase-Backed Server**: Uses Firebase Realtime Database for persistent, cloud-hosted package records.
* 🛠️ **Self-Updating CLI**: Keep the CLI up to date using `inh update`.
* 📦 **Custom Terminal Apps**: Easily create and share your own JavaScript-based terminal tools.
* 🪄 **Simple Package Format**: Each package only needs an `inh.json` file for configuration.

---

## 💻 CLI Commands

```bash
inh install <package>      # Download and install a package
inh run <package>          # Run a previously installed package
inh uninstall <package>    # Remove a package from your system
inh list [--my|--all]      # List installed or available packages
inh upload <github-url>    # Upload a new package to the central registry
inh update                 # Update the CLI tool itself
inh status                 # Check server availability and stats
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
