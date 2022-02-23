<h1 align="center">QuickList</h1>

<p align="center">
    &nbsp;<img src="https://img.shields.io/badge/made%20by-YenHub%20💙-blue" />
    &nbsp;<img src="https://badgen.net/badge/icon/typescript?icon=typescript&label" />
    &nbsp;<img src="https://badgen.net/badge/icon/atom?icon=atom&label" />
    &nbsp;<img src="https://badgen.net/badge/icon/github?icon=github&label" />
    &nbsp;<img src="https://img.shields.io/badge/React-17.0.1-important" />
    &nbsp;<img src="https://img.shields.io/badge/ExpressJS-4.17.1-blueviolet" />
</p>

<p align="center">
    &nbsp;<img src="https://img.shields.io/github/workflow/status/YenHub/list.quickdash.co.uk/🚀%20Deploy%20website%20on%20push" />
    &nbsp;<img src="https://img.shields.io/mozilla-observatory/grade-score/list.quickdash.co.uk?publish&v=1" />
    &nbsp;<img src="https://img.shields.io/website?down_color=red&down_message=offline&up_color=brightgreen&up_message=online&url=https%3A%2F%2Flist.quickdash.co.uk" />
    &nbsp;<img src="https://img.shields.io/github/last-commit/YenHub/list.quickdash.co.uk" />
    &nbsp;<img src="https://img.shields.io/github/issues-raw/YenHub/list.quickdash.co.uk" />
    &nbsp;<img src="https://img.shields.io/github/repo-size/YenHub/list.quickdash.co.uk" />
</p>

## TOC

<details>
  <summary>Click to see the table of contents</summary>

