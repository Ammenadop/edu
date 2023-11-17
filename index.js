const express = require("express");
const cors = require("cors");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const bodyParser = require("body-parser");
const PocketBase = require("pocketbase/cjs");
const app = express();
const port = process.env.PORT || 8080;
app.use(bodyParser.json());
app.use(cors());
const db = new PocketBase("https://edunest.org");
const axios = require("axios");
const token =
  "Zoho-enczapikey PHtE6r1ZQLrr3zJ79RVW5fO+QpWtMtsq/r5nLwAStYpFAqMEHU1RqIx/lDG/qxgqA/lGFKGanI45s76Y5e+Hdzu7NjsZWWqyqK3sx/VYSPOZsbq6x00UsVsbcUfbU4Poc9Fu0yTUu9vZNA==";
const url = "https://api.zeptomail.in/v1.1/email/template/batch";

apiKey = "AFGWMFF-XJEMVW9-QTQVPDB-80XQ6B3";

app.post("/api/sendMail", async (req, res) => {
  try {
    let otp = Math.floor(Math.random() * 899999 + 100000);
    let myHeaders = {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    };
    var raw = JSON.stringify({
      template_key:
        "2518b.742b7037c8003a47.k1.74c9b730-8479-11ee-8769-52540038fbba.18bd80c5223",
      bounce_address: "bounce@noreply.edunest.org",
      from: { address: "noreply@edunest.org", name: "Edunest Impex" },
      to: [
        {
          email_address: { address: req.body.email, name: req.body.name },
          merge_info: {
            name: req.body.name,
            otp: otp,
          },
        },
      ],
    });

    var requestOptions = {
      headers: myHeaders,
      method: "POST",
      body: raw,
    };

    var datas = {
      cid: req.body.id,
      otp: otp,
      time : req.body.time,
      address : req.body.address
    };
    await db
      .collection("otp")
      .create(datas)
      .then(async () => {
        await fetch(url, requestOptions)
          .then((response) => response.text())
          .then((result) => {
            return res.status(200).send({ message: result });
          })
          .catch((error) => {
            return res.status(401).send({ message: error });
          });
      });
  } catch (e) {
    return res.status(201).send(e);
  }
});

app.post("/api/createPayment", async (req, res) => {
  try {
    var data = {
      price_amount: req.body.amount,
      price_currency: "usd",
      pay_currency: "USDTBSC",
      ipn_callback_url: "https://api.nowpayments.io",
      order_id: req.body.order_id,
      order_description: `Course Payment for ${req.body.name}`,
    };
    const headers = {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    };
    axios
      .post("https://api.nowpayments.io/v1/payment", data, { headers })
      .then((response) => {
        res.status(200).send({ message: response.data });
      })
      .catch((error) => {
        res.status(500).send({ error: "Internal Server Error" });
      });
  } catch (e) {
    return res.status(500).send({ error: "Internal Server Error" });
  }
});

app.post("/api/getPayment", async (req, res) => {
  try {
    const payId = req.body.payId;
    const headers = {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    };

    axios
      .get(`https://api.nowpayments.io/v1/payment/${payId}`, { headers })
      .then((response) => {
        res.status(200).send({ message: response.data });
      })
      .catch((error) => {
        res.status(500).send({ error: "Internal Server Error" });
      });
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
