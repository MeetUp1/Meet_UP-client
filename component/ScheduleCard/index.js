import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";

const ScheduleCard = ({ name, time, agenda, address, picture }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <TouchableOpacity onPress={toggleExpanded} style={styles.card}>
      <View style={styles.scheduleCardRow}>
        <View style={styles.profileImgContainer}>
          <Image source={{ uri: picture }} style={styles.profileImg} />
        </View>
        <Text style={styles.cardTitle}>{name}</Text>
        <Text style={styles.cardTime}>{time}</Text>
      </View>
      {expanded && (
        <View style={styles.cardDetails}>
          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitleTitle}>미팅안건</Text>
            <Text style={styles.subtitleContent}>{agenda}</Text>
          </View>
          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitleTitle}>미팅주소</Text>
            <Text style={styles.subtitleContent}>{address}</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f8f8f8",
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 10,
    padding: 15,
    width: "80%",
    borderWidth: 2,
  },
  cardTitle: {
    marginRight: 5,
    fontSize: 20,
    fontWeight: "bold",
  },
  cardTime: {
    fontSize: 18,
  },
  cardDetails: {
    marginTop: 10,
  },
  subtitleTitle: {
    fontSize: 17,
    marginBottom: 5,
    fontWeight: "bold",
  },
  subtitleContainer: {
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 10,
    padding: 10,
    width: "100%",
    borderWidth: 2,
  },
  subtitleContent: {
    fontSize: 15,
  },
  profileImgContainer: {
    width: 50,
    height: 50,
    marginRight: 5,
    borderRadius: 50,
    overflow: "hidden",
  },
  profileImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  scheduleCardRow: {
    alignItems: "center",
    flexDirection: "row",
  },
});

export default ScheduleCard;
