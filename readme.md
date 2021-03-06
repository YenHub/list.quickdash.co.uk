# QuickList

![Author] ![React Version] ![ExpressJS Version] ![Repo Size] ![Beer Money]

![Site Status] ![Build Status] ![Last Commit] ![MozScore] ![Open Issues]

## What is it?

QuickList is a simple list and task management app, available for desktop or mobile as a PWA (progressive web app).

The app sports a sexy dark mode by default, stores all your notes on your device, and even helpfully runs offline 😎

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

## TOC

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
- [Project To Do](#project-to-do)
- [FAQs](#faqs)

## TLDR;

1. `git clone git@github.com:YenHub/list.quickdash.co.uk.git`
2. Create your .env config [(how do)](#create-a-env-config)
3. `docker-compose up --build -d && chrome http://localhost/TestAPI`

## Quick Start Usage

### Prerequisites

Top tip... Ensure you have Docker running 😁

When running the solution for the first time, you will be required to alter the permissions of the database user.

User information is declared in your `.env` files (see [here](#create-a-env-config)) and consumed by the `docker-compose.yml` where you can override the defaults.

Or alternatively just use root 🙄

### Create a .env config

Create a file at `./.env` and populate the contents like below, setting a password of your choosing.

Copy this file also to `./server/.env`

_This file is .gitignored_

```.env
DB_PORT=3306
DB_USERNAME=root    
DB_SERVICE_USER=NodeUser
DB_PASSWORD=NodeUserPassword
DB_DATABASE=nodeDB
DB_HOST=node-mysql
DB_TEST=testDB
```

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
# Make sure you have run `npm i`
npm start
```

Access the front end at http://localhost:3000/

**NOTE:** When using `npm` the project runs as it would usually on port 3000

### Running API standalone

Whether using Docker or npm, you can access the API on http://localhost:9000

#### Using Docker
```bash
# From the root of the project
docker-compose up node-sql -d && docker-compose up server-app
```

#### Using NPM
```bash
# From the root of ./api
# Make sure you have run `npm i`
npm run dev
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

## Project To Do

- [ ] Make it better
    - In progress... forever™
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
        - [ ] Redux
        - [ ] TypeScript
        - [ ] Jest tests
        - [ ] Service Workers
        - [ ] Auth
            - [ ] JWT
            - [ ] Basic User management
                - [ ] View
                - [ ] Edit / Delete
    - [ ] UI/UX
        - [x] Interaction Modal
            - [x] Delete Modal
            - [x] Close/Cancel Button
        - [ ] List Items
            - [x] Add edit note functionality
            - [ ] Add MD Ability for list item text secondary
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

[Author]: https://img.shields.io/badge/made%20by-YenHub%20❤-blue
[React Version]:https://img.shields.io/badge/React-17.0.1-important
[ExpressJS Version]:https://img.shields.io/badge/ExpressJS-4.16.1-blueviolet
[Beer Money]:https://img.shields.io/badge/beer%20money-$0-ff69b4
[Build Status]: https://img.shields.io/github/workflow/status/YenHub/list.quickdash.co.uk/🚀%20Deploy%20website%20on%20push
[MozScore]: https://img.shields.io/mozilla-observatory/grade-score/list.quickdash.co.uk?publish
[Site Status]: https://img.shields.io/website?down_color=red&down_message=offline&up_color=brightgreen&up_message=online&url=https%3A%2F%2Flist.quickdash.co.uk

[Last Commit]: https://img.shields.io/github/last-commit/YenHub/list.quickdash.co.uk
[Open Issues]:https://img.shields.io/github/issues-raw/YenHub/list.quickdash.co.uk
[Repo Size]: https://img.shields.io/github/repo-size/YenHub/list.quickdash.co.uk

[demoImage]: ./web-app.png
[Bootstrap 3.0]: https://getbootstrap.com/docs/3.3/
[test drive here]: https://list.quickdash.co.uk/

## FAQs

### Localhost keeps redirecting to https://

This can be annoying, simply visit chrome://net-internals#hsts and delete "localhost" by entering it into the delete field at the bottom

### Backing up your database

The database is defined in `./docker-compose.yml`

The MySQL instance is volume bound to: `./docker-volumes` and is also in `.gitignore`
