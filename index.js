const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const axios = require("axios");
const port = process.env.PORT || 3000; // Fallback port if PORT is not defined

app.listen(port, () => {
    console.log(`App is running at localhost:${port}`);
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

const MPESA_TOKEN_URL = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
const MPESA_STK_PUSH_URL = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";



const generateToken = async () => {
    try {
        const secret = process.env.MPESA_SECRET_KEY;
        const consumer = process.env.MPESA_CONSUMER_KEY;
        const auth = Buffer.from(`${consumer}:${secret}`).toString("base64");
        const response = await axios.get(MPESA_TOKEN_URL, {
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });
        return response.data.access_token;
    } catch (error) {
        throw new Error(error.message);
    }
};

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
};

app.use(errorHandler);

app.post("/stk", async (req, res, next) => {
    try {
        const token = await generateToken();
        const phone = req.body.phone.substring(1);
        const amount = req.body.amount;
        const date = new Date();
        const timestamp = `${date.getFullYear()}${("0" + (date.getMonth() + 1)).slice(-2)}${("0" + date.getDate()).slice(-2)}${("0" + date.getHours()).slice(-2)}${("0" + date.getMinutes()).slice(-2)}${("0" + date.getSeconds()).slice(-2)}`;
        const shortcode = process.env.MPESA_PAYBILL;
        const passkey = process.env.MPESA_PASSKEY;
        const password = Buffer.from(shortcode + passkey + timestamp).toString("base64");
        const response = await axios.post(MPESA_STK_PUSH_URL, {
            "BusinessShortCode": process.env.MPESA_PAYBILL,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": amount,
            "PartyA": `254${phone}`,
            "PartyB": shortcode,
            "PhoneNumber": `254${phone}`,
            "CallBackURL": "https://mydomain.com/pat",
            "AccountReference": `254${phone}`,
            "TransactionDesc": "Test"
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(response.data);
        res.status(200).json(response.data);
    } catch (error) {
        next(error);
    }
});
