const setFormData = (list) => {
  let formData = [];
  for (var property in list) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(list[property]);
    formData.push(encodedKey + "=" + encodedValue);
  }
  formData = formData.join("&");
  return formData;
};

const getToken = async () => {
  const headers = new Headers();
  const formBody = setFormData(credentials);
  headers.append("Content-Type", "application/x-www-form-urlencoded");
  try {
    const tokenJSON = await fetch(TOKEN_API, {
      method: "POST",
      headers: headers,
      body: formBody,
    });
    const res = await tokenJSON.json();
    if (res && res.access_token) {
      medInfoToken = res.access_token;
      createChatSession();
    } else {
      takeBotIconMsg("bot-msg icon-delay", errorMsg, 500, true, "text");
      return;
    }
  } catch (error) {
    takeBotIconMsg("bot-msg icon-delay", errorMsg, 500, true, "text");
    return;
  }
};

const setHeaders = () => {
  const headers = new Headers();
  headers.append("Authorization", "Bearer " + medInfoToken);
  headers.append("Content-Type", "application/json; charset=utf-8");
  headers.append("version", "54");
  return headers;
};

const createChatSession = async () => {
  const createSessionURL = new URL(baseURL + "CreateChatSession");
  const header = setHeaders();
  header.append("affinity", null);
  try {
    const saleforceSession = await fetch(createSessionURL, {
      method: "GET",
      headers: header,
    });
    const chatSessionJSON = await saleforceSession.json();
    chatSessionInfo = JSON.parse(chatSessionJSON);
    createChatInitRequest();
    messagePoll();
  } catch (error) {
    takeBotIconMsg("bot-msg icon-delay", errorMsg, 500, true, "text");
    return;
  }
};

const createChatInitRequest = async () => {
  const headers = setHeaders();
  headers.append("affinity", chatSessionInfo.affinityToken);
  headers.append("sessionkey", chatSessionInfo.key);

  const createSessionURL = new URL(baseURL + "ChatInitRequest");

  try {
    const chatReq = await fetch(createSessionURL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    });
    chatReq1 = await chatReq.json();
  } catch (error) {
    takeBotIconMsg("bot-msg icon-delay", errorMsg, 500, true, "text");
    return;
  }
};

const messagePoll = async () => {
  const headers = setHeaders();
  headers.append("affinity", chatSessionInfo.affinityToken);
  headers.append("sessionkey", chatSessionInfo.key);

  const messagePollAPI = new URL(baseURL + "ChatSystemMessage");
  try {
    const saleforcemessages = await fetch(messagePollAPI, {
      method: "GET",
      headers: headers,
    });
    systemMessages = await saleforcemessages.json();
    readMessages(systemMessages);
    if (agentAvailable) {
      messagePoll();
    }
  } catch (error) {
    console.log(error);
  }
};

const sendChatMessage = async (userRes) => {
  const headers = new Headers();
  headers.append("Authorization", "Bearer " + medInfoToken);
  headers.append("Content-Type", "text/plain");
  headers.append("version", "54");
  headers.append("affinity", chatSessionInfo.affinityToken);
  headers.append("sessionkey", chatSessionInfo.key);
  const chatMessageSendURL = new URL(baseURL + "ChatSendMessage");
  const payload = { text: userRes };
  try {
    const chatReq = await fetch(chatMessageSendURL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    });
    chatReq1 = await chatReq.json();
  } catch (error) {
    console.error(error);
  }
};
