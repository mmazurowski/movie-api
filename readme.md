![Production Build](https://github.com/mmazurowski/movie-api/workflows/Project%20Build/badge.svg)
![Test](https://github.com/mmazurowski/movie-api/workflows/Test/badge.svg)
![Lint Check](https://github.com/mmazurowski/movie-api/workflows/Lint%20Check/badge.svg)

# TSH <> Marcin - Welcome Project
> Hi, My name is Marcin and I would like to present you my piece of code.

## Installing / Getting started
```
Requirements
1. Node 14
2. Docker
3. NPM
```

## Developing
Application by default listens on localhost port 4000, this can be easily altered based on environmental variables

```
git clone https://
npm run i
npm run dev
```

## Configuration
Make sure you're keeping you environmental variables up to date

```
APP_ENV=development
APP_PORT=4000
APP_HOST=http://localhost

// this could be automated to always reflect .env.example
```

## Building

Building application 
``npm run build``  
You can build docker with following command:  `docker build -t tsh:latest .`


## Running
Running container `docker run -v $(pwd)/database:/home/app/database -p 4000:4000 -e NODE_ENV=production tsh:latest`