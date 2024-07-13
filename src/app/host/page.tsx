"use client";
import React, { useEffect, useState } from "react";
import {
  Text,
  Box,
  Group,
  TextInput,
  Badge,
  Title,
  MultiSelect,
  NumberInput,
  Button,
  Center,
  Anchor,
} from "@mantine/core";
import {
  IconCheck,
  IconCircuitBattery,
  IconCoinBitcoin,
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import ConnectedCircle from "@/components/ConnectedCircle";
import { type PhoenixTypeBalance } from "@/services/phoenixApi";
import { get } from "http";
import { TorTypeTorrcConfig } from "@/pages/api/tor/setTorrcConfig";
import { CodeHighlight } from "@mantine/code-highlight";

export default function Host() {
  const [loading, setLoading] = useState(false);
  const [isHosting, setIsHosting] = useState(localStorage.getItem("isHosting"));
  const [bolt12, setBolt12] = useState(localStorage.getItem("bolt12"));
  const [rate, setRate] = useState(localStorage.getItem("rate") ?? "1");
  const [balance, setBalance] = useState({} as PhoenixTypeBalance);
  const [torrc, setTorrc] = useState({} as TorTypeTorrcConfig);

  const form = useForm({
    initialValues: {
      bolt12,
      relayType: [],
      rate: 1,
    },
    validate: {
      bolt12: (value) => (value.length > 0 ? null : "Bolt12 is required"),
      rate: (value) => (value > 0 ? null : "Rate must be positive"),
    },
  });
  const handleSubmit = async (values) => {
    console.log(values);
    setLoading(true);

    localStorage.setItem("bolt12", values.bolt12);
    setBolt12(values.bolt12);

    localStorage.setItem("rate", values.rate);
    setRate(values.rate);

    localStorage.setItem("isHosting", "true");
    setIsHosting("true");

    try {
      const res = await fetch("/api/tor/setTorrcConfig", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const torrcConfig = (await res.json()) as TorTypeTorrcConfig;
      setTorrc(torrcConfig);
      console.log(torrcConfig);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getBalance = async () => {
    const resp = await fetch("/api/phoenix/getBalance");
    const balance = (await resp.json()) as PhoenixTypeBalance;
    setBalance(balance);
  };

  useEffect(() => {
    getBalance(); // Initial call
    const intervalId = setInterval(() => {
      getBalance();
    }, 3000); // Call getBalance every 3 seconds
    // return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return (
    <Box style={{ color: "white", maw: "960px" }}>
      <Center mb="sm">
        <Title order={2}>Host a Relay</Title>
        <br />
      </Center>
      <Center>
        <Badge color="purple">Get paid to run a Tor relay</Badge>
      </Center>

      <Center>
        <Group mt="lg" w="600" justify="space-evenly">
          {isHosting === "false" && (
            <>
              <TextInput
                w="600"
                label="Bolt12 Offer"
                description="Input your bolt12 offer that will be used to receive payment from clients using your relay."
                placeholder="lno..."
                {...form.getInputProps("bolt12")}
              />
              <MultiSelect
                w="600"
                label="Relay Type"
                placeholder="Pick value"
                data={["Guard", "Middle", "Exit"]}
                {...form.getInputProps("relayType")}
              />
              <NumberInput
                w="600"
                label="Rate"
                placeholder="5"
                suffix=" sats per 10 minutes"
                defaultValue={5}
                mt="md"
                {...form.getInputProps("rate")}
              />

              <Button
                mt="lg"
                size="lg"
                w="600"
                variant="filled"
                color="purple"
                radius="xl"
                rightSection={<IconCoinBitcoin size={22} />}
                loading={loading}
                onClick={() => handleSubmit(form.values)}
              >
                Start relay and earn sats!
              </Button>
            </>
          )}
          {isHosting === "true" && (
            <Box mt="xl">
              <ConnectedCircle sats={balance.balanceSat} />
              <Center mt="xl">
                <Anchor
                  style={{ color: "white" }}
                  onClick={() => {
                    localStorage.setItem("isHosting", "false");
                    setIsHosting("false");
                  }}
                >
                  Stop
                </Anchor>
              </Center>
            </Box>
          )}
        </Group>
      </Center>
      {isHosting === "true" && (
        <Center mt="xl">
          <CodeHighlight
            code={JSON.stringify(torrc, null, 2)}
            language="json"
            withCopyButton={false}
          />
        </Center>
      )}
    </Box>
  );
}
