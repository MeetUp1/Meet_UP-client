# 🤝 MeetUP

MeetUP 프로젝트는 전 세계의 다양한 지역에서 미팅을 개최하고 참가할 수 있는 Mobile application 입니다.

<br>

# 📖 Table of Contents

- [🤝 MeetUP](#🤝-meet-up)
- [💪 Motivation](#💪-motivation)
- [🔥 Challenges](#🔥-challenges)
  - [각유저의 지역정보가 다르다면 미팅시간은 어떻게 표시 해야할까?](#1-미팅요청-하는-유저와-수락하는-유저의-지역-정보가-다르다면-시간을-어떻게-표시-해야할까)
    - [어떻게 위치기반의 캘린더를 만들수 있을까?](#1-어떻게-위치기반의-캘린더를-만들수-있을까)
    - [사용자의 지역에 따른 로컬시간이 다르다면 서로의 시간은 어떻게 표시해야 하지?](#2-사용자의-지역에-따른-로컬시간이-다르다면-서로의-시간은-어떻게-표시해야-하지)
  - [미팅 이벤트가 발생시 해당유저에게 발생한 이벤트를 어떻게 알려줄 수 있을까?](#2-미팅-이벤트가-발생시-해당유저에게-발생한-이벤트를-어떻게-알려줄-수-있을까)
    - [어떤 Push 알림 서비스 선택 해야할까?](#1-어떤-push-알림-서비스-선택-해야할까)
    - [Push 알림 토큰 관리는 어떻게 해주는 것이 좋을까?](#2-push-알림-토큰-관리는-어떻게-해주는-것이-좋을까)
    - [Push 알림 토큰으로 알림 생성 및 전송은 어떻게 할 수 있을까?](#3-push-알림-토큰으로-알림-생성-및-전송은-어떻게-할-수-있을까)
  - [React Native로 프로젝트를 진행하면서 마주친 Challenges!](#3-react-native로-프로젝트를-진행하면서-마주친-challenges)
    - [React와 다른 React Native UI 구성 요소](#1-react와-다른-react-native-ui-구성-요소)
    - [React와 다른 React Native 레이아웃의 차이](#2-react와-다른-react-native-레이아웃의-차이)
    - [React Native에서의 플랫폼 간의 차이](#3-react-native에서의-플랫폼-간의-차이)
    - [React Native에서는 페이지의 주소가 없는데 어떻게 페이지 이동을 해야하지?](#4-react-native에서는-페이지의-주소가-없는데-어떻게-페이지-이동을-해야하지)
- [🗓 Schedule](#🗓-schedule)
- [🔗 Repository Link](#🔗-repository-link)
- [🛠 Tech Stacks](#🛠-tech-stacks)
- [🏠 Members](#🏠-members)

  <br>

# 💪 Motivation

이번 프로젝트의 목표는 부트캠프 교육 기간동안 학습하였던 지식들을 react native를 사용하여 프로젝트를 진행해보자! 라는 목표를 가지고 주제를 탐색해 보았습니다.

이러한 목표에 적합한 아이디어를 탐색하다가 미팅을 요청하거나 수락할때 불필요한 커뮤니케이션이 발생하는 것을 줄일 수 있는 프로젝트를 진행해보자 라는 아이디어가 떠올랐고 이 주제에 관한 자료 조사와 계획을 수립하였습니다.

계획한 프로젝트에서는 react native를 처음 사용해 보는것이므로 react native에대한 사전 조사가 필요하였고, react native로 미팅을 요청하고 수락하는 사용자들의 지역이 다르더라도 서로의 시간정보가 유저의 지역시간에 맞도록 미팅을 수락, 요청 할 수 있도록 구현한다면 프론트엔드와 백엔드 에서의 챌린지 요소를 해결해가면서 프로젝트가 완성했을때 프로젝트의 목표가 달성될 수 있을것이라고 판단하여 이프로젝트를 진행하였습니다.

# 🔥 challenges

프로젝트를 진행하며 여러 Challenges가 있었지만 주요 Challenges는 다음과 같은 요소가 있었습니다.

<br>

## 1. 미팅요청 하는 유저와 수락하는 유저의 지역 정보가 다르다면 시간을 어떻게 표시 해야할까?

미팅요청 하는 유저와 수락하는 유저의 지역 정보가 다르다면 시간을 동적으로 표시하는데 아래의 어려움이 있었습니다.

<br>

### 1) 어떻게 위치기반의 캘린더를 만들수 있을까?

이 프로젝트에서는 위치 기반의 동적인 캘린더를 만들기 위해 내장 Date 객체와 Google Calendar API 두 가지 선택지를 고려하였습니다. 내장 Date 객체는 간단한 날짜 및 시간 처리 기능을 제공하며, 인터넷 연결이 필요하지 않고 외부 의존성이 없다는 장점이 있습니다. 반면 Google Calendar API는 다양한 기능, 동기화, 사용자 인증 및 권한 관리를 제공하며, 지속적인 업데이트와 플랫폼 간 호환성이 가능하다는 장점이 있습니다.

이 프로젝트에서 위치 기반의 캘린더를 만들기 위해 내장 Date 객체를 활용하였습니다. 내장 Date 객체를 사용한 이유는 다음과 같습니다.

Google Calendar API를 사용하면 외부 서비스에 의존하게 되어, 구글 서비스의 변경사항이나 장애에 영향을 받을 수 있습니다. 그러므로 외부 서비스의 영향 최소화를 위해 내장 Date 객체를 사용하면 외부 서비스의 변경사항이나 장애에 영향을 받지 않고 프로젝트를 유지할 수 있습니다.

또한 Google Calendar API 캘린더 기능이 필요하면 직접 구현 하는 방향으로 잡고 캘린더 부분에서는 내장 Date 객체를 사용하여 로컬 시간을 사용하였습니다.

<br>

### 2) 사용자의 지역에 따른 로컬시간이 다르다면 서로의 시간은 어떻게 표시해야 하지?

서로 다른 지역의 사용자들이 일정 시간을 표시 및 확인 할 때, 각 사용자의 로컬 시간에 맞추어 일정 시간을 표시해야 합니다. 이를 위해 다음과 같은 방법을 사용하였습니다.

**시간대 변환: 사용자가 미팅을 생성하거나 신청할 때, 해당 일정의 시간 정보를 UTC (협정 세계시)로 변환하여 저장합니다. 이렇게 함으로써 일정 시간을 표준화하고, 사용자 간의 시간 차이를 고려할 수 있습니다.**

```javascript
const convertToUTCDate = (localDate, hour) => {
  const date = new Date(localDate);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
};
```

위코드는 현재 프로젝트에서 사용한 로컬 시간을 UTC형태의 시간으로 바꾸어 주는 함수 입니다. 함수에 대한 자세한 설명은 다음과 같습니다.

이 함수는 주어진 로컬 날짜`localDate`와 시간`hour`을 기반으로 해당 시간의 UTC 날짜 문자열을 반환합니다.
<br>
`localDate` 인자를 기반으로 새로운 `Date` 객체를 생성합니다. 이 객체는 로컬 시간대의 날짜 및 시간 정보를 가지고 있습니다.
<br>
`date` 객체의 시간을 주어진 `hour`로 설정하고, 분, 초, 밀리초를 0으로 초기화합니다. 이렇게 하면, 원하는 시간을 가진 새로운 날짜 및 시간 객체가 생성됩니다.
<br>
`date` 객체의 UTC 날짜 및 시간을 ISO 8601 형식의 문자열로 변환하여 반환합니다. 이 문자열은 "YYYY-MM-DDTHH:mm:ss.sssZ" 형식을 따르며, "Z"는 UTC 시간대를 나타냅니다.

<br>

**로컬 시간 표시: 일정을 표시할 때, 저장된 UTC 시간 정보를 사용자의 로컬 시간대로 변환하여 보여줍니다.**

```javascript
const getMeetingsByDate = (meetingList, month, year) => {
  const meetingsByDate = {};

  meetingList.forEach((meeting) => {
    const meetingDate = new Date(meeting.startTime);
    if (
      meetingDate.getMonth() === month &&
      meetingDate.getFullYear() === year
    ) {
      const dateKey = meetingDate.getDate();
      if (!meetingsByDate[dateKey]) {
        meetingsByDate[dateKey] = [];
      }
      meetingsByDate[dateKey].push(meeting);
    }
  });

  return meetingsByDate;
};
```

위코드는 현재 프로젝트에서 사용한 함수는 DB에서 `meetingList`에서 UTC형태로 저장되어 있는 미팅의 `startTime`을 내로컬 시간으로 변경하여 미팅일정을 날짜별로 분류하여 반환해주는 함수입니다.
<br>
함수에 대한 자세한 설명은 다음과 같습니다.

빈 객체 `meetingsByDate`를 생성합니다. 이 객체는 각 날짜별로 회의 목록을 저장하기 위한 목적으로 사용됩니다.
<br>
미팅 시작 시간`startTime`을 기반으로 내로컬 시간에 맞도록 새로운 `Date` 객체를 생성합니다.
<br>
생성된 `meetingDate` 객체의 월과 연도가 주어진 `month`와 `year`와 일치하는지 확인합니다. 일치하는 경우에만 다음 단계를 진행합니다.
<br>
`meetingDate` 객체의 일`day`를 가져와 `dateKey`로 저장합니다.
<br>
`meetingsByDate` 객체에 `dateKey`에 해당하는 키가 없다면, 빈 배열을 할당하여 초기화합니다.
<br>
`meetingsByDate` 객체의 `dateKey`에 해당하는 배열에 미팅 추가합니다.

이프로젝트에서는 이방법으로 유저의 지역정보에 따른 Time zone 달라도 나의 로컬시간에 맞게 표시되도록 모든 날짜를 UTC형태로 저장하고 나의 로컬시간에 맞도록 변환 시켜주었습니다.

<img width="700" src="https://user-images.githubusercontent.com/107290583/236911449-fa16a702-6691-4178-a02d-3f9b81f6f5d1.png">

<br>

## 2. 미팅 이벤트가 발생시 해당유저에게 발생한 이벤트를 어떻게 알려줄 수 있을까?

미팅 이벤트가 발생했을 때 해당 사용자에게 알림을 전달하려면 Push 알림, 이메일 알림, SMS 알림 등의 방법이 있었지만 react native로 Mobile application을 만드는 만큼 MeetUp application 에서 사용자의 기기에 Push 알림을 보내는 방법을 가장 적합하다고 판단했습니다. Push 알림은 사용자의 스마트폰에 직접 알림을 보내므로, 사용자가 애플리케이션을 실행하지 않아도 알림을 확인할 수 있습니다. 이러한 이유로, MeetUp 애플리케이션에서는 다음과 같은 과정을 통해 Push 알림 시스템을 구축했습니다.

<br>

### 1) 어떤 Push 알림 서비스 선택 해야할까?

이번 프로젝트에서 Push 알림 서비스를 구현 하기 위해서는 Expo Push Notification과 Firebase Cloud Messaging (FCM) 두가지의 선택지가 있었습니다 두개의 서비스 모두 안드로이드, iOS 지원하지만 현재 expo로 프로젝트를 진행하고 있으므로 expo에 특화된 Expo Push Notification을 사용하기로 하였습니다.

하지만 Expo Push Notification은 Expo 서버를 거쳐 알림을 보내야 하기 때문에, Expo 서버의 성능과 가용성에 영향을 받을 수 있다는 단점이 존재합니다. 하지만 현재 [expo 서버](https://status.expo.dev/)에서 확인해 보면 서버가 안정적으로 운영이 되고 있다는 것을 확인할 수 있습니다.

<br>

### 2) Push 알림 토큰 관리는 어떻게 해주는 것이 좋을까?

사용자의 기기에 알림을 보내려면 기기 토큰을 얻어야 합니다. 애플리케이션에서 사용자가 로그인할 때 기기 토큰을 생성하고, 서버에 전송하여 저장합니다.

```javascript
export async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}
```

이함수는 현재 프로젝트에서 expo push 알림 토큰을 얻기위해 사용된 함수 입니다. 함수는 설명은 다음과 같습니다.
<br>
`Device.isDevice`를 사용하여 현재 기기가 실제 기기인지 확인합니다. 시뮬레이터에서는 푸시 알림을 사용할 수 없습니다.
<br>
`Notifications.getPermissionsAsync()`를 사용하여 앱에 이미 푸시 알림 권한이 부여되어 있는지 확인합니다.
<br>
권한이 없다면, `Notifications.requestPermissionsAsync()`를 사용하여 사용자에게 푸시 알림 권한을 요청합니다.
<br>
사용자가 권한을 허용하면, `Notifications.getExpoPushTokenAsync()`를 사용하여 Expo 푸시 토큰을 가져옵니다.
<br>
안드로이드 플랫폼의 경우, `Notifications.setNotificationChannelAsync()`를 사용하여 푸시 알림 채널을 설정합니다. 이 설정은 중요도, 진동 패턴 및 알림 LED 색상을 포함합니다.
<br>
마지막으로, 생성된 토큰을 반환합니다. 이렇게 반환된 토큰을 서버에 저장해 주었습니다.

<br>

### 3) Push 알림 토큰으로 알림 생성 및 전송은 어떻게 할 수 있을까?

미팅 이벤트 발생 시 알림을 생성하고 전송하기 위해 expo서버를 사용하였습니다. 알림을 생성할 때 미팅에 참가하는 사용자들의 기기 토큰을 서버에서 가져와 알림을 전송합니다.

```javascript
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
```

입력으로 받은 `expoPushToken`, `title`, `message`를 사용하여 알림 데이터 객체를 생성합니다. 여기에는 받는 기기의 Expo 푸시 토큰, 알림의 제목, 알림의 본문, 사운드 및 추가 데이터가 포함됩니다.
<br>
`axios.post()`를 사용하여 Expo 푸시 알림 서비스에 POST 요청을 보냅니다. 이를 통해 Expo 푸시 알림 서비스가 해당 기기에 알림을 전송합니다.
<br>
요청이 성공하면 알림이 보내지고, 실패한 경우 오류를 콘솔에 출력합니다.

![화면_기록_2023-05-07_오후_12_36_22_AdobeExpress](https://user-images.githubusercontent.com/107290583/236910674-63982618-7d96-473f-be00-d86d50f77bdc.gif)

<br>

<img width="700" src="https://user-images.githubusercontent.com/107290583/236910526-720bd8f0-5e30-48aa-bb72-5e3dc0b035ad.png">

<br>

## 3. React Native로 프로젝트를 진행하면서 마주친 Challenges!

지금까지 React를 사용하여 웹을 개발을 진행해보다가 이번 프로젝트를 기회로 React Native로 Mobile application을 만드는 프로젝트를 진행을 해보았는데 이번 프로젝트에서 React Native로 디테일적인 부분을 생각하며 프로젝트를 진행을 하다보니 React Native에서의 여러 Challenges요소들이 있었습니다.

<br>

### 1) React와 다른 React Native UI 구성 요소

React Native는 React와 다른 UI 구성 요소 집합을 사용합니다. 예를 들어 `<div>` 대신 `<View>`를 사용하고 `<p>` 대신 `<Text>`를 사용합니다.
<br>
아래의 코드는 현재 프로젝트에서 사용한 미팅카드 UI 구성 하는 코드입니다.

```javascript
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
```

<br>

### 2) React와 다른 React Native 레이아웃의 차이

리액트 웹 애플리케이션에서는 CSS 플렉스 박스, 그리드 또는 다른 레이아웃 시스템을 사용하여 레이아웃을 사용하여 구성하였지만. 리액트 네이티브에서는 기본적으로 플렉스 박스 레이아웃을 사용하여 요소를 정렬하고 크기를 조절한다는 차이점이 있었습니다.

<br>

### 3) React Native에서의 플랫폼 간의 차이

React Native는 크로스 플랫폼 개발을 목표로 하지만, iOS와 Android 간에는 기본적인 차이가 있습니다. 따라서 코드에서 플랫폼별 차이를 조건문을 통해서 차이점을 처리해 주었습니다.
<br>
이번 프로젝트를 진행하면서 나타났던 차이점중 하나는 iOS와 Android의 `date` 객체가 다르게 화면에 출력된다는 것이였습니다. 이를 해결하기위해 아래 코드와 같이 조건문을 통해서 해결하였습니다.

```javascript
<Text style={styles.cardText}>
  {Platform.OS === "android"
    ? new Date(meeting.startTime).toLocaleString().slice(0, 16)
    : new Date(meeting.startTime).toLocaleString()[20] === "0"
    ? new Date(meeting.startTime).toLocaleString().slice(0, 21)
    : new Date(meeting.startTime).toLocaleString().slice(0, 20)}
</Text>
```

<br>

### 4) React Native에서는 페이지의 주소가 없는데 어떻게 페이지 이동을 해야하지?

React에서는 Router를 사용하여 페이지의 주소로 페이지를 이동했지만 React Native에서는 페이지 이동을 위해서는 Navigation을 사용하여 페이지 이동을 해야 합니다.
<br>
React Native에서의 Navigation을 사용할 수 있는 방법으로는 StackNavigator, TabNavigator, DrawerNavigator 있습니다. 이번 프로젝트에서 사용한 Navigation 방법으로는 StackNavigator을 사용하였습니다.
<br>
StackNavigator을 사용한 이유는 다음과 같습니다.

1. 직관적인 사용자 경험: StackNavigator는 화면을 쌓듯이 새로운 화면을 이전 화면 위에 올림으로써 사용자에게 직관적인 경험을 제공합니다. 사용자가 앱 내에서 원활하게 화면을 이동하고 이전 화면으로 돌아갈 수 있도록 도와줍니다.
   <br>
2. 기본 제공되는 애니메이션 및 전환 효과: StackNavigator는 기본적으로 제공되는 애니메이션 및 전환 효과를 가지고 있어, 별도의 커스터마이징 없이도 앱에서 깔끔한 전환 경험을 제공할 수 있습니다.
   <br>

하지만 StackNavigator을 사용하면서 발생한 문제점이 발생하였습니다. StackNavigator는 화면이 쌓이는 형식의 내비게이션 구조를 제공합니다. 즉, 앱 내에서 한 화면에서 다른 화면으로 이동할 때마다 새로운 화면이 이전 화면 위에 쌓이는 것처럼 표현됩니다.
<br>
StackNavigator는 화면이 mount, unmount되지 않아서 `useEffect`가 원하는 동작을 하지않는 경우가 발생을하였습니다. 이를 해결하기위해 react-navigation/native에서 제공해주는 `useFocusEffect`를 사용했습니다.
<br>
`useFocusEffect`의 역할은 화면이 포커스될 때마다 특정 동작을 실행하도록 합니다. 이를 통해 화면 전환 시에 필요한 데이터 업데이트, API 호출 등의 작업을 적절히 처리할 수 있습니다. 이러한 방법으로 문제를 해결 할 수 있었습니다.
<br>
아래의 코드는 프로젝트에서 `useFocusEffect`를 사용한 코드입니다.

```javascript
useFocusEffect(
  useCallback(() => {
    async function fetchData() {
      const response = await axios.get(
        `${LOGIN_API_URL}/api/users/${currentUser.id}/meetings`,
      );
      const meetings = response.data;
      setMeetingList(meetings);
    }
    fetchData();
  }, []),
);
```

<br>

# 🗓 Schedule

### 프로젝트 기간 : 2023.04.03 ~ 2023.04.23 / 기획 7일 개발 14일

- 1 주차 : 기획 및 설계
  - 아이디어 수집
  - 기술 스택 선정
  - Figma를 사용한 Mockup 제작
  - MongoDb를 이용한 DB Schema 설계
  - Notion을 이용한 칸반 작성
- 2주차, 3주차 : 기능 개발
  - 백엔드 서버 구현
  - 프로잭트 기능 구현
  - 테스트 코드
  - 리팩토링 및 버그 수정

<br>

# 🔗 Repository Link

- [Meet UP Client](https://github.com/MeetUp1/Meet_UP-client)
- [Meet UP Server](https://github.com/MeetUp1/Meet_UP-server)

<br>

# 🛠 Tech Stacks

### Frontend

- expo
- react-navigation
- react-redux
- ESLint

### Backend

- [Node.js](https://nodejs.org/ko/)
- [Express](https://expressjs.com/ko/)
- [MongoDB](https://www.mongodb.com/cloud/atlas/register)
- [Mongoose](https://mongoosejs.com/)
- ESLint

<br>

# 🏠 Members

- [이상혁](https://github.com/HyukE) : mign2ki2@gmail.com
