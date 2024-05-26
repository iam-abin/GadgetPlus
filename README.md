### GadgetPlus

## Technologies Used

- Node.js
- Express.js
- MongoDB
- EJS, HTML5, CSS3

## Setup

1. Clone the repository
```
git clone https://github.com/iam-abin/GadgetPlus.git
```
Then,
```
cd GadgetPlus
```
```
npm install
```
```
npm start
```




### Docker commands

- build an image

```
docker build -t image-name .
```

- List all local Docker images
```
docker images
```

- To run a docker image to crate a container
```
docker run image_name
```

- To run a docker image to crate a container in  detached mode (in the background).
```
docker run -d image_name
```

- To do port mapping and runnig container (To access application running inside container port 8080 from 
 our local machine port 5000. By default app inside container cannot talk with outside world)

```
docker run -p 5000:8080 image-name
```
or
```
docker run -p 5000:8080 -d image-name
```

-  Stop a running container
```
docker stop container_name
```

- List all running containers
```
docker ps
```
- To see all the containers(even the stopped containers)
```
docker ps -a
```