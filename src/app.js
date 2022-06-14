const startChat = () => {
  takeBotIconMsg("bot-msg icon-delay", welcomeMsg, 500, true, "text");
  verifyHCP();
};

const verifyHCP = () => {
  setTimeout(() => {
    takeBotMsg("bot-msg hcp", verificationTemplate, 500, true, "html");
  }, 2000);
};

const removeCursor = () => {
  var btn = document.getElementById("hcp");
  var btn1 = document.getElementById("hcp1");
  var div = document.getElementById("btn-div");
  btn.disabled = true;
  btn1.disabled = true;
  div.disabled = true;
  btn.classList.add("newClass");
  btn1.classList.add("newClass");
  div.classList.add("newClass");
};

const nonHealthcare = () => {
  removeCursor();
  addHumanMsg("No");
  setTimeout(() => {
    takeBotIconMsg(
      "bot-msg icon-delay",
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
      takeBotIconMsg("bot-msg icon-delay", lastNameMsg, 500, true, "text");
      setTimeout(() => {
        userInputsAction("lName", lastNamePlaceholder);
      }, 2000);
      break;
    case "lName":
      getUserInfo(value);
      takeBotIconMsg("bot-msg icon-delay", emailMsg, 500, true, "text");
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
          takeBotIconMsg("bot-msg icon-delay", apologyMsg, 500, true, "text");
          getToken(false);
        } else {
          takeBotIconMsg(
            "bot-msg icon-delay",
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
      takeBotMsg("bot-msg hcp", agentName + agentJoinedMsg, 500, true, "text");
      setTimeout(() => {
        userInputsAction("salesorceMsg", userResponsesPlaceholder);
      }, 1000);
      break;
    case "ChatMessage":
      addAgentMsg(msg.text);
      break;
    case "ChatEnded":
      revokeUserInputAction();
      takeBotIconMsg("bot-msg icon-delay", thankYouMsg, 500, true, "text");
      break;
  }
};

const agentOnline = () => {
  if (previousChatRequest === 0) {
    takeBotIconMsg("bot-msg icon-delay", connectingMsg, 500, true, "text");
  }
  previousChatRequest = previousChatRequest + 1;
};

const agentOffline = () => {
  takeBotIconMsg("bot-msg icon-delay", nonWorkingHoursMsg, 500, true, "text");
  setTimeout(() => {
    takeBotMsg("bot-msg hcp", nonWorkingHoursTemplate, 500, true, "html");
  }, 2000);
};

revokeUserInputAction();
startChat();

const closeTakebot = () => {
  alert("Close!");
};
