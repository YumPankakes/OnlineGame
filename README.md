# OnlineGame

The third version in my attempt to make a co-op platformer game using ChatGPT. The server is built with [Express](https://expressjs.com/) and [Socket.IO](https://socket.io/) so it can serve the static game files and support real-time multiplayer features.

## Prerequisites

Before you start, make sure you have the following tools installed:

1. **Node.js and npm** – download from [nodejs.org](https://nodejs.org/). npm ships with Node.
2. **Git** – download from [git-scm.com](https://git-scm.com/). Used to copy this repository and push it to Heroku.
3. **Heroku account** – sign up for a free account at [heroku.com](https://heroku.com/).
4. **Heroku CLI** – download and install the command-line tools from [devcenter.heroku.com/articles/heroku-cli](https://devcenter.heroku.com/articles/heroku-cli). The CLI is required to log in, create the app, and deploy it.

If you are brand new to the command line, install the tools in the order above and accept the default options in each installer.

## Local development

1. **Download the project.** Either clone the repository with Git or download it as a ZIP and extract it.
   ```bash
   git clone <your-fork-or-repo-url>
   cd OnlineGame
   ```
2. **Install dependencies.** This installs Express and Socket.IO so the server can run.
   ```bash
   npm install
   ```
3. **Start the development server.**
   ```bash
   npm start
   ```
4. **Open the game.** In your browser go to [http://localhost:3000](http://localhost:3000).

The server automatically listens on the port provided by the environment (Heroku will set this later), or defaults to `3000` when you run it locally.

## Deploying to a dedicated Heroku server

Follow these steps the first time you deploy. Each step includes the exact commands to type.

1. **Log in to Heroku from the command line.** This opens a browser window for authentication; close the window after it says success.
   ```bash
   heroku login
   ```
2. **Verify that the Heroku CLI sees your login.** This lists the account email address so you know the login worked.
   ```bash
   heroku auth:whoami
   ```
3. **Create a new Heroku app.** Replace `your-app-name` with something unique (only lowercase letters, numbers, and dashes). The `--stack heroku-22` flag ensures you are on the current Node-friendly stack.
   ```bash
   heroku apps:create your-app-name --stack heroku-22
   ```
4. **Switch the web dyno to a dedicated (Standard) plan.** This keeps the dyno running without sleeping. You can change the size later in the Heroku dashboard if you need more power.
   ```bash
   heroku ps:type web=standard-1x --app your-app-name
   ```
   > ⚠️ Heroku will ask you to confirm that you understand this dyno type has a monthly cost. If you prefer the free Eco dynos, skip this step.
5. **Connect your local repository to Heroku.** Run this from the root of the project (where `package.json` and `Procfile` live).
   ```bash
   heroku git:remote -a your-app-name
   ```
6. **Commit any local changes.** Heroku deploys the code from Git. If you downloaded a ZIP, initialize a Git repo first.
   ```bash
   git init          # only if you cloned from a ZIP
   git add .
   git commit -m "Prepare app for Heroku"
   ```
7. **Deploy the app to Heroku.** This pushes the current branch to the `heroku` remote you created above. Heroku runs `npm install` automatically and then uses the `Procfile` to start `node server.js`.
   ```bash
   git push heroku main   # or 'master' if that is your default branch
   ```
8. **Open the game on Heroku.**
   ```bash
   heroku open
   ```
9. **Keep an eye on the logs.** If something goes wrong, this command shows real-time server output.
   ```bash
   heroku logs --tail
   ```

### Updating after the first deploy

1. Make your changes locally.
2. Run `git add .` to stage them.
3. Commit with `git commit -m "Describe your change"`.
4. Deploy the update with `git push heroku main`.

Heroku restarts the dedicated dyno automatically after each deploy. Because the app already listens on the port Heroku assigns (`process.env.PORT`), no extra configuration is required for Socket.IO or Express.

### Optional enhancements

- **Custom domain:** In the Heroku dashboard, open your app → *Settings* → *Domains* to add a custom domain. Update your DNS records to point at the target Heroku provides.
- **HTTPS:** Heroku automatically provisions HTTPS certificates for Heroku-hosted domains and any custom domains you verify.
- **Scaling:** Use `heroku ps:scale web=2` to add more dynos if you need additional capacity.

With these steps, even a complete beginner can get the platformer running on a dedicated Heroku server that stays online and accessible from anywhere.
