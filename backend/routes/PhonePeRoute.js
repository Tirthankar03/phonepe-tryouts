// const express = require("express");

// const router = express.Router();

// const crypto = require("crypto");

// const axios = require("axios");

// function generateTransactionID() {
//   const timestamp = Date.now();

//   const randomNum = Math.floor(Math.random() * 1000000);

//   const merchantPrefix = "T";

//   const transactionID = `${merchantPrefix}${timestamp}${randomNum}`;

//   return transactionID;

//   I;
// }

// router.post("/payment", async (req, res) => {
//   try {
//     const { name, number, amount } = req.body;

//     const data = {
//       merchantId: "PGTESTPAYUAT",
//       merchantTransactionId: generateTransactionID(),
//       merchantUserId: "MUID9EFW8E9F89EWF8C",
//       name: name,
//       amount: 100 * 100,
//       redirectUrl: `http://localhost:5000/api/phonepe/status`,
//       redirectMode: "POST",
//       mobileNumber: number,
//       paymentInstrument: {
//         type: "PAY_PAGE",
//       },
//     };
//     const payload = JSON.stringify(data);
//     const payloadMain = Buffer.from(payload).toString("base64");
//     const key = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
//     const keyIndex = 1;
//     const string = payloadMain + "/pg/v1/pay" + key;
//     const sha256 = crypto.createHash("sha256").update(string).digest("hex");
//     const checksum = sha256 + "###" + keyIndex;

//     //////////////////////////////////////////////////////////////////////////////////////////////////////
//     const URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";

//     // const URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay"

//     const options = {
//       method: "POST",
//       url: URL,
//       headers: {
//         accept: "application/json",
//         "Content-Type": "application/json",
//         "X-VERIFY": checksum,
//       },
//       data: {
//         request: payloadMain,
//       },
//     };

//     axios
//       .request(options)
//       .then(function (response) {
//         console.log(response.data);
//         return res.redirect(
//           response.data.data.instrumentResponse.redirectInfo.url
//         );
//         return res
//           .status(200)
//           .send(response.data.data.instrumentResponse.redirectInfo.url);
//       })
//       .catch(function (error) {
//         console.error(error);
//       });

//     /////////////////////////////////////////////
//   } catch (err) {
//     console.log(err);
//   }
// });

// router.post("/status", async (req, res) => {
//   const merchantTransactionId = res.req.body.transactionId;

//   const merchantId = res.req.body.merchantId;

//   const keyIndex = 1;

//   const key = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";

//   const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + key;

//   const sha256 = crypto.createHash("sha256").update(string).digest("hex");

//   const checksum = sha256 + "###" + keyIndex;

//   const URL = `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`;

//   // const URL = https://api.phonepe.com/apis/hermes/pg/v1/status/M1WWAWTN8661/${merchantTransactionId}

//   const options = {
//     method: "GET",
//     url: URL,
//     headers: {
//       accept: "application/json",
//       "Content-Type": "application/json",
//       "X-VERIFY": checksum,
//       "X-MERCHANT-ID": merchantId,
//     },
//   };

//   axios.request(options).then(async (response) => {
//     console.log(response).catch((error) => {
//       console.error(error);
//     });
//   });
// });

// modules.exports = router;


//2
import express from 'express';
import crypto from 'crypto';
import axios from 'axios';
import uniqid from 'uniqid'


const router = express.Router();

// function generateTransactionID() {
//   const timestamp = Date.now();
//   const randomNum = Math.floor(Math.random() * 1000000);
//   const merchantPrefix = "T";
//   return `${merchantPrefix}${timestamp}${randomNum}`;
// }

let merchantTransactionId = uniqid();
let MERCHANT_ID = "PGTESTPAYUAT86"

