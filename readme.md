# Esmart Client app

![unit workflow](https://github.com/Esmartdriver/esmart-client-app/actions/workflows/run-unit-test.yml/badge.svg)
![lint workflow](https://github.com/Esmartdriver/esmart-client-app/actions/workflows/run-syntax-check.yml/badge.svg)


## Stack

- Vite (Vue3)
- Tailwind

## Running 

### Development
```
yarn && yarn dev
```
port : 3000
### Preview (view the builded website)
```
yarn && yarn build && yarn preview
```
port : 5000

### Build for production
```
yarn && yarn build
```
build folder : /dist

## Developers

- Damien, Hannah, Milneko


# API GATEWAY CUSTOM DOMAIN NAME

To change the API Gateway domain name you have to update the terraform first then run

```
npm i
sls create_domain --stage {stage}
```


## Environment file

To download the environment locally

```
aws --profile {development|production} s3 cp s3://transtex-vault-{development|production}/esmart-client-app/.env .env
```


# RUN ME IN DOCKER

To run the application in a docker container just do as adviced bellow

```
docker build -t esmart-client-app .
```

It will build your container with all requires librairies

and now run the app by entering

```
docker run -dp 6300:3000 esmart-client-app
```

or with docker-compose
```
docker-compose build --no-cache
```

to build

```
docker-compse up
```

You should be able to now access it at:
http://localhost:63000