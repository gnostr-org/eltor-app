import { payBolt12Offer } from "@/services/phoenixApi";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { fake, offer, amountSats } = req.query;
    const paymentData = await payBolt12Offer(offer, amountSats);
    return res.status(200).json(paymentData);
  }
}
