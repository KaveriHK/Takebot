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
    isWorkingHours = agentAvailableJSON.IsAgentWorking;
    //isWorkingHours = true;
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
      isBotOpen = true;
      if (isChatRestarted) {
        checkSessionStoredValue();
      } else {
        startUserInputMethod(firstNameMsg, firstNamePlaceholder, "fName", 1000);
      }
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

const checkSessionStoredValue = () => {
  if (
    sessionInfo.email &&
    (sessionInfo.email !== "" ||
      sessionInfo.email !== null ||
      sessionInfo.email !== undefined)
  ) {
    userInfo.fName = sessionInfo.fName;
    userInfo.lName = sessionInfo.lName;
    userInfo.email = sessionInfo.email;
    getTokenChatAPI(false);
  } else if (
    sessionInfo.lName &&
    (sessionInfo.lName !== "" ||
      sessionInfo.lName !== null ||
      sessionInfo.lName !== undefined)
  ) {
    userInfo.fName = sessionInfo.fName;
    userInfo.lName = sessionInfo.lName;
    startUserInputMethod(emailMsg, emailMsgPlaceholder, "email", 1000);
  } else if (
    sessionInfo.fName &&
    (sessionInfo.fName !== "" ||
      sessionInfo.fName !== null ||
      sessionInfo.fName !== undefined)
  ) {
    userInfo.fName = sessionInfo.fName;
    startUserInputMethod(lastNameMsg, lastNamePlaceholder, "lName", 1000);
  } else if (sessionInfo.hcp) {
    startUserInputMethod(firstNameMsg, firstNamePlaceholder, "fName", 1000);
  }
};

const startUserInputMethod = (msg, placeholder, inType, timeoutDelay) => {
  setTimeout(() => {
    takeBotIconMsg(
      "takeda-mi-chatbot-bot-msg takeda-mi-chatbot-icon-delay",
      msg,
      500,
      true,
      "text"
    );
    setTimeout(() => {
      userInputsAction(inType, placeholder);
    }, 2000);
  }, timeoutDelay);
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
    //consoleLog("createChatInitRequest:" + chatReq1);
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
  messagePollData = "";
  const headers = setHeaders();
  headers.append("affinity", chatSessionInfo.affinityToken);
  headers.append("sessionkey", chatSessionInfo.key);

  const messagePollAPI = new URL(baseURL + "ChatSystemMessage");
  if (controller) {
    controller.abort();
  }
  controller = null;
  signal = null;
  controller = new AbortController();
  signal = controller.signal;
  if (pollingTimer > 0) {
    clearInterval(pollingTimer);
    pollingTimer = null;
  }
  currentSeconds = 0;
  pollingTimer = setInterval(function () {
    currentSeconds++;
    if (currentSeconds > 15 && messagePollData == "") {
      if (controller) {
        controller.abort();
      }
      clearInterval(pollingTimer);
      pollingTimer = null;
      currentSeconds = 0;
      if (agentAvailable) {
        messagePoll();
      }
    }
  }, 1000);
  /** part of 504 prod issue */
  // try {
  //   const saleforcemessages = await fetch(messagePollAPI, {
  //     method: "GET",
  //     headers: headers,
  //   });
  //   systemMessages = await saleforcemessages.json();
  //   //consoleLog("messagePull:" + systemMessages);
  //   readMessages(systemMessages);
  //   if (agentAvailable) {
  //     messagePoll();
  //   }
  // } catch (error) {
  //   console.log(error);
  // }
  fetch(messagePollAPI, { method: "GET", headers: headers, signal })
    .then(async (response) => {
      const isJson = response.headers
        .get("content-type")
        ?.includes("application/json");
      messagePollData = isJson ? await response.json() : null;
      readMessages(messagePollData);
      messagePollData = "";
      controller = null;
      signal = null;
      setTimeout(() => {
        if (agentAvailable) {
          messagePoll();
        }
      }, 2000);
      if (!response.ok) {
        const error =
          (messagePollData && messagePollData.message) || response.status;
        if (response.status == 504) {
          if (agentAvailable) {
            messagePoll();
          }
        } else {
          takeBotIconMsg(
            "takeda-mi-chatbot-bot-msg takeda-mi-chatbot-icon-delay",
            serverError,
            500,
            true,
            "text"
          );
          errorTrackOnDatalayer();
        }
        return Promise.reject(error);
      }
    })
    .catch((apierror) => {
      console.log("There was an error!", apierror.message);
      if (!apierror.message.includes("The user aborted a request.")) {
        takeBotIconMsg(
          "takeda-mi-chatbot-bot-msg takeda-mi-chatbot-icon-delay",
          serverError,
          500,
          true,
          "text"
        );
        errorTrackOnDatalayer();
      }
    });
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
    //consoleLog("sendChatMessage:" + chatReq1);
  } catch (error) {
    console.error(error);
  }
};

const takedaChatEnd = async () => {
  const headers = new Headers();
  headers.append("Authorization", "Bearer " + medInfoToken);
  headers.append("Content-Type", "text/plain");
  headers.append("version", "54");
  headers.append("affinity", chatSessionInfo.affinityToken);
  headers.append("sessionkey", chatSessionInfo.key);
  const chatEndURL = new URL(baseURL + "ChatEnd");
  const payload = { reason: "client" };
  try {
    const chatReq = await fetch(chatEndURL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    });
    chatReq1 = await chatReq.json();
  } catch (error) {
    console.error("Error(sendChatMessage): " + error);
  }
};
