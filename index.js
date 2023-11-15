const express = require("express");
const cors = require("cors");
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
const url = "https://api.zeptomail.in/v1.1/email";

apiKey = "AFGWMFF-XJEMVW9-QTQVPDB-80XQ6B3"
app.post("/api/sendMail", async (req, res) => {
  try {
    let otp = Math.floor(Math.random() * 899999 + 100000);
    const data = {
      from: {
        address: "noreply@edunest.org",
        name: "Edunest Impex",
      },
      to: [
        {
          email_address: {
            address: req.body.email,
            name: req.body.name,
          },
        },
      ],

      subject: "OTP for Withdrawal",
      htmlbody: `Dear ${req.body.name}, your OTP for withdrawal is ${otp}.`,
    };
    var datas = {
      cid: req.body.id,
      otp: otp,
    };
    await db
      .collection("otp")
      .create(datas)
      .then(async () => {
        await axios
          .post(url, data, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          })
          .then(() => {
            return res.status(200).send("1");
          })
          .catch(() => {
            throw new Error("0");
          });
      })
      .catch(() => {
        throw new Error("0");
      });
  } catch (e) {
    return res.status(201).send("0");
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
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    };
    axios
      .post("https://api.nowpayments.io/v1/payment", data, { headers} )
      .then((response) => {
        res.status(200).send({message : response.data})
      })
      .catch((error) => {
        res.status(500).send({ error: 'Internal Server Error' });
      });
  } catch (e) {
    return res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.post("/api/getPayment", async (req, res) => {
  try {
    const payId = req.body.payId; 
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    };

    axios
      .get(`https://api.nowpayments.io/v1/payment/${payId}`, { headers })
      .then((response) => {
        res.status(200).send({ message: response.data });
      })
      .catch((error) => {
        res.status(500).send({ error: 'Internal Server Error' });
      });
  } catch (e) {
    console.error(e); 
    return res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
