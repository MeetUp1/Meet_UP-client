import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

const ScheduleCard = ({ name, time, agenda, address }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <TouchableOpacity onPress={toggleExpanded} style={styles.card}>
      <Text style={styles.cardTitle}>{name}</Text>
      <Text style={styles.cardTime}>{time}</Text>
      {expanded && (
        <View style={styles.cardDetails}>
          <Text style={styles.cardAgenda}>미팅안건: {agenda}</Text>
          <Text style={styles.cardAddress}>미팅주소: {address}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    marginTop: 10,
    padding: 15,
    marginBottom: 10,
    width: "100%",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardTime: {
    fontSize: 16,
    marginTop: 5,
  },
  cardDetails: {
    marginTop: 10,
  },
  cardAgenda: {
    fontSize: 14,
    marginBottom: 5,
  },
  cardAddress: {
    fontSize: 14,
  },
});

export default ScheduleCard;
