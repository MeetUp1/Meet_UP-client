import axios from "axios";

async function sendNotification(
  expoPushToken: string,
  title: string,
  message: string,
) {
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
    console.error(error);
  }
}

export default sendNotification;
