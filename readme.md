# QuickList

![Author] ![React Version] ![ExpressJS Version] ![Beer Money]

![Last Commit] ![Open Issues] ![Progress] ![Project Status] ![Repo Size]

## What is it?

The original QuickList was written around 2013 utilising the then recently released and extremely popular [Bootstrap 3.0] library.

[Here is a live demo] of the original app released in 2014

[![demoImage]](https://list.quickdash.co.uk)

## Current Development

This project was picked up again in January 2021 during National COVID lockdown as a cabin fever relief project.. 😜

The project is powered by Docker, ReactJS, ExpressJS & MySQL.

The latest build uses ReactJS and Material-UI for the front end.

There is also a pre-configured phpMyAdmin instance to compliment the setup, all running in an isolated environment in the root of the project!

## What does it do?

The idea behind this release was to modernise the project and provide an easy and fast full stack javascript environment, front end, back end and DB included!

No mucking around! 🎉

## TOC

- [TLDR](#tldr)
- [What is it?](#what-is-it)
- [What does it do?](#what-does-it-do)
- [Quick Start Usage](#quick-start-usage)
    - [Create a .env config](#create-a-env-config)
    - [Run the solution using Docker 🐳](#run-the-solution-using-docker-)
    - [What now?](#what-now)
- [Development Info](#development-info)
    - [Running the solutions standalone](#running-the-front-or-back-end-standalone)
    - [Running the entire system](#docker-running-the-full-solution)
    - [Backing up your database](#backing-up-your-database)
- [Project To Dos & Dones](#project-to-dos--dones)

## TLDR;

1. `git clone git@github.com:YenHub/list.quickdash.co.uk.git`
2. Create your .env config [(how do)](#create-a-env-config)
3. `docker-compose up --build -d && chrome http://localhost/TestAPI`

## Quick Start Usage

### Create a .env config

Create a file at `./api/.env` and populate the contents like so, setting a password of your choosing:-

_This file is .gitignored_

```.env
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=some_wi1d-pa$$word
DB_DATABASE=nodeDB
DB_HOST=node-mysql
```

### Run the solution using Docker 🐳

Run this solution using Docker, WSL2 and your distro of preference.

```bash
# Start the solution (-d for detached mode)
docker-compose up

# Stop the solution (Ctrl+C)
docker-compose down
```

### What now?

The api is hosted on port 9000, the front end on port 80

This can be customized via env variables, but those are the defaults.

Once you have the solution up and running, simply visit http://localhost/TestAPI to check it's working correctly, and begin developing the API and Front End.

## Development Info

### Running FE standalone

The React front end is happy to run standalone from it's root `./client`.

```bash
# From the root of ./client
npm start
```

**NOTE:** The project will be available at http://localhost:3000/ when running standalone

### Running API standalone

**UPDATE**: Following the latest updates, you can now work on the API standalone

```bash
# From the root of the project
docker-compose up node-sql

# From the root of ./api
npm run dev
```

You can now access the API on http://localhost:9000

### Running the front or back end standalone:

```bash
# Start Front End Dev Server Only
cd client && npm start

# Start Back End Dev Server Only
cd api && npm run dev
```

### Docker: Running the full solution

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

# Exec commands in the container:
docker exec -it [container_name] mysql -uroot -p
```

### Backing up your database

The database is defined in `./docker-compose.yml`

The MySQL instance is volume bound to: `./docker-volumes` and is also in `.gitignore`

## Project To Dos & Dones

- [ ] Make it better
    - In progress... forever™
- [x] Dockerize Solution
    - [x] Isolate Networks
        - api-network
        - app-network
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
        - [ ] Auth
            - [ ] JWT
            - [ ] Basic User management
                - [ ] View
                - [ ] Edit / Delete
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

[Last Commit]: https://img.shields.io/github/last-commit/YenHub/list.quickdash.co.uk
[Open Issues]:https://img.shields.io/github/issues-raw/YenHub/list.quickdash.co.uk
[Progress]:https://img.shields.io/badge/progress-dev-brightgreen
[Project Status]: https://img.shields.io/badge/status-active-brightgreen
[Repo Size]: https://img.shields.io/github/repo-size/YenHub/list.quickdash.co.uk

[demoImage]: ./web-app.png
[Bootstrap 3.0]: https://getbootstrap.com/docs/3.3/
[Here is a live demo]: https://list.quickdash.co.uk

## FAQs

### Localhost keeps redirecting to https://

This can be annoying, simply visit chrome://net-internals#hsts and delete "localhost" by entering it into the delete field at the bottom
