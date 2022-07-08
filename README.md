<p align="center">
 <a title="Twitter, CC BY 4.0 &lt;https://creativecommons.org/licenses/by/4.0&gt;, via Wikimedia Commons" href="https://commons.wikimedia.org/wiki/File:Twemoji2_1f3d3.svg"><img width="256" alt="Twemoji2 1f3d3" src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Twemoji2_1f3d3.svg/256px-Twemoji2_1f3d3.svg.png"></a>
</p>

<h3 align="center">ft_transcendence</h3>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/42agv/ft_transcendence.svg)](https://github.com/42agv/ft_transcendence/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/42agv/ft_transcendence.svg)](https://github.com/42agv/ft_transcendence/pulls)

</div>

---

<p align="center"> 🏓 Play pong online with your friends in real time
  <br>
</p>

## 📝 Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Deployment](#deployment)
- [Usage](#usage)
- [Built Using](#built_using)
- [Contributing](#contributing)
- [Acknowledgments](#acknowledgement)

## 🧐 About <a name = "about"></a>

The primary purpose of this website is to play pong against other players and show everyone how good you are!

## 🏁 Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [deployment](#deployment) for notes on how to deploy the project on a live system.

### Prerequisites

What things do you need to install the software, and how to install them.

[git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

[docker compose](https://docs.docker.com/compose/install/)

[npm](https://docs.npmjs.com/cli/v7/configuring-npm/install)

[node](https://nodejs.dev/learn/how-to-install-nodejs)

### Installing

A step-by-step series of examples that tell you how to get a development environment running.

Clone the GitHub repository

```
git clone https://github.com/42AGV/ft_transcendence.git
```

Change the current working directory to `transcendence-app`

```
cd ft_transcendence/transcendence-app
```

Copy the `.env.sample` to `.env`

```
cp .env.sample .env
```

Register a new OAuth application on the [42 intranet](https://profile.intra.42.fr/oauth/applications/new)

Set the Redirect URIs

```
http://127.0.0.1:3000/api/v1/auth/login
http://127.0.0.1/api/v1/auth/login
```

Open the `.env` file with your favorite text editor and replace the ID and SECRET with the ones from the OAuth application you create in the previous step

```
FORTYTWO_APP_ID=42-intra-app-id
FORTYTWO_APP_SECRET=42-intra-app-secret
```

Generate two UUIDs using for example the `uuidgen` command

Replace the SESSION_SECRET and the MEMCACHED_SECRET with the UUIDs from the previous step

```
SESSION_SECRET=your-UUID-here
MEMCACHED_SECRET=your-UUID-here
```

Change the working directory to the root directory

```
cd ..
```

Start the application using `Docker`

```
docker compose up -d --build
```

You can now access the web application at http://localhost:3000 and the Swagger documentation for the API at http://localhost:3000/api

Install the node packages required for the web and server application.

```
cd transcendence-app
npm ci
cd ../webapp
npm ci
cd ..
```

A useful command to see the output logs of the Docker containers

```
docker compose logs -f webapp
docker compose logs -f transcendence-app
docker compose logs -f db
```

## 🔧 Running the tests <a name = "tests"></a>

Change the working directory to `webapp` or `transcendence-app`

```
cd webapp
npm t
```

### And coding style tests

Change the working directory to `webapp` or `transcendence-app` and run style check

```
cd transcendence-app
npm run style
```

## 🎈 Usage <a name="usage"></a>

TODO: Add notes about how to use the system.

## 🚀 Deployment <a name = "deployment"></a>

TODO: Add additional notes about how to deploy this on a live system.

## ⛏️ Built Using <a name = "built_using"></a>

- [PostgreSQL](https://www.postgresql.org/) - Database
- [NestJS](https://nestjs.com/) - Server Framework
- [React](https://reactjs.org/) - Web Framework
- [NodeJs](https://nodejs.org/en/) - Server Environment
- [Docker](https://docker.com) - Containerization Platform

## 🤝 Contributing <a name = "contributing"></a>

If you want to contribute to this project you may follow a set of rules.

### 1. Create a new issue or task:

- With every contribution there must be a related issue/task, so if you
don't have any, create a new one on the project board with some
detailed info about what do you want to accomplish.
- Add an appropiate label which describes issue type: `feature`, `bug`,
`task` etc.

### 2. Create a new branch:
   
- ⚠️ We **do not** push to `main`, never. So you'll need to create a branch
to work on it.
- Try to start always from `main` and do not forget to bring
all new changes, preferably with `git pull --rebase` so you don't corrupt
commit history.

### 3. Naming:

- What about branch naming? A good standard way to name could be issue
+ brief description of the task. For example:
`#11/add-contributing-docs`
- We also try to have a **normalized way to name commits**. Because is complicated
to always have great commit messages (despite you should) a good enough 
naming strategy is adding your issue number followd by the message. This way other devs can
keep track of some context of the changes just visiting the related issue
because GitHub will link to it. Try something like:
`#11 / add main contributing points`

### 4. Pull Requests:
    
- When you are ready, you can create a new PR pointing to main. We have defined
two requisites to be able to merge your branch into main:
    - At least **two reviewers approved your changes**
    - You also have **passed all CI checks** (tests, linting etc.)
- In the PR description you should add: `closing #11` (number of related issue) so
when PR gets integrated, issue gets closed automatically
- As with the commits, the ideal is to name it with the issue number followed by a general
description of what is about: `#11 / add contributing documentation`
- Once you pass all these checks, **you are responsible to integrate your changes**.
We have actually two ways: manually or automatically with 
[auto-merge](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/automatically-merging-a-pull-request)
- We've decided to integrate our branches using a `squash` strategy. This let
us to have some freedom when working in our branches. The only requisite is following
`issue_number + short descriptive message` rule in the squash message.
### 5. Conflicts:

- How do I solve conflicts? Most likely, someone merged some commits into `main`
that affect the same files and lines as yours. One of the **cleanest** ways to solve
this is just to update (pull) main in your local and, then, rebase main into
your branch: `git rebase main`. Git will make you solve conflicts one by one,
you just have to follow the instructions!

## 🎉 Acknowledgements <a name = "acknowledgement"></a>

- [The Documentation Compendium](https://github.com/kylelobo/The-Documentation-Compendium)
