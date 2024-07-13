"use client";
import React from "react";
import Connect from "./connect/page";
import { Box, Button, Image, Text, Center, Anchor } from "@mantine/core";
import classes from "./page.module.css";
import { IconCircuitBattery } from "@tabler/icons-react";

export default function Home() {
  return (
    <Box mt="10">
       <Center>
        <Anchor
          variant="gradient"
          gradient={{ from: "purple", to: "green" }}
          fw={500}
          fz="1.5rem"
          href="#text-props"
        >
          High bandwidth Tor network.
        </Anchor>
        <Text size="lg" gradient={{ from: "purple", to: "green" }}></Text>
      </Center>
      <Center>
        <Anchor
          mb="xl"
          variant="gradient"
          gradient={{ from: "purple", to: "green" }}
          fw={500}
          fz="1.5rem"
          href="#text-props"
        >
          Incentivised by the Bitcoin Lightning Network.
        </Anchor>
        <Text size="lg" gradient={{ from: "purple", to: "green" }}></Text>
      </Center>
      <Center>
        <div
          style={{
            width: 230,
            height: 200,
            cursor: "pointer",
            marginBottom: "xl",
            transition: "background 0.3s ease-in-out",
          }}
          onClick={(event) => {
            event.preventDefault();
            window.location.href = "/connect";
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = ".7";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
        >
          <Image
            src="/eltor-logo.png"
            alt="Logo"
            width={230}
            height={200}
            style={{ cursor: "pointer" }}
            mb="xl"
            onClick={(event) => {
              event.preventDefault();
              window.location.href = "/connect";
            }}
          />
        </div>
      </Center>
      <Center>
        <Button
          mt="xl"
          color="purple"
          w="230"
          fz="1rem"
          rightSection={
            <IconCircuitBattery className={classes.linkIcon} stroke={1.5} />
          }
          onClick={(event) => {
            event.preventDefault();
            window.location.href = "/connect";
          }}
        >
          Connect to El Tor
        </Button>
      </Center>
      <Center>
        <Anchor
          mt="xl"
          variant="gradient"
          gradient={{ from: "purple", to: "green" }}
          fw={500}
          fz="1.2rem"
          href="#text-props"
        >
          More decentralized. More Secure.
        </Anchor>
        <Text size="lg" gradient={{ from: "purple", to: "green" }}></Text>
      </Center>
      <Center>
        <Anchor
          variant="gradient"
          gradient={{ from: "purple", to: "green" }}
          fw={500}
          fz="1.2rem"
          href="#text-props"
        >
          Relays earn sats.
        </Anchor>
        <Text size="lg" gradient={{ from: "purple", to: "green" }}></Text>
      </Center>
    </Box>
  );
}
