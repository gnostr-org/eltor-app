import React from "react";
import { Text, Container, Center } from "@mantine/core";
import styles from "./ConnectedCircle.module.css";

interface ConnectedCircleProps {
  sats: number;
}

const ConnectedCircle: React.FC<ConnectedCircleProps> = (props) => {
  return (
    <Container h="200" mt="md">
      <div className={styles.circle}>
        <Text fz="xl">Connected</Text>
        <Center>
        <Text fz="sm" ml="sm">{props?.sats ?? 0} sats</Text>
      </Center>
      </div>
     
    </Container>
  );
};

export default ConnectedCircle;
