# React + TypeScript + Vite

This project has been scaffolded using [Vite](https://vite.dev/guide/)

## Available Scripts

In the project root directory, you can run:

### Docker

```bash
# Launch docker container
docker-compose up

# (Optionally): Detached Mode
docker-compose up -d

# We can also run services individually (due to docker-compose `container_name: node-mysql`)
docker start client-app

# Exec commands in the container:
docker exec -it [container_name] mysql -uroot -p
```

### Client

#### `pnpm -F client dev`

Runs the app in the development mode.\
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### `pnpm -F client build`

Builds the app for production to the `dist` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

#### `pnpm -F client test`

Launches the test runner.

Tests can be found at [client/src/\_\_tests\_\_](/client/src/__tests__)

#### Linting

Lint the codebase using the ESLint config provided.

You can see the rules here [/client/eslint.config.js](/client/eslint.config.js)

```bash
# Dry-run
pnpm -F client lint

# Attempt auto-fix
pnpm -F client lint:fix
```

#### Formatting

Format the codebase using the Prettier config provided.

You can see the rules here [/client/prettier.config.cjs](/client/prettier.config.cjs)

```bash
# Dry-run
pnpm -F client format

# Attempt auto-fix
pnpm -F client format:fix
```
