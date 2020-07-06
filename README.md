# **DOCKER** #

## **DOCKER COMPOSE** ##
Compose is a tool for defining and running multi-container Docker applications. With Compose, you use a YAML file to configure your application’s services. Then, with a single command, you create and start all the services from your configuration.

Here's the example of docker-compose.yml

```
# compose file format version
version: '3'

# list of docker services
services:
  db:
    # use postgres v12 image from docker
    image: "postgres:12"
    ports:
      - "5432:5432"
    volumes:
      - ./pgData:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRESS_DB: db_ecommerce

  app:
    build:
      # build an image using predefined Dockerfile
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    volumes:
      - .:/restify-pg
    environment:
      DB_HOST: db
```

Here's the example of Dockerfile
```
# using node v12 image from docker
FROM node:12
WORKDIR /app
COPY package*.json ./
COPY . .
EXPOSE 3000
ENTRYPOINT ["/bin/bash", "bin/bash/./entrypoint.sh"]
```

Here's the example of entrypoint
```
#!/bin/bash

npm install
npx sequelize db:create
npx sequelize db:migrate:undo:all
npx sequelize db:migrate
npx sequelize db:seed:all
npm start
```

You don't have to use entrypoint.sh, it's optional. For a simple script (just a line of code of "npm start" or anything else), you can use CMD ["npm", "start"].

## DOCKER BASIC COMMANDS ##
```
docker run -it -d <image name>

This command is used to create a container from an image
```

```
docker ps

This command is used to list the running containers
```

```
docker ps -a

This command is used to show all the running and exited containers
```

```
docker exec -it <container id> bash

This command is used to access the running container
```

```
docker stop <container id>

This command stops a running container
```

```
docker kill <container id>

This command kills the container by stopping its execution immediately. The difference between ‘docker kill’ and ‘docker stop’ is that ‘docker stop’ gives the container time to shutdown gracefully, in situations when it is taking too much time for getting the container to stop, one can opt to kill it
```

```
docker commit <conatainer id> <username/imagename>

This command creates a new image of an edited container on the local system
```

```
docker login

This command is used to login to the docker hub repository
```

```
docker push <username/image name>

This command is used to push an image to the docker hub repository
```

```
docker images

This command lists all the locally stored docker images
```

```
docker rm

Usage: docker rm <container id>

This command is used to delete a stopped container
```

```
docker rmi <image-id>

This command is used to delete an image from local storage
```

```
docker build <path to docker file>

This command is used to build an image from a specified docker file
```
<br>

## DOCKER COMPOSE CLI REFERENCE ##
```
Builds, (re)creates, starts, and attaches to containers for a service.

docker-compose up

options: 
  -d            detached, run containers in the background
  --build       build images before starting containers

more options: https://docs.docker.com/compose/reference/up/
```
```
Stops containers and removes containers, networks, volumes, and images created by up.

docker-compose down

options:
  --rmi type    Remove images. Type must be one of:
                - all
                - local

more options: https://docs.docker.com/compose/reference/down/
```

<br><br>

## **ECOMMERCE SERVER** #

## USER ROUTE ## 

    POST '/register'

    Data :
      username : string
      email : string
      password : string

    Response :
      201 : Token, Username
      400 : Validation Error
      500 : Internal Server Error


    LOGIN '/login'

    Data :
      userIdentification (username or email) : string
      password : string

    Response :
      200 : Token, Username
      400 : Validation Error
      400 : Invalid Username, Email, or Password
      500 : Internal Server Error


    GET '/showUsers'
    
    Response :
      200 : User list
      500 : Internal Server Error

    
    PATCH '/updateAdmin/:id

    Params :
      Admin ID : integer
    
    Data :
      isActivated : boolean

    Headers :
      access_token

    Response :
      200 : 'Admin account updated successfully'
      403 : 'This page can only be accessed by registered users, please login first'
      403 : 'This page can only be accessed by super admin. You're not!'
      500 : Internal Server Error
    

    DELETE '/deleteAdmin/:id

    Params :
      Admin ID : integer

    Headers :
      access_token

    Response :
      200 : 'Admin account deleted successfully'
      403 : 'This page can only be accessed by registered users, please login first'
      403 : 'This page can only be accessed by super admin. You're not!'
      500 : Internal Server Error


    PATCH '/updateUserPassword/:id

    Params :
      User ID : integer
    
    Data :
      newPassword : string

    Headers :
      access_token

    Response :
      200 : 'User password updated successfully'
      403 : 'This page can only be accessed by registered users, please login first'
      403 : 'Sorry, your admin account isn't activated yet'
      500 : Internal Server Error
    

    DELETE '/deleteUser/:id

    Params :
      User ID : integer

    Headers :
      access_token

    Response :
      200 : 'User deleted successfully'
      403 : 'This page can only be accessed by registered users, please login first'
      403 : 'Sorry, your admin account isn't activated yet'
      500 : Internal Server Error

<br>

## PRODUCT ROUTE ##

    POST '/product'

    Data :
      name : string
      description : string
      CategoryId : integer
      price : integer
      stock : integer
      imageUrl : string, get url from aws upload middleware and multer

    Headers :
      access_token

    Response :
      201 : 'Product added to the database'
      403 : 'This page can only be accessed by registered users, please login first'
      403 : 'Sorry, your admin account isn't activated yet'
      500 : Internal Server Error

      
    GET '/product'

    Response :
      200 : Product list
      500 : Internal Server Error


    GET '/product/:id'

    Params :
      Product ID

    Response :
      200 : A single product
      500 : Internal Server Error


    PUT '/product/:id'

    Data :
      name : string
      description : string
      CategoryId : integer
      price : integer
      stock : integer
      imageUrl : string, get url from aws upload middleware and multer

    Params :
      Product ID
      
    Header :
      access_token
    
    Response :
      200 : 'Product updated successfully'
      403 : 'This page can only be accessed by registered users, please login first'
      403 : 'Sorry, your admin account isn't activated yet'
      500 : Internal Server Error


    DELETE '/product/:id'

    Params :
      Product ID
      
    Header :
      access_token
    
    Response :
      200 : 'Product updated successfully'
      403 : 'This page can only be accessed by registered users, please login first'
      403 : 'Sorry, your admin account isn't activated yet'
      500 : Internal Server Error

<br>

## CART ROUTE ##

    POST '/cart'

      Data :
        UserId : integer
        ProductOd : integer
        quantity : integer

      Headers :
        access_token

      Response :
        200 : 'Product added to cart successfully'
        403 : 'This page can only be accessed by registered users, please login first'
        500 : Internal Server Error

      
    GET '/cart/:id'

      Params :
        User ID

      Headers :
        access_token

      Response :
        200 : List of product on the cart
        403 : 'This page can only be accessed by registered users, please login first'
        500 : Internal Server Error

    DELETE '/cart/:id'

      Params :
        User ID

      Headers :
        access_token

      Response :
        200 : List of product on the cart
        403 : 'This page can only be accessed by registered users, please login first'
        500 : Internal Server Error