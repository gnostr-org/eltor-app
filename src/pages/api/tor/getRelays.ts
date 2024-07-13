import fs from "fs";
import path from "path";
import os from "os";

export default async function handler(req, res) {
  const filePath = path.join(
    os.homedir(),
    "code/chutney/net/nodes/browser/debug.log"
  );

  // Read the file
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      // Handle the error
      res.status(500).json({ error: "Failed to read file" });
      return;
    }

    const relayRegex =
      /onion_extend_cpath: Chose router \$([A-F0-9]+)~([a-zA-Z0-9]+) \[.*\] at ([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+) for hop #(\d+) \(exit is ([a-zA-Z0-9]+)\) \(bolt12 is ([a-zA-Z0-9]+)\) \(sats rate is (\d+)\)/;
    const circIDRegex =
      /(\w+ \d+ \d+:\d+:\d+\.\d+) \[debug\] circuit_deliver_create_cell: Chosen circID (\d+)\./;
    const lines = data.split("\n");
    const parsedData = [];
    let currentCircuit = null;

    // Get the current year
    const currentYear = new Date().getFullYear();

    // Search for the matching lines and parse the data
    lines.forEach((line) => {
      let match = line.match(relayRegex);
      if (match) {
        const [_, fingerprint, name, ip, hop, exit, bolt12, rate] = match;
        const relayData = {
          fingerprint,
          name,
          ip,
          hop: parseInt(hop, 10),
          exit,
          bolt12,
          rate: parseInt(rate, 10),
        };
        if (!currentCircuit) {
          currentCircuit = {
            relays: [],
          };
        }
        currentCircuit.relays.push(relayData);
      }

      match = line.match(circIDRegex);
      if (match && currentCircuit) {
        const [_, timestamp, circID] = match;
        // Append the current year to the timestamp
        const fullTimestamp = `${currentYear} ${timestamp}`;
        currentCircuit.circID = circID;
        currentCircuit.timestamp = new Date(fullTimestamp); // Parse the timestamp into a Date object

        // Only add the circuit if it has at least 3 relays
        if (currentCircuit.relays.length >= 3) {
          parsedData.push(currentCircuit);
        }

        currentCircuit = null; // Reset for the next circuit
      }
    });

    // Sort the parsed data by timestamp in descending order
    parsedData.sort((a, b) => b.timestamp - a.timestamp);
    // Send the parsed data as a response
    res.status(200).json(parsedData);
  });
}