- [TLDR](#tldr)
- [What is it?](#what-is-it)
- [Why QuickList?](#why-quicklist)
- [Future Development](#future-development)
- [What does it do?](#what-does-it-do)
- [Quick Start Usage](#quick-start-usage)
  - [Prerequisites](#prerequisites)
  - [Create a .env config](#create-a-env-config)
  - [Run the solution using Docker 🐳](#run-the-solution-using-docker)
  - [What now?](#what-now)
  - [Where is everything?](#where-is-everything)
- [Development Info](#development-info)
  - [Running the front end standalone](#running-fe-standalone)
  - [Running the back end standalone](#running-api-standalone)
  - [Running the entire system](#start-the-solution)
  - [Backing up your database](#backing-up-your-database)
  - [Docker Tips & Commands](#docker-commands-you-can-use)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Project To-Do](#project-to-do)
- [FAQs](#faqs)

</details>

## What is it?

QuickList is a simple list and task management app, available for desktop or mobile as a PWA (progressive web app).

The app sports a slinky dark mode by default, stores all your notes on your device, and even helpfully runs offline 😎

[![demoImage]](https://list.quickdash.co.uk)

The original goal of this app was to have a simple place to manage tasks at a high level without all the overhead/clutter which great tools like Trello, Jira, Monday and many others share in common.

In fact, this tool is actually designed to augment those services, and be used alongside them as a small task manager for all that chaos!

There is nothing more powerful and easy to use than a good old fashioned list!

QuickList is free to use, take it for a [test drive here]

## Why QuickList?

I love simple tools that help with organisation, and have a passion for building with technology too!

The original QuickList was written in around 2013, utilising the recently released, and extremely popular, [Bootstrap 3.0] library.

This project was picked up again in January 2021 during National COVID lockdown as a cabin fever relief project.. 😜

The project is now powered by Docker, ReactJS, ExpressJS & MySQL.

The front end has been built using Material UI, and uses localForage for simple client side storage.

Everything runs in Docker right from the root of the project!

There is even a pre-configured phpMyAdmin instance to compliment the setup.

## Future Development

Long term I plan to add lots of new functionality, including:-

- Server Side Features
  - Ability to share lists via URL
  - Share & collaborate live on a list
  - Ability to embed a list as a html plugin
- Front End Features
  - Custom UI Colour Scheme
  - List Item Colour Schemes
  - List Item Dates
    - Expires
    - Due Date (inc Countdown)

Just to mention a few... 😄

Please share anything you think would be an awesome addition!

The idea here though is to Keep It Simple, the intention here is to never grow beyond a simple interface!

## What does it do?

The idea behind this release of the project was to modernise the app and experiment with building an easy and fast full stack javascript environment, front end, back end and DB included!

No mucking around! 🎉

## TLDR;

1. `git clone git@github.com:YenHub/list.quickdash.co.uk.git`
2. Create your .env config [(how do)](#create-a-env-config)
3. `docker-compose up --build`
4. Visit http://localhost to take it for a QuickSpin! 😋

## Quick Start Usage

### Prerequisites

Top tip... Ensure you have Docker running 😁

When running the solution for the first time, you will be required to alter the permissions of the database user.

User information is declared in your `.env` files (see [here](#create-a-env-config)) and consumed by the `docker-compose.yml` where you can override the defaults.

Or alternatively just use root 🙄

### Create a .env config

Copy and edit the .env files to suit your setup needs (for local development the defaults are perfectly acceptable)

```.env
cp .env.example .env
cp /server/.env.example /server/.env
```

_Note; these files are .gitignored_

### Run the solution using Docker 🐳

You can run this solution using Docker, WSL2 and any distro of preference.

See the prerequisites [here](#prerequisites)

#### Start the solution

```bash
# use -d for detached mode
docker-compose up
```

#### Stop the solution (Ctrl+C)

```bash
docker-compose down
```

### What now?

The api is hosted on port 9000, the front end on port 80

This can be customized via env variables, but those are the defaults.

Once you have the solution up and running, simply visit http://localhost/TestAPI to check it's working correctly, and begin developing the API and Front End.

### Where is everything?

#### ./client:

http://localhost

#### ./server

http://localhost:9000

#### phpMyAdmin

http://localhost:8080

## Development Info

### Running FE standalone

The React front end is happy to run standalone from it's root `./client`.

You have two options, the recommended approach is to use Docker, but you can always bail out if needed and simply call npm as you would usually for a React project.

#### Using Docker

```bash
# From the root of the project
docker-compose up client-app
```

Access the front end at http://localhost

#### Using NPM

```bash
# From the root of ./client
cd client

# Install the project dependencies
npm i

# Start the App 🚀
npm start
```

You can access the front end at http://localhost:3000/

**NOTE:** When using `npm` the project runs as it would usually on port 3000

### Running API standalone

Whether using Docker or npm, you can access the API on http://localhost:9000

#### Using Docker

```bash
# From the root of the project
docker-compose up node-mysql -d && docker-compose up server-app
```

#### Using NPM

```bash
# From the root of ./server
cd server

# Install the project dependencies
npm i

# Start the App 🚀
npm run serve:dev
```

### Docker: Commands you can use

```bash
# Ensure you have docker installed & running
# It's recommended to use WSL2 with Ubuntu LTS

# Run the solution
docker-compose up

# Launch docker container (-d: detached)
docker-compose up -d

# Kill the solution
docker-compose down

# Build the containers
docker-compose build

# Recreate the solution & run
docker-compose up --build --force-recreate

# We can then also do (due to docker-compose `container_name: node-mysql`)
docker start node-mysql

# Exec commands in the container (e.g. MySQL):
# docker exec -it [container-name] mysql -uroot -p
docker exec -it node-mysql mysql -uroot -p
```

## Deployment

The deployment of this project is automated using GitHub Actions.

When pushing to master, and changes are made to the paths defined in [the action](/.github/workflows/pushtoftp.yaml), the code will be built, tested & pushed to the live environment all in less than 2 minutes!

End to end, the process takes approximately 1m30s, though there are still some improvements that could be implemented in the future, including caching of the more stable npm assets, which would help reduce this time (but more importantly save some wasted compute cycles and trees!!)

The pipeline is driven by three simple steps:

### Build

For the front end, we `npm ci` before our `npm run build` to ensure better efficiency in the pipeline, and better dependency stability

~~Long term, it would be desirable to implement caching of the npm modules too~~

UPDATE: We're now using caching 😎

### Test

Here we will run `npm run test` with verbose output

Unit Testing is driven by the CRA provided unit testing packages

If the pipeline fails at this stage, we don't push the code live

### Lint

We now run a lint check against the code base using `npm run lint`

This will enforce the ESLint config against the codebase, again failing to deploy if anything doesn't check out here.

### Sync

[SamKirkland's awesome simple ftp action](https://github.com/SamKirkland/FTP-Deploy-Action) is then used to run a diff check between the new environment produced and that of the server.

Any changes that are identified are then synced to the server.

### Manual Deployment

Mistakes happen, right? For this reason, there is a [manual "emergency publish"](https://github.com/YenHub/list.quickdash.co.uk/actions/workflows/push-to-ftp-manual.yaml) available.

You can manually trigger this action to wipe the remote & resync the current master branch across to the live environment.

This process takes a little more time (~2m30s) and is more likely to result in downtime.

There is also a less destructive method available, which mimics the standard automated deployment, which can be [seen here](https://github.com/YenHub/list.quickdash.co.uk/actions/workflows/push-to-ftp-manual-clean.yaml).

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create.

Any contributions you make are **greatly appreciated** 🤗

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/super-cool-new-feature`)
3. Commit your Changes (`git commit -m '💥 Adds super cool new feature'`)
4. Push to the Branch (`git push origin feature/super-cool-new-feature`)
5. Open a Pull Request and enjoy yourself a nice 🍺🍷

## Project To-Do

<details>
  <summary>Click to see the project to-do list</summary>

- [ ] Make it better
  - In progress... forever™
  - Betterize the bad bits
- [x] Dockerize Solution
  - [x] Isolate Networks
    - server-network
    - client-network
  - [x] Front End
    - [x] React
      - http://localhost
  - [x] Backend End
    - [x] MySQL
      - http://localhost:3306
    - [x] phpMyAdmin
      - http://localhost:8080
    - [x] API
      - http://localhost:9000
- [ ] Front End
  - [ ] Views
    - [x] TestAPI
      - http://localhost/TestAPI
    - [ ] User Admin
      - http://localhost/Admin/Users
  - [ ] Gubbins
    - [ ] ~~Redux~~
    - [x] Custom State Management
      - A custom hooks context/reducer implementation has been added 🎉😎 See [The Store](/client/src/Services/State/Store.tsx)
    - [x] TypeScript
    - [x] Jest tests
    - [x] Service Workers
    - [ ] Auth
      - [ ] JWT
      - [ ] Basic User management
        - [ ] View
        - [ ] Edit / Delete
  - [ ] UI/UX
    - [x] Interaction Modal
      - [x] Delete Modal
      - [x] Close/Cancel Button
    - [x] List Items
      - [x] Add edit note functionality
      - [x] Add MD Ability for list item text secondary
    - [ ] Menu Items
      - [x] Delete all notes button
      - [ ] Add colour picker for UI
  - [ ] Logic
    - [ ] Add HOC Error Boundary
- [ ] Back End
  - [ ] Endpoints
    - [x] API Status Test
      - http://localhost:9000/testAPI/
      - http://localhost:9000/testAPI/payload
    - [ ] User Controllers CRUD
  - [ ] Auth
    - [ ] JWT
    - [ ] Basic User management CRUD
      - [ ] Roles
      - [ ] Permissions

</details>

## FAQs

### Localhost keeps redirecting to https://

This can be annoying, simply visit chrome://net-internals#hsts and delete "localhost" by entering it into the delete field at the bottom

### Backing up your database

The database is defined in `./docker-compose.yml`

The MySQL instance is volume bound to: `./docker-volumes` and is also in `.gitignore`

<!-- Doc Links -->

[demoimage]: ./web-app.png
[bootstrap 3.0]: https://getbootstrap.com/docs/3.3/
[test drive here]: https://list.quickdash.co.uk/

<h2 align="center">Author Stats: YenHub</h2>

<p align="center">
    <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=YenHub&theme=blue-green" /><br>
    <img src="https://github-readme-streak-stats.herokuapp.com/?user=YenHub&theme=blue-green" /><br>
    <img src="https://github-profile-trophy.vercel.app/?username=YenHub&theme=discord" />
</p>
