"use client";
// app/page.js or app/page.tsx
import React, { useState } from "react";
import { Box, Text, ScrollArea, Group, Center, Button } from "@mantine/core";
import classes from "./page.module.css";
import {
  IconBellRinging,
  IconFingerprint,
  IconKey,
  IconSettings,
  Icon2fa,
  IconDatabaseImport,
  IconReceipt2,
  IconSwitchHorizontal,
  IconLogout,
  IconCircuitBattery,
  IconCoinBitcoin,
} from "@tabler/icons-react";
import Image from "next/image";

const data = [
  { link: "/transactions", label: "Transactions", icon: IconReceipt2 },
  { link: "/relays", label: "Relays", icon: IconFingerprint },
  { link: "/settings", label: "Settings", icon: IconSettings },
];

const data2 = [
  { link: "", label: "Transactions", icon: IconReceipt2 },
  { link: "", label: "Relays", icon: IconFingerprint },
  { link: "", label: "Settings", icon: IconSettings },
];

export default function Nav({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [active, setActive] = useState("Tor");

  const links = data.map((item) => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));
  return (
    <Box p="sm" bg="rgb(26, 26, 26)">
      <Group p="lg" justify="space-between">
        <Group>
          <Box>
            <Image src="/eltor-text.png" alt="Logo" width={125} height={32} style={{cursor:"pointer"}} onClick={()=>{
              location.href = "/"
            }} />
          </Box>
        </Group>
        <Center>
          <a
            className={classes.link}
            data-active={window.location.pathname === "/connect" || undefined}
            href={"/connect"}
            key={"Tor"}
            onClick={(event) => {
              event.preventDefault();
              setActive("Tor");
              window.location.href = "/connect";
            }}
          >
            <IconCircuitBattery className={classes.linkIcon} stroke={1.5} />
            <span>Connect to El Tor</span>
          </a>
          <a
            className={classes.link}
            data-active={window.location.pathname === "/host" || undefined}
            href={"/host"}
            key={"Host"}
            onClick={(event) => {
              event.preventDefault();
              setActive("Host");
              window.location.href = "/host";
            }}
          >
            <IconCoinBitcoin className={classes.linkIcon} stroke={1.5} />
            <span>Host a Relay (and get paid)</span>
          </a>
        </Center>
      </Group>

      {/* Sidebar */}
      {/*<Box style={{ display: "flex", height: "100vh" }}>
         <Box
          style={{
            width: 300,
            backgroundColor: "#1a1a1a",
            color: "#ffffff",
            boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
            flexDirection: "column",
          }}
        >
          <ScrollArea style={{ flexGrow: 1 }}>
            <Box>
              <nav className={classes.navbar}>
                <div className={classes.navbarMain}>
                  {links}
                  <Box mt="50" ml="10">
                    <Image
                      src="/eltor-logo.png"
                      alt="Logo"
                      width={130}
                      height={100}
                    />
                  </Box>
                </div>
              </nav>
            </Box>
          </ScrollArea>
          <Box>
            <div className={classes.footer}>
              <a
                href="#"
                className={classes.link}
                onClick={(event) => event.preventDefault()}
              >
                <IconSwitchHorizontal
                  className={classes.linkIcon}
                  stroke={1.5}
                />
                <span>Change account</span>
              </a>

              <a
                href="#"
                className={classes.link}
                onClick={(event) => event.preventDefault()}
              >
                <IconLogout className={classes.linkIcon} stroke={1.5} />
                <span>Logout</span>
              </a>
            </div>
          </Box>
        </Box> 

        
      </Box>*/}
      <ScrollArea
        style={{
          flexGrow: 1,
          backgroundColor: "#1a1a1a",
        }}
      >
        {children}
      </ScrollArea>
    </Box>
  );
}
