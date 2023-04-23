import * as Clipboard from "expo-clipboard";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";

const ScheduleCard = ({ name, time, agenda, address, picture, onCopy }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(address);
    if (onCopy) {
      onCopy();
    }
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
            <TouchableOpacity
              onLongPress={copyToClipboard}
              delayLongPress={1000}
              style={styles.subtitleContentTouchable}
            >
              <Text style={styles.subtitleContent}>{address}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const { width: screenWidth } = Dimensions.get("window");

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#9E7676",
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 10,
    padding: 15,
    width: "80%",
    borderWidth: 2,
  },
  cardTitle: {
    marginRight: 5,
    fontSize: screenWidth * 0.05,
    color: "#FFF8EA",
    fontFamily: "Jua",
  },
  cardTime: {
    fontSize: screenWidth * 0.05,
    color: "#FFF8EA",
    fontFamily: "Jua",
  },
  cardDetails: {
    marginTop: 10,
  },
  subtitleTitle: {
    fontSize: screenWidth * 0.045,
    marginBottom: 5,
    color: "#FFF8EA",
    fontFamily: "Jua",
  },
  subtitleContainer: {
    backgroundColor: "#9E7676",
    borderColor: "#594545",
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 10,
    padding: 10,
    width: "100%",
    borderWidth: 2,
  },
  subtitleContent: {
    fontSize: screenWidth * 0.04,
    color: "#FFF8EA",
    fontFamily: "Jua",
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
