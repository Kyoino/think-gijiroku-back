# Running programs
## Summary
1. Common
    1. Get node modules with yarn.
    2. Add tools with yarn
    3. Copy some files and edit.
2. Run dev server
3. Run stage/prod(with docker)

## 1. for local 
### i. Get node packages
```shell script
cd $PROJECT_ROOT
# (Please replace $PROJECT_ROOT with Download folder of this repository)
yarn install
```
### ii. Add tools with yarn
以下、2種類の方法がある.

- node_modules/.bin にPATHを通す
- 以下のコマンドを実行する

```shell script
yarn global add nodamon typeorm ts-node husky lint-staged eslint eslint prettier jest eslint-config-node eslint-config-prettier 
```
単に実行するだけなら以下.
```shell script
# for running
yarn global add nodamon typeorm ts-node
# for run production server
yarn global add typescript typeorm ts-node
```

### iii. Copy files(Optional for dev, Required for prod)
```shell script
# create `.env` file in Project_root 
# and write `PORT=8000` when you change server port to 8000
cp .env.example .env
# edit .env
```
## 2. for dev
Run script with below command
```shell script
yarn dev
# see HP with browser in `localhost:8080` if you don't copy env file
# (you can close this server by ctrl-C)
``` 

## 3. for prod/stage
### i. use docker from command
```shell script
cd $PROJECT_ROOT
yarn
# create `.env` file in Project_root 
# and write `PORT=3000` if you change inside server port to 3000
cp .env.example .env
yarn stage
# sudo docker-compose -f docker/docker-compose.yml up
# see HP with browser in `localhost:8001`
# Close it by Ctrl-C

# DB migration
# Run below After Close docker with Ctrl-C
sudo docker-compose -f docker/docker-compose.yml run web yarn typeorm migration:run
```
