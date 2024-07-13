// Client Wallet
const payerUrl = process.env.TOR_BROWSER_PHOENIXD_URL;
const username = "";
const payerPassword = process.env.TOR_BROWSER_PHOENIXD_API_PASSWORD;
const payerAuth = btoa(`${username}:${payerPassword}`);

// Relay Wallet
const receiverUrl = process.env.TOR_RELAY_PHOENIXD_URL;
const receiverPassword = process.env.TOR_RELAY_PHOENIXD_API_PASSWORD;
const receiverAuth = btoa(`${username}:${receiverPassword}`);

export type PhoenixTypeBalance = {
  balanceSat: number;
  feeCreditSat: number;
};

export type PhoenixTypePayBolt12Offer = {
  recipientAmountSat: number;
  routingFeeSat: number;
  paymentId: string;
  paymentHash: string;
  paymentPreimage: string;
};

export async function getBalance() {
  const res = await fetch(`${receiverUrl}/getbalance`, {
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${receiverAuth}`,
    },
  });
  return (await res.json()) as PhoenixTypeBalance;
}

export async function payBolt12Offer(offer: string, amountSats: number) {
  const body = new URLSearchParams();
  body.append("amountSat", amountSats.toString());
  body.append("offer", offer);
  body.append("message", "");

  const res = await fetch(`${payerUrl}/payoffer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${payerAuth}`,
    },
    body: body.toString(),
  });
  return await res.json() as PhoenixTypePayBolt12Offer;
}