router.post("/payment", async (req, res) => {
  try {
    const { name, number, amount, userId } = req.body;

    

    const data = {
      // merchantId: "PGTESTPAYUAT",
      merchantId: MERCHANT_ID,
      // merchantTransactionId: generateTransactionID(),
      merchantTransactionId: merchantTransactionId,
      merchantUserId: 'MUID9EFW8E9F89EWF8C',
      name: name,
      amount: amount * 100,
      redirectUrl: `http://localhost:5000/api/phonepe/status/${merchantTransactionId}`,
      redirectMode: "POST",
      mobileNumber: number,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    const payload = JSON.stringify(data);
    const payloadMain = Buffer.from(payload).toString("base64");
    const key = "96434309-7796-489d-8924-ab56988a6076";
    const keyIndex = 1;
    const string = payloadMain + "/pg/v1/pay" + key;
    const sha256 = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = `${sha256}###${keyIndex}`;

    const URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";
    const PROD_URL= 'https://api.phonepe.com/apis/hermes/pg/v1/pay'

    const options = {
      method: "POST",
      url: URL,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
      data: {
        request: payloadMain,
      },
    };

    const response = await axios.request(options);
    console.log("response after making the api call to phone pay, must return redirect url>>>>>>>>>>> ");

    const redirectUrl = response.data.data.instrumentResponse.redirectInfo.url;


    console.log('the redirectUrl>>>>', redirectUrl);

    return res.status(200).json(redirectUrl);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

// router.get("/status/:merchantTransactionId", async (req, res) => {
//   try {
//     const { merchantTransactionId } = req.params;

//     const key = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
//     const keyIndex = 1;
//     const string = `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}${key}`;
//     const sha256 = crypto.createHash("sha256").update(string).digest("hex");
//     const checksum = `${sha256}###${keyIndex}`;

//     const URL = `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}`;

//     const options = {
//       method: "GET",
//       url: URL,
//       headers: {
//         accept: "application/json",
//         "Content-Type": "application/json",
//         "X-VERIFY": checksum,
//         "X-MERCHANT-ID": MERCHANT_ID,
//       },
//     };

//     const response = await axios.request(options);
//     console.log("response in /status>>>>>>>>>>>>",response.data);
//     return res.status(200).send(response.data);
//   } catch (error) {
//     console.error(" error in payment status>>>>>>>>>>>>", error);
//     return res.status(500).send("Internal Server Error");
//   }
// });


router.post("/status/:tnxId", async (req, res) => {
  try {
    // const { merchantTransactionId } = req.params;

    const merchantTransactionId = res.req.body.transactionId

    console.log('merchantTransactionId>>>>>', merchantTransactionId);

    const merchantId = res.req.body.merchantId

    console.log('merchantId>>>>>', merchantId);




    const SALT_KEY = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
    const keyIndex = 1;
    const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}${SALT_KEY}`;
    const sha256 = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = `${sha256}###${keyIndex}`;

    const URL = `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`;

    const options = {
      method: "GET",
      url: URL,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-MERCHANT-ID": `${merchantId}`,
      },
    };

    const response = await axios.request(options);
    console.log("response in /status>>>>>>>>>>>>",response.data);
    if (response.data.success === true) {
      const url = 'http://localhost:5175/success'
      return res.redirect(url)
    }else {
      const url = 'http://localhost:5175/failure'
      return res.redirect(url)
    }
    // return res.status(200).json(response.data);
  } catch (error) {
    console.error(" error in payment status>>>>>>>>>>>>", error);
    return res.status(500).send("Internal Server Error");
  }
});

export default router;













//3
// import express from 'express';
// import crypto from 'crypto';
// import axios from 'axios';

// const router = express.Router();

// // Define the retry mechanism
// const MAX_RETRIES = 5;
// const RETRY_DELAY = 1000; // Initial delay in ms

// async function makeRequestWithRetry(options, retries = MAX_RETRIES) {
//   try {
//     const response = await axios.request(options);
//     return response;
//   } catch (error) {
//     if (retries > 0 && error.response && error.response.status === 429) {
//       const delay = RETRY_DELAY * (MAX_RETRIES - retries + 1);
//       console.log(`Retrying request in ${delay} ms...`);
//       await new Promise((resolve) => setTimeout(resolve, delay));
//       return makeRequestWithRetry(options, retries - 1);
//     }
//     throw error;
//   }
// }

// function generateTransactionID() {
//   const timestamp = Date.now();
//   const randomNum = Math.floor(Math.random() * 1000000);
//   const merchantPrefix = "T";
//   return `${merchantPrefix}${timestamp}${randomNum}`;
// }

// router.post("/payment", async (req, res) => {
//   try {
//     const { name, number, amount } = req.body;

//     const data = {
//       merchantId: "PGTESTPAYUAT",
//       merchantTransactionId: generateTransactionID(),
//       merchantUserId: "MUID9EFW8E9F89EWF8C",
//       name: name,
//       amount: amount * 100,
//       redirectUrl: `http://localhost:5000/api/phonepe/status`,
//       redirectMode: "POST",
//       mobileNumber: number,
//       paymentInstrument: {
//         type: "PAY_PAGE",
//       },
//     };

//     const payload = JSON.stringify(data);
//     const payloadMain = Buffer.from(payload).toString("base64");
//     const key = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
//     const keyIndex = 1;
//     const string = payloadMain + "/pg/v1/pay" + key;
//     const sha256 = crypto.createHash("sha256").update(string).digest("hex");
//     const checksum = `${sha256}###${keyIndex}`;

//     const URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";

//     const options = {
//       method: "POST",
//       url: URL,
//       headers: {
//         accept: "application/json",
//         "Content-Type": "application/json",
//         "X-VERIFY": checksum,
//       },
//       data: {
//         request: payloadMain,
//       },
//     };

//     const response = await makeRequestWithRetry(options);
//     console.log(response.data);

//     const redirectUrl = response.data.data.instrumentResponse.redirectInfo.url;
//     return res.redirect(redirectUrl);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send("Internal Server Error");
//   }
// });

// router.post("/status", async (req, res) => {
//   try {
//     const { transactionId, merchantId } = req.body;
//     const key = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
//     const keyIndex = 1;
//     const string = `/pg/v1/status/${merchantId}/${transactionId}${key}`;
//     const sha256 = crypto.createHash("sha256").update(string).digest("hex");
//     const checksum = `${sha256}###${keyIndex}`;

//     const URL = `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${transactionId}`;

//     const options = {
//       method: "GET",
//       url: URL,
//       headers: {
//         accept: "application/json",
//         "Content-Type": "application/json",
//         "X-VERIFY": checksum,
//         "X-MERCHANT-ID": merchantId,
//       },
//     };

//     const response = await makeRequestWithRetry(options);
//     console.log(response.data);
//     return res.status(200).send(response.data);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send("Internal Server Error");
//   }
// });

// export default router;

