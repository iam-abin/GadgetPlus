# GadgetPlus
GadgetPlus is an e-commerce application. It allows users to browse and purchase gadgets online.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- EJS, HTML5, CSS3

---


Node version: Welcome to Node.js v18.15.0

### User-Facing Features

- **User Authentication**: Create user accounts, log in, and manage personal information securely.
- **Product Search**: Utilize the search functionality to quickly locate specific products by name, keywords, or attributes.
- **Product Filters**: Narrow down product results using filters such as product category, price range.
- **Product List**: Explore a vast catalog of products, making it easy to find desired items.
- **Product Zoom**: Utilize the magic zoom function to get a closer look at product images.
- **Shopping Cart**: Add products to the shopping cart for easy management and seamless checkout.
- **Wishlist**: Save desired products to a wishlist for future reference or purchase.
- **Mobile OTP Login**: Verify user mobile numbers using OTP to login.
- **Payment Methods**: Choose from various payment methods, including Razor Pay,wallet and cash on delivery.
- **Return and Cancel**: Easily initiate returns or cancel orders as per the return policy.
- **Coupon Code**: Apply coupon codes for discounts during checkout.
- **Address Management**: Add, edit, and delete user addresses for accurate and convenient delivery.
- **Profile Management**: Edit merchant profile information and upload profile images.
- **Order Management**: View and manage orders, including different order statuses such as pending, processing, shipped, outForDelivery,delivered, candelPending, canceled, etc.
- **Invoice download**: Generate invoid for delivered products and can download them in PDF format.


### Admin-Facing Features

- **Admin Authentication**: To Authenticate admins for added security. Admin login and logout.
- **User Management**: Handle user accounts, including blocking, unblocking, and managing user data.
- **Product Management**: Handle Products, including adding, editing, blocking, and managing product data.
- **Coupon Management**: Add, edit, delete, and update coupon codes for discounts.
- **Category Management**: Manage categories such as for each products, including adding, editing, and deleting categories.
- **Sales Reports**: Generate sales reports for order on a daily, weekly, monthly, and yearly basis and download them in CSV or PDF format.
- **Dashboard**: Display statistics of sales such as profit, products etc., with graphs for monthly, daily insights.

---


### Prerequisites

Make sure you have the following installed on your system:

-   Node.js: [Download and install Node.js](https://nodejs.org/)

## Setup

1. Clone the repository

```
git clone https://github.com/iam-abin/GadgetPlus.git
```

2. Navigate to the project directory

    ```
    cd GadgetPlus
    ```

3. Install the dependencies

   ```
   npm install 
   ```

4. Configure the environment variables. Rename the `.env.example` file to `.env` and update the necessary variables with your specific configurations.

5. Start the application

```
npm start
```

6. Open your browser and navigate to `http://localhost:3000` to access gadgetPlus.

---


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