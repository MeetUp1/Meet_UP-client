import axios from "axios";

async function sendNotification(expoPushToken, title, message) {
  const data = {
    to: expoPushToken,
    sound: "default",
    title,
    body: message,
    data: { someData: "goes here" },
  };

  try {
    await axios.post("https://exp.host/--/api/v2/push/send", data);
  } catch (error) {
    console.log(error);
  }
}

export default sendNotification;
