const errorTrackOnDatalayer = () => {
  dataLayer.push({
    event: "chat_backend_error",
    action: "bot_response",
    label: "Something went wrong!, please come back after some time...",
    category: "chatbot",
  });
};

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

const getTokenChatAPI = async (checkWorkingHours = false) => {
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
      if (checkWorkingHours) {
        getAgentAvaialbality();
      } else {
        createChatSession();
      }
    } else {
      takeBotIconMsg(
        "takeda-mi-chatbot-bot-msg takeda-mi-chatbot-icon-delay",
        errorMsg,
        500,
        true,
        "text"
      );
      errorTrackOnDatalayer();
      return;
    }
  } catch (error) {
    takeBotIconMsg(
      "takeda-mi-chatbot-bot-msg takeda-mi-chatbot-icon-delay",
      errorMsg,
      500,
      true,
      "text"
    );
    errorTrackOnDatalayer();
    return;
  }
};

const getAgentAvaialbality = async () => {
  const agentAvailabilityURL = new URL(baseURL + "CheckAgentAvailability");
  const headers = new Headers();
  headers.append("Authorization", "Bearer " + medInfoToken);
  try {
    const agentAvailableReq = await fetch(agentAvailabilityURL, {
      method: "GET",
      headers: headers,
    });
    const agentAvailableJSON = await agentAvailableReq.json();
    //isWorkingHours = agentAvailableJSON.IsAgentWorking;
    isWorkingHours = true;
    //...for debugging in non-working hours...
    if (
      typeof fnGetURLQueryString !== "undefined" &&
      typeof fnGetURLQueryString === "function"
    ) {
      if (Boolean(Number(fnGetURLQueryString("debug")))) isWorkingHours = true;
    }
    //...
    agentAvailable = isWorkingHours;
    if (isWorkingHours) {
      setTimeout(() => {
        takeBotIconMsg(
          "takeda-mi-chatbot-bot-msg takeda-mi-chatbot-icon-delay",
          firstNameMsg,
          500,
          true,
          "text"
        );
        setTimeout(() => {
          userInputsAction("fName", firstNamePlaceholder);
        }, 2000);
      }, 1000);
    } else {
      agentOffline();
    }
  } catch (error) {
    consoleLog("Error: " + error);
    takeBotIconMsg(
      "takeda-mi-chatbot-bot-msg takeda-mi-chatbot-icon-delay",
      errorMsg,
      500,
      true,
      "text"
    );
    errorTrackOnDatalayer();
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
    consoleLog(chatSessionJSON);
    chatSessionInfo = JSON.parse(chatSessionJSON);
    createChatInitRequest();
    messagePoll();
  } catch (error) {
    takeBotIconMsg(
      "takeda-mi-chatbot-bot-msg takeda-mi-chatbot-icon-delay",
      errorMsg,
      500,
      true,
      "text"
    );
    errorTrackOnDatalayer();
    return;
  }
};

const createChatInitRequest = async () => {
  const headers = setHeaders();
  headers.append("affinity", chatSessionInfo.affinityToken);
  headers.append("sessionkey", chatSessionInfo.key);

  const createSessionURL = new URL(baseURL + "ChatInitRequest");
  payload.visitorName = userInfo["fName"] + " " + userInfo["lName"];
  (payload.sessionId = chatSessionInfo.id),
    payload.prechatDetails.forEach((detail) => {
      if (detail.label === "FirstName") {
        detail.value = userInfo["fName"];
      }
      if (detail.label === "LastName") {
        detail.value = userInfo["lName"];
      }
      if (detail.label === "Email") {
        detail.value = userInfo["email"];
      }
    });
  try {
    const chatReq = await fetch(createSessionURL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    });
    chatReq1 = await chatReq.json();
    consoleLog("createChatInitRequest:" + chatReq1);
  } catch (error) {
    takeBotIconMsg(
      "takeda-mi-chatbot-bot-msg takeda-mi-chatbot-icon-delay",
      errorMsg,
      500,
      true,
      "text"
    );
    errorTrackOnDatalayer();
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
    consoleLog("messagePull:" + systemMessages);
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
    consoleLog("sendChatMessage:" + chatReq1);
  } catch (error) {
    console.error(error);
  }
};
