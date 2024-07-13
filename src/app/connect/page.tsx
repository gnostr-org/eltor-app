"use client";
import React, { useState } from "react";
import {
  Box,
  Center,
  Table,
  Button,
  Text,
  Code,
  Stepper,
  Group,
  Pill,
  RingProgress,
  ActionIcon,
  rem,
  Anchor,
} from "@mantine/core";
import { IconCheck, IconCircuitBattery } from "@tabler/icons-react";

export default function Connect() {
  const [active, setActive] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highestStepVisited, setHighestStepVisited] = useState(active);
  const [paymentData, setPaymentData] = useState({});
  // TODO hardcoded for phoenixd server
  const offer = process.env.NEXT_PUBLIC_TOR_RELAY_BOLT12OFFER;

  async function pay() {
    setLoading(true);
    const amountSats = 1
    try {
      const res = await fetch(`/api/pay?amountSats=${amountSats}&offer=${offer}`, {
        method: "GET",
      });
      const result = await res.json();
      console.log(result);
      setPaymentData(result)
      alert("Payment successful!");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleStepChange = (nextStep: number) => {
    const isOutOfBounds = nextStep > 3 || nextStep < 0;
    if (isOutOfBounds) {
      return;
    }
    setActive(nextStep);
    setHighestStepVisited((hSC) => Math.max(hSC, nextStep));
  };
  const shouldAllowSelectStep = (step: number) =>
    highestStepVisited >= step && active !== step;

  // TODO fetch from Tor Directory
  const elements = [
    {
      relay: 1,
      type: "Guard",
      fingerprint: "F366A7EED8DFAA4C48F0822AA4AE5F703424F07C",
      amount: "10",
      paid: true,
      offer,
      preimage: paymentData?.paymentPreimage ?? '',
      paymentHash: paymentData?.paymentHash ?? '',
    },
    {
      relay: 2,
      type: "Middle",
      fingerprint: "F366A7EED8DFAA4C48F0822AA4AE5F703424F07C",
      amount: "10",
      paid: true,
      offer:
        "lno1zrxq8pjw7qjlm68mtp7e3yvxee4y5xrgjhhyf2fxhlphpckrvevh50u0qf6edq9mpqfsx5u99az2gc9yp0cws880pfm75ext9dq86hj8hk2n5qsrd5qsq7jpllck3hel0sqylke99nlewauyt825dwlv2t9cpnaw0gksqva7cqnrnuk3hv40kuhp2j3qet9v5mgnccgh2wnhauqhdadnpsef6xu9akz9s65eqh2yya03xjhx6zqnrtg5qtmxv3m6803u9sa5pndq2lvpqxk3dan0tq293lex2catc355fhccsqqsmlvep7k249da75z7ky2qwldr2g",
      preimage:
        "68b4e782fafbd5a057ec4c277f01da48db73dd67326ec4458ff89daffba186e3",
      paymentHash:
        "16ea179e9332918b90124b60ecd9b1fe3e08b9e997a058f188ed20cea34a5e0e",
    },
    {
      relay: 3,
      type: "Middle",
      fingerprint: "F366A7EED8DFAA4C48F0822AA4AE5F703424F07C",
      amount: "5",
      paid: true,
      offer:
        "lno1zrxq8pjw7qjlm68mtp7e3yvxee4y5xrgjhhyf2fxhlphpckrvevh50u0qf6edq9mpqfsx5u99az2gc9yp0cws880pfm75ext9dq86hj8hk2n5qsrd5qsq7jpllck3hel0sqylke99nlewauyt825dwlv2t9cpnaw0gksqva7cqnrnuk3hv40kuhp2j3qet9v5mgnccgh2wnhauqhdadnpsef6xu9akz9s65eqh2yya03xjhx6zqnrtg5qtmxv3m6803u9sa5pndq2lvpqxk3dan0tq293lex2catc355fhccsqqsmlvep7k249da75z7ky2qwldr2g",
      preimage:
        "68b4e782fafbd5a057ec4c277f01da48db73dd67326ec4458ff89daffba186e3",
      paymentHash:
        "16ea179e9332918b90124b60ecd9b1fe3e08b9e997a058f188ed20cea34a5e0e",
    },
    {
      relay: 4,
      type: "Exit",
      fingerprint: "F366A7EED8DFAA4C48F0822AA4AE5F703424F07C",
      amount: "5",
      paid: true,
      offer:
        "lno1zrxq8pjw7qjlm68mtp7e3yvxee4y5xrgjhhyf2fxhlphpckrvevh50u0qf6edq9mpqfsx5u99az2gc9yp0cws880pfm75ext9dq86hj8hk2n5qsrd5qsq7jpllck3hel0sqylke99nlewauyt825dwlv2t9cpnaw0gksqva7cqnrnuk3hv40kuhp2j3qet9v5mgnccgh2wnhauqhdadnpsef6xu9akz9s65eqh2yya03xjhx6zqnrtg5qtmxv3m6803u9sa5pndq2lvpqxk3dan0tq293lex2catc355fhccsqqsmlvep7k249da75z7ky2qwldr2g",
      preimage:
        "68b4e782fafbd5a057ec4c277f01da48db73dd67326ec4458ff89daffba186e3",
      paymentHash:
        "16ea179e9332918b90124b60ecd9b1fe3e08b9e997a058f188ed20cea34a5e0e",
    },
  ];

  const rows = elements.map((element) => (
    <Stepper.Step
      key={element.relay}
      color="purple"
      label={`Relay ${element.relay} (${element.type})`}
      allowStepSelect={shouldAllowSelectStep(element.relay)}
      description={
        <Table.Tr key={element.relay} style={{ userSelect: "text" }}>
          <Table.Td>
            <Button
              color="purple"
              onClick={async () => {
                setActive(element.relay);
                await pay();
              }}
              loading={loading}
            >
              Pay
            </Button>
          </Table.Td>
          <Table.Td>
            <Text w="120px" size="sm">
              {element.amount} sats / 10 mins
            </Text>
          </Table.Td>
          <Table.Td
            style={{
              fontFamily: "monospace",
              whiteSpace: "pre-wrap",
            }}
          >
            <Code color="purple" style={{ color: "white" }}>
              Bolt12 Offer:
            </Code>
            <Text size="sm">{element.offer}</Text>
            <Code>Relay Fingerprint:</Code>
            <Text size="sm">{element.fingerprint}</Text>
            <Code>Preimage:</Code>
            <Text size="sm">{element.preimage}</Text>
            <Code>Payment Hash:</Code>
            <Text size="sm">{element.paymentHash}</Text>
          </Table.Td>
        </Table.Tr>
      }
    ></Stepper.Step>
  ));

  return (
    <Box style={{ color: "white" }}>
      <Center mb="xl" mt="xl">
        <Text size="lg">
          To connect to El Tor you must first pay all the relays in the circuit.
        </Text>
      </Center>
      <Center>
        <Button size="md" color="purple">
          Pay 4 sat for a 10 min circuit (4 relays)
        </Button>
      </Center>
      <Center>
        <Anchor
          mt="sm"
          variant="gradient"
          gradient={{ from: "purple", to: "green" }}
          fw={500}
          fz="lg"
          href="#text-props"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? "Hide" : "Show"} advanced options
        </Anchor>
      </Center>

      {showAdvanced && (
        <>
          <Group justify="space-between">
            <h2>Pay Relays</h2>
            <Box>
              <Group>
                <Pill
                  size="lg"
                  style={{ backgroundColor: "purple", color: "white" }}
                >
                  Tor Circuit - 10 mins for 30 sats
                </Pill>
                {active > 0 && (
                  <RingProgress
                    size={44}
                    thickness={6}
                    sections={[
                      {
                        value: active * 25,
                        color: active === 4 ? "teal" : "red",
                      },
                    ]}
                    label={
                      <>
                        {active === 4 && (
                          <Center>
                            <ActionIcon color="teal" variant="light">
                              <IconCircuitBattery
                                style={{ width: rem(18), height: rem(18) }}
                              />
                            </ActionIcon>
                          </Center>
                        )}
                      </>
                    }
                  />
                )}
              </Group>
            </Box>
          </Group>
          <Table.ScrollContainer minWidth={500} maw={960}>
            <Table verticalSpacing="sm">
              <Table.Tbody>
                <Stepper
                  active={active}
                  onStepClick={setActive}
                  orientation="vertical"
                >
                  {rows}
                </Stepper>
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </>
      )}
    </Box>
  );
}
