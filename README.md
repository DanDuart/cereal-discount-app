# Cereal Discount App

This project implements a simple discount calculator using Node.js and Restify.

## Requirements

- [Node.js](https://nodejs.org/) installed (v14 LTS recommended)
- [Git](https://git-scm.com/) installed

## How to Download and Run the Project Locally

1. Clone the repository:

  ```bash
  git clone https://github.com/DanDuart/cereal-discount-app.git
  ```

2. Navigate to the project directory:

  ```bash
  cd cereal-discount-app
  ```

3. Install dependencies:

  ```bash
  npm install
  ```

4. Start the server:

  ```bash
  npm start
  ```
The server will be running at http://localhost:3000.

# Using the API

## Endpoint

- `POST /calculateDiscount`

## Example Request (Postman)

1. Open Postman and create a new request.

2. Set the URL to `http://localhost:3000/calculateDiscount.`

3. Choose the POST method.

4. In the request body, provide the cart data in JSON format.

  ```json
  {
    "cart": {
      "reference": "2d832fe0-6c96-4515-9be7-4c00983539c1",
      "lineItems": [
        { "name": "Peanut Butter", "price": "39.0", "sku": "PEANUT-BUTTER" },
        { "name": "Fruity", "price": "34.99", "sku": "FRUITY" },
        { "name": "Chocolate", "price": "32", "sku": "CHOCOLATE" }
      ]
    }
  }
  ```

5. Send the request.
## Example Response
The response will be a JSON containing the discounted price.

```json
{
  "discountedPrice": "89.99"
}
```
