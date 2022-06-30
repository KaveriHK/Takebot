const startChat = () => {
  takeBotIconMsg(
    "takeda-mi-chatbot-bot-msg takeda-mi-chatbot-icon-delay",
    welcomeMsg,
    500,
    true,
    "text"
  );
  verifyHCP();
};

const verifyHCP = () => {
  setTimeout(() => {
    takeBotMsg(
      "takeda-mi-chatbot-bot-msg takeda-mi-chatbot-hcp",
      verificationTemplate,
      500,
      true,
      "html"
    );
  }, 2000);
};

const removeCursor = () => {
  var btn = document.getElementById("takeda-mi-chatbot-hcp");
  var btn1 = document.getElementById("takeda-mi-chatbot-hcp1");
  var div = document.getElementById("takeda-mi-chatbot-btn-div");
  btn.disabled = true;
  btn1.disabled = true;
  div.disabled = true;
  btn.classList.add("takeda-mi-chatbot-cursor");
  btn1.classList.add("takeda-mi-chatbot-cursor");
  div.classList.add("takeda-mi-chatbot-cursor");
};

const nonHealthcare = () => {
  removeCursor();
  addHumanMsg("No");
  setTimeout(() => {
    takeBotIconMsg(
      "takeda-mi-chatbot-bot-msg takeda-mi-chatbot-icon-delay",
      nonHealthcareTemplate,
      500,
      true,
      "html"
    );
  }, 1000);
};

const healthcare = () => {
  removeCursor();
  addHumanMsg("Yes");
  getToken(true);
};

const userInput = (value) => {
  switch (inputType) {
    case "fName":
      getUserInfo(value);
      takeBotIconMsg(
        "takeda-mi-chatbot-bot-msg takeda-mi-chatbot-icon-delay",
        lastNameMsg,
        500,
        true,
        "text"
      );
      setTimeout(() => {
        userInputsAction("lName", lastNamePlaceholder);
      }, 2000);
      break;
    case "lName":
      getUserInfo(value);
      takeBotIconMsg(
        "takeda-mi-chatbot-bot-msg takeda-mi-chatbot-icon-delay",
        emailMsg,
        500,
        true,
        "text"
      );
      setTimeout(() => {
        userInputsAction("email", emailMsgPlaceholder);
      }, 2000);
      break;
    case "email":
      if (emailValidation(value)) {
        getUserInfo(value);
        getToken(false);
      }
      break;
    case "salesorceMsg":
      liveChat(value);
      break;
  }
};

const readMessages = (messages) => {
  if (messages) {
    const saleforceMsgs = JSON.parse(messages);
    if (saleforceMsgs["messages"].length > 0) {
      const msgs = saleforceMsgs["messages"];
      msgs.forEach((element, index) => {
        agentMsgCase(element.type, element.message);
      });
    }
  }
};

const agentMsgCase = (type, msg) => {
  switch (type) {
    case "ChatRequestFail":
      if (msg.reason === "Unavailable" && previousChatRequest === 0) {
        agentAvailable = false;
        agentOffline();
      } else {
        if (previousChatRequest === 1) {
          takeBotIconMsg(
            "takeda-mi-chatbot-bot-msg takeda-mi-chatbot-icon-delay",
            apologyMsg,
            500,
            true,
            "text"
          );
          getToken(false);
        } else {
          takeBotIconMsg(
            "takeda-mi-chatbot-bot-msg takeda-mi-chatbot-icon-delay",
            agentsNotAvailableTemplate,
            500,
            true,
            "html"
          );
        }
      }
      break;
    case "ChatRequestSuccess":
      agentOnline();
      break;
    case "ChatEstablished":
      agentName = msg.name;
      takeBotMsg(
        "takeda-mi-chatbot-bot-msg takeda-mi-chatbot-hcp",
        agentName + agentJoinedMsg,
        500,
        true,
        "text"
      );
      setTimeout(() => {
        userInputsAction("salesorceMsg", userResponsesPlaceholder);
      }, 1000);
      break;
    case "ChatMessage":
      addAgentMsg(msg.text);
      break;
    case "ChatEnded":
      revokeUserInputAction();
      takeBotIconMsg(
        "takeda-mi-chatbot-bot-msg takeda-mi-chatbot-icon-delay",
        thankYouMsg,
        500,
        true,
        "text"
      );
      break;
  }
};

const agentOnline = () => {
  if (previousChatRequest === 0) {
    takeBotIconMsg(
      "takeda-mi-chatbot-bot-msg takeda-mi-chatbot-icon-delay",
      connectingMsg,
      500,
      true,
      "text"
    );
  }
  previousChatRequest = previousChatRequest + 1;
};

const agentOffline = () => {
  takeBotIconMsg(
    "takeda-mi-chatbot-bot-msg takeda-mi-chatbot-icon-delay",
    nonWorkingHoursMsg,
    500,
    true,
    "text"
  );
  setTimeout(() => {
    takeBotMsg(
      "takeda-mi-chatbot-bot-msg takeda-mi-chatbot-hcp",
      nonWorkingHoursTemplate,
      500,
      true,
      "html"
    );
  }, 2000);
};

const closeTakebot = () => {
  botui.message.removeAll();
  document.getElementById("takeda-mi-chatbot-container").style.display = "none";
  document.getElementById("takeda-mi-chatbot-chat-outside-icon").style.display =
    "block";
};

const openTakeBot = () => {
  botui.message.removeAll();
  document.getElementById("takeda-mi-chatbot-container").style.display =
    "block";
  document.getElementById("takeda-mi-chatbot-chat-outside-icon").style.display =
    "none";
  revokeUserInputAction();
  startChat();
};
