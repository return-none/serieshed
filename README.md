# serieshed

Project for fun with React, Redux, Styled components, and of course Typescript

## Development

### local

You would need to have `NodeJS 16` and `yarn` installed then run following commands

- yarn install
- yarn start

so you have dev server running

### Docker

`docker compose up` will start a server in Docker and it will be available on port 3000 and will listen to the changes

## Build

### local

Use `yarn build` to create production build in `build` directory

### Docker

Use `docker build .` to create production build docker image with nginx as static files server
