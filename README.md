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

[make](https://www.gnu.org/software/make/)

> **_NOTE:_**  make is optional, but you may find that having it greatly simplifies your life.

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

Copy the `.env.sample` to `.env.development`

```
cp .env.sample .env.development
```

Register a new OAuth application on the [42 intranet](https://profile.intra.42.fr/oauth/applications/new)

Set the Redirect URIs

```
http://localhost:3000/api/v1/auth/login
http://localhost/api/v1/auth/login
```

Open the `.env.development` file with your favorite text editor and replace the ID and SECRET with the ones from the OAuth application you create in the previous step

```
FORTYTWO_APP_ID=42-intra-app-id
FORTYTWO_APP_SECRET=42-intra-app-secret
```

Change the working directory to the root directory

```
cd ..
```

Generate the generated files, that are not a part of the repository:

```shell
make gen
```
or
```shell
./scripts/generate-openapi.sh [options]
```
> **_NOTE:_**  You can see a help panel for this script if you pass to it a `--help` or `-h` option.

Start the application using `Docker`

```
docker compose up -d --build
```
> **_NOTE:_**  If you are using Docker Compose V1, replace the `docker compose` commands with `docker-compose` (with a hyphen)

or
```shell
make all
```
> **_NOTE:_**  `make all` will dispatch to the right docker-compose executable, and will also generate the files for you if you haven't run `make gen` in the previous step

You can now access the web application at http://localhost:3000 and the Swagger documentation for the API at http://localhost:3000/api

Install the node packages required for the web and server application.

```
cd transcendence-app
npm ci
cd ../webapp
npm ci
cd ..
```

Some useful commands to see the output logs of the Docker containers

```
docker compose logs -f webapp
docker compose logs -f transcendence-app
docker compose logs -f db
```
or their make counterparts:
```shell
make log-wa
make log-tr
make log-db
```

> **_NOTE:_**  The logs of the transcendence-app don't include the version in the routes

> **_NOTE:_**  For advanced use cases, you can connect to a service using the Docker container IP and port 

Inspect the container using the container name or ID

```
docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' ft_transcendence-webapp-1
```
or its make counterpart
```shell
make get-ip
```

Access using the Docker container IP and the service port

After a config file change, please run the following command to recreate the images, renew anonymous volumes and restart the Docker containers

```
docker compose up --build -d -V
```
or its make counterpart
```shell
make re
```

### OpenAPI

We use Swagger to autogenerate the OpenAPI specification `transcendence-app/swagger-spec.yaml` file. This file is generated automatically by the transcendence-app at startup whenever the OpenAPI spec changes, or manually upon running the `./scripts/generate-openapi.sh` script or equivalent `make` rules as described below.

#### generate-openapi

We use OpenAPI Generator to autogenerate the files at `webapp/src/shared/generated` from the `swagger-spec.yaml`.

Please don't modify these files manually.

If you change code that impacts the swagger specs in transcendence-app, you will have to regenerate the generated files. The file `swagger-spec.yaml` will update itself when modified, since our server runs on hot reload, if the app is running. To run the script, from the root directory, run:
```shell
./scripts/generate-openapi.sh [options]
```

By default, `./scripts/generate-openapi.sh` is analogous to running `make gen` as it creates both yaml file and generated webapp files. If you intend to separately build either webapp api generated files or the swagger-spec.yaml you have different options: To generate only webapp generated files pass the `--no-spec` or `--ns` option to the script or run `make gen-webapp`. To generate only swagger spec pass the `--no-gen` or `-ng` option to the script or run `make spec`.

### Seed the database

We use knex to seed the database, more info [here](https://knexjs.org/guide/migrations.html#seed-files).

To run seed files, run the following command from the root directory:

```
docker compose exec -it transcendence-app npx knex seed:run
```

or its make counterpart, from the root directory

```shell
make seed
```

To create a seed file, run the following command from the transcendence-app directory (replace `seed_name` with the name you want)

```
npx knex seed:make seed_name
```

## 🔧 Running the tests <a name = "tests"></a>

Change the working directory to `webapp` or `transcendence-app`

```
cd webapp
npm test
npm run test:e2e
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

Register a new OAuth application on the [42 intranet](https://profile.intra.42.fr/oauth/applications/new)

Set the Redirect URIs

```
http://your-domain-or-ip-here/api/v1/auth/login
http://localhost/api/v1/auth/login
```

Clone the GitHub repository

```
git clone https://github.com/42AGV/ft_transcendence.git
```


Change the current working directory to `ft_transcendence`

```
cd ft_transcendence
```

Either create a `.env` file in the root directory containing the following environment variables (replace the ID and SECRET with the ones from the OAuth application you create in the previous step):

> **_NOTE:_**  You can generate UUIDs using the `uuidgen` command

```
FORTYTWO_APP_ID=your-42-app-id
FORTYTWO_APP_SECRET=your-42-app-secret
POSTGRES_USER=your-postgres-user
POSTGRES_PASSWORD=your-postgres-password
SESSION_SECRET=your-session-secret-uuid
MEMCACHED_SECRET=your-memcached-secret-uuid
```

Or export them from the shell like:

```
export POSTGRES_USER=your-postgres-user
export POSTGRES_PASSWORD=your-postgres-password
export FORTYTWO_APP_ID=your-42-app-id
export FORTYTWO_APP_SECRET=your-42-app-secret
export SESSION_SECRET=your-session-secret-uuid
export MEMCACHED_SECRET=your-memcached-secret-uuid
```

Generate the generated files, that are not a part of the repository:

```shell
make gen
```
or
```shell
./scripts/generate-openapi.sh [options]
```
> **_NOTE:_**  You can see a help panel for this script if you pass to it a `--help` or `-h` option.

Start the application using `Docker`

```
docker compose up -d --build
```
> **_NOTE:_**  If you are using Docker Compose V1, replace the `docker compose` commands with `docker-compose` (with a hyphen)

or
```shell
make all
```
> **_NOTE:_**  `make all` will dispatch to the right docker-compose executable, and will also generate the files for you if you haven't run `make gen` in the previous step

You can now access the web application locally at http://localhost and the Swagger documentation for the API at http://localhost/api

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
