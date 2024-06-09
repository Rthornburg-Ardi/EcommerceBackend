# EcommerceBackend
This is a simple backend component for an e-commerce platform.
# Ecommerce Backend
## Description

E-Commerce makes up a substantial and ever-growing portion of all commerce, and every e-commerce site needs a method for managing stock and prices. This project is a backend solution to the problem of inventory management, pulling in PostgreSQL and Sequelize for strong database management. The application facilitates Create, Read, Update, and Delete (CRUD) operations for Categories, Products, and Tags, providing a foundation for tracking and modifying inventory. The Category, Product, and Tag models have specific associations which allow data to be stored logically, without redundancy. These model relationships have been designed with the real-world needs of e-commerce companies in mind. Products can be organized and filtered by category, and additional labels (tags) can be applied to products across categories without impacting their overall categorization. (Think adding a "clearance" tag to many products across the "Shirts", "Music", and "Shoes" categories.) User-friendly, informative JSON messages are sent to help clarify the results of a HTTP request, especially for update and delete operations. In cases when errors occur, they are handled appropriately to help the user understand any unexpected results.

Feel free to read through the [Usage](#usage) section, follow along with the [walkthrough video](https://drive.google.com/file/d/1W1GBxemGA-poWfhu6U2j2UA6V7k9SAX_/view?usp=sharing), or clone and run the API to learn more!

## Table of Contents

[Installation](#installation)

[Usage and Features](#usage-and-features)

[Contributing](#contributing)

[Credits](#credits)

[Questions](#questions)

[License](#license)

## Installation
1. Clone the repo:
    ```sh
    [git clone https://github.com/Rthornburg-Ardi/EcommerceBacken]
    ```

2. Navigate to the project directory:
    ```
    cd e-commerce-retail-platform
    ```

3. Install NPM packages:
    ```sh
    npm install
    ```

4. Create a .env file with the following environmental variables:
    ```sh
    DB_NAME='ecommerce_db'
    DB_USER=<your PostgreSQL username, in quotes>
    DB_PASSWORD=<your PostgreSQL password, in quotes>
    ```

5. Log in to the PostgreSQL terminal, run the schema.sql file, and exit out of the PostgreSQL terminal:
    ```sh
    psql -U <your PostgreSQL username>
    *enter your PostgreSQL password when prompted*
    \i db/schema.sql;
    \q
    ```

6. Seed the database:
    ```
    npm run seed
    ```

7. Start the application:
    ```
    npm run start
    ```
    
5. When the server is running, you will see a message in your terminal with the number of the port the server is listening on. If the port is the default, 3001, the base URI for HTTP requests will be `localhost:3001`. Throughout the [Usage](#usage) section, example URIs will be given assuming a port number of 3001; make sure to use your port number if the app is listening on a different port. 

## Usage and Features

### Database Operations for Categories

#### Read (GET) All Categories

Open the API client of your choosing and send a GET request to localhost:3001/api/categories to see all categories (based on the seed data). The response will be an array of objects starting with the category named "Shirts", id of 1. It should look like the following image:

![get all categories](/Assets/img/image-1.png)

#### Read (GET) a Single Category

To find a single category by id, send a GET request to localhost:3001/api/categories/:id using the desired category's id as the request parameter. For example, the following GET request to localhost:3001/api/categories/1 retrieves only the category with the id of 1: 

![get single category](./Assets/img/image-2.png)

#### Create (POST) a New Category

Create a new category by sending a POST request to localhost:3001/api/categories, making sure to include the category_name in the request body. The below request creates a new category with the category_name "Jackets."

![post category](./Assets/img/image-7.png)

#### Update (PUT) a Category

If you need to modify an already existing category, send a PUT request to localhost:3001/api/categories/:id with the updated information in the request body. The below request changes the category_name of the previously created category (with the id of 6) from "Jackets" to "Indie Music."

![put category](./Assets/img/image-8.png)

#### Delete (DELETE) a Category

The final route for categories is the DELETE route, localhost:3001/api/categories/:id (where :id is the id of the category to be deleted). In the below screenshot, the "Indie Music" category with id=6 is deleted from the database.

![delete category](./Assets/img/image-9.png)

### Database Operations for Products

#### Read (GET) All Products

A GET request to localhost:3001/api/products will fetch all products, along with their category and tag data. The below 3 screenshots show the nested structure of the array of product objects returned.

![get all products img1](./Assets/img/image-10.png)

![get all products img2](./Assets/img/image-11.png)

![get all products img3](./Assets/img/image-12.png)


#### Read (GET) a Single Product

A GET request to localhost:3001/api/products/:id will return a single product by id. The below screenshot shows the structure of the product with id = 1, which has a product_name of "Plain T-Shirt."

![get single product](./Assets/img/image-13.png)

#### Create (POST) a New Product

To create a new product, send a POST request to localhost:3001/api/products including the following in the JSON request body: product_name, price, stock, and any tagIds (tagIds should be an array of tag_ids representing the tags that apply to that product). 

If you provide tagIds in the request body, the response will be the array of productTagId's created from the tagIds you provided. The ProductTag model is used as a joint table that facilitates the many-to-many relationship between Product and Tag, and using this structure gives us a clean way to work with that many-to-many relationship. The below 2 screenshots show examples of (1) the POST request with the array of productTagId's as the response, and (2) the full, newly created product.

![post product img1](./Assets/img/image-14.png)

![post product img2](./Assets/img/image-15.png)

If you do not provide tagIds in the request body (you should still provide the tagIds property, but just use an empty array for the value), the response will be the newly created product itself—see the below screenshot for an example. 

![post product img3](./Assets/img/image-16.png)


#### Update (PUT) a Product

To update a product, send a PUT request to localhost:3001/api/products/:id, including the values for product_name, price, stock, and tagIds which you'd like the updated product to have. The response will be a number of rows updated. 

![put product](./Assets/img/image-17.png)


#### Delete (DELETE) a Product

Deleting a product requires only the id of the product to be deleted, used as a request parameter in the URI endpoint (send requests to localhost:3001/api/products/:id). The below screenshot shows a successful deletion of the product with the id of 6. The response is the number of rows deleted.

![delete product](./Assets/img/image-18.png)

### Database Operations for Tags

#### Read (GET) All Tags

Send a GET request to localhost:3001/api/tags to view all tags. The below screenshot shows the full structure of the first tag which appears (the tag with the id of 1).

![get all tags](./Assets/img/image-19.png)

#### Read (GET) a Single Tag

GET a single tag by id by sending a GET request to localhost:3001/api/tags/:id. In the below screenshot, the id of 1 in the request parameter retrieved the tag with the id of 1. 

![get single tag](./Assets/img/image-20.png)

#### Create (POST) a New Tag

Creating a new tag is simple—just send a POST request to localhost:3001/api/tags, including the tag_name in the request body, similar to the below screenshot: 

![post tag](./Assets/img/image-21.png)

#### Update (PUT) a Tag

To update a tag, send a PUT request to localhost:3001/api/tags/:id while including the new tag_name in the request body. In the below screenshot, the previously created tag with the tag_name of "on sale" is changed to have a tag_name of "clearance."

![update tag](./Assets/img/put-tag.png)

#### Delete (DELETE) a Tag

To delete a tag, send a DELETE request to localhost:3001/api/tags/:id, where the id request parameter is the id of the tag to be deleted. 

![delete tag](./Assets/img/image-22.png)


## Contributing
Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## Questions

My GitHub username is Rthornburg-Ardi if you would like to connect or view our other projects. Feel free to reach out to us at https://github.com/Rthornburg-Ardi/ or thornburg.rebeca1@gmail.com if you have any further questions about this project, and I'll be glad to assist.

## License

This project is covered under the MIT License. You can learn more about this license and its coverage and permissions [here](https://opensource.org/licenses/MIT).
