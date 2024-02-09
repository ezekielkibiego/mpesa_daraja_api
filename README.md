# M-Pesa STK Push Service Documentation

This documentation provides an overview of the M-Pesa STK Push service implemented in the provided code.

## Overview

The M-Pesa STK Push service allows businesses to initiate payments on behalf of customers through the M-Pesa API. This service utilizes the Safaricom Daraja API, specifically the STK Push API, to initiate payments from a customer's M-Pesa account to a designated business Paybill number.

## Setup and Dependencies

- `express`: A Node.js web application framework used for handling HTTP requests and responses.
- `dotenv`: A module for loading environment variables from a `.env` file into `process.env`.
- `cors`: Middleware for enabling Cross-Origin Resource Sharing (CORS) in the Express application.
- `axios`: A promise-based HTTP client for making requests to external APIs.

## Configuration

- Ensure you have a `.env` file in your project directory with the following variables:
  - `PORT`: The port on which the Express server will run.
  - `MPESA_SECRET_KEY`: The secret key provided by Safaricom for M-Pesa API authentication.
  - `MPESA_CONSUMER_KEY`: The consumer key provided by Safaricom for M-Pesa API authentication.
  - `MPESA_PAYBILL`: The business Paybill number registered with M-Pesa.
  - `MPESA_PASSKEY`: The passkey provided by Safaricom for generating passwords used in M-Pesa transactions.

## Endpoints

- **POST /stk**: Initiates a payment request using M-Pesa STK Push.

  Request Body:
  ```json
  {
    "phone": "Customer's phone number",
    "amount": "Amount to be paid"
  }

Response:

- If successful, returns the response from the M-Pesa API.
- If an error occurs, returns a 500 status code along with an error message.

Error Handling:

Middleware function `errorHandler` is implemented to handle errors globally in the application. It logs the error stack and sends a generic error message with a 500 status code to the client.

Usage:

1. Ensure all environment variables are properly configured in the `.env` file.
2. Run `npm install` to install dependencies.
3. Run `npm start` to start the Express server.
4. Send a POST request to `/stk` with the customer's phone number and the amount to be paid in the request body.

Note:

- This code is configured to work with the Safaricom M-Pesa sandbox environment (`sandbox.safaricom.co.ke`). For production use, ensure you replace sandbox URLs with the corresponding production URLs.