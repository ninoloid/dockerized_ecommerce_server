#!/bin/bash

npm install
npx sequelize db:create
npx sequelize db:migrate:undo:all
npx sequelize db:migrate
npx sequelize db:seed:all
npm start