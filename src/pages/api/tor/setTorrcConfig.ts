import { torTelnetService } from "@/services/torTelnetService";


export type TorTypeTorrcConfig = {
  ip: string,
  relay: string,
  torrcPath: string
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      // Parse the JSON data from the request body
      const { bolt12, rate, relayType } = req.body;

      // Validate that the required fields are present
      if (!bolt12 || !rate || !relayType) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const success = await torTelnetService(
        [
          `SETCONF ElTorBolt12Offer=${bolt12}`,
          `SETCONF ElTorSatsRate=${rate}`,
          "SAVECONF"
        ],
        {
            controlHost: '127.0.0.1',
            controlPort: process.env.TOR_RELAY_CONTROL_PORT ?? "8057",
            torrcPath: process.env.TOR_RELAY_TORRC_PATH ?? ''
        }
      );

      // Respond with a success message
      return res.status(success ? 200 : 500).json({
        message: success ? "Success" : "Failed",
        data: {
            ip: process.env.TOR_RELAY_IP_ALIAS,
            relay: process.env.TOR_RELAY_NAME,
            torrcPath: process.env.TOR_RELAY_TORRC_PATH ?? ''
        } as TorTypeTorrcConfig,
      });
    } catch (error) {
      // Handle any errors that occurred during processing
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
