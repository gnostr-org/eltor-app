import fs from "fs";
import path from "path";
import os from "os";
import { Telnet } from "telnet-client";
import { payBolt12Offer } from "@/services/phoenixApi";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return await pay(req, res);
  }
}

async function pay(req, res) {
  const { fake, offer, amountSats } = req.query;

  const paymentData = await payBolt12Offer(offer, amountSats)
  return res.status(200).json(paymentData);

  //   if (!password || !customKey || !customValue) {
  //     return res.status(400).json({ error: "Missing required fields" });
  //   }

  // Path to the Tor control cookie
  const cookiePath = path.join(
    process.env.TOR_BROWSER_TORRC_PATH,
    "control_auth_cookie"
  );

  // Read the cookie file
  let cookie;
  try {
    cookie = fs.readFileSync(cookiePath);
  } catch (err) {
    return res.status(500).json({ error: "Failed to read control cookie" });
  }

  // Convert the binary cookie to a hexadecimal string
  const hexCookie = cookie.toString("hex");

  // Telnet connection parameters
  const connection = new Telnet();
  const params = {
    host: process.env.TOR_BROWSER_CONTROL_HOST || "127.0.0.1",
    port: process.env.TOR_BROWSER_CONTROL_PORT || 9051,
    negotiationMandatory: false,
    timeout: 1500,
  };

  try {
    await connection.connect(params);

    for (let i = 1; i <= 7; i++) {
      const randomPreimage =
        fake === "1"
          ? generateRandomPreimage()
          : "68b4e782fafbd5a057ec4c277f01da48db73dd67326ec4458ff89daffba186e3";
      const randomPaymentHash =
        fake === "1"
          ? generateRandomPreimage()
          : "16ea179e9332918b90124b60ecd9b1fe3e08b9e997a058f188ed20cea34a5e0e";

      // Authenticate with the Tor control port using the hexadecimal cookie
      await connection.send(
        `AUTHENTICATE ${hexCookie}\r\nSETCONF ElTorPreimageHop${i}=${randomPreimage}\r\nSETCONF ElTorPayHashHop${i}=${randomPaymentHash}\r\nSAVECONF\r\n`
      );
    }
    res.status(200).json(paymentData);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to set configuration: ${error.message}` });
  }
}

function generateRandomPreimage() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let preimage = "";
  for (let i = 0; i < 64; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    preimage += characters[randomIndex];
  }
  return preimage;
}
