const areYouSure = () => {
  if (isBotOpen) {
    return "Are you sure you want to exit?";
  }
};
// window.onbeforeunload = areYouSure;

const startChat = () => {
  takeBotIconMsg(
    "takeda-mi-chatbot-bot-msg takeda-mi-chatbot-icon-delay",
    welcomeMsg,
    500,
    true,
    "text"
  );
  verifyHCP();
  dataLayer.push({
    event: "start_chat",
    action: "click",
    label: "start chat",
    category: "chatbot",
  });
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
  if (document.getElementById("takeda-mi-chatbot-hcp") != null) {
    var btn = document.getElementById("takeda-mi-chatbot-hcp");
    var btn1 = document.getElementById("takeda-mi-chatbot-hcp1");
    var div = document.getElementById("takeda-mi-chatbot-btn-div");
    btn.disabled = true;
    btn1.disabled = true;
    div.disabled = true;
    btn.classList.add("takeda-mi-chatbot-cursor");
    btn1.classList.add("takeda-mi-chatbot-cursor");
    div.classList.add("takeda-mi-chatbot-cursor");
  }
};

const nonHealthcare = () => {
  isNonHealthcareUser = true;
  removeCursor();
  addHumanMsg("No");
  setTimeout(() => {
    takeBotIconMsg(
      "takeda-mi-chatbot-bot-msg takeda-mi-chatbot-icon-delay takeda-mi-chatbot-non-hcp-template",
      nonHealthcareTemplate,
      500,
      true,
      "html"
    );
    scrollToElementView("takeda-mi-chatbot-non-hcp-template");
  }, 1000);
  dataLayer.push({
    event: "chat_hcp_selfverify",
    action: "click",
    label: "No",
    category: "chatbot",
  });
};

const healthcare = () => {
  isBotOpen = true;
  isNonHealthcareUser = false;
  removeCursor();
  addHumanMsg("Yes");
  getTokenChatAPI(true);
  dataLayer.push({
    event: "chat_hcp_selfverify",
    action: "click",
    label: "Yes",
    category: "chatbot",
  });
};

const linkClick = (e) => {
  dataLayer.push({
    event: "chat_external_clicks",
    action: "click",
    label: e.getAttribute("href"),
    category: "chatbot",
  });
};

const userInput = (value) => {
  switch (inputType) {
    case "fName":
      if (testInput(value)) {
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
      }
      break;
    case "lName":
      if (testInput(value)) {
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
      }
      break;
    case "email":
      if (emailValidation(value)) {
        getUserInfo(value);
        getTokenChatAPI(false);
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
          getTokenChatAPI(false);
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
        0,
        false,
        "text"
      );
      setTimeout(() => {
        userInputsAction("salesorceMsg", userResponsesPlaceholder);
      }, 500);
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
      "takeda-mi-chatbot-bot-msg takeda-mi-chatbot-hcp takeda-mi-chatbot-non-working-hours",
      nonWorkingHoursTemplate,
      500,
      true,
      "html"
    );
    scrollToElementView("takeda-mi-chatbot-non-working-hours");
  }, 2000);
};

const closeTakebot = () => {
  const closeBot = () => {
    isBotOpen = false;
    clear(); //botui.message.removeAll();
    document.getElementById("takeda-mi-chatbot-container").style.display =
      "none";
    document.getElementById(
      "takeda-mi-chatbot-chat-outside-icon"
    ).style.display = "block";
    dataLayer.push({
      event: "end_chat",
      action: "click",
      label: "end chat",
      category: "chatbot",
    });
    //pavan: no chat icon will be displayed, instead, using click here link to open the chat window
    if (
      window.location.href
        .toLowerCase()
        .indexOf("contacttakedamedicalaffairs") > 0
    )
      document.getElementById(
        "takeda-mi-chatbot-chat-outside-icon"
      ).style.display = "none";
  };

  if (isBotOpen) {
    if (confirm("Do you want to end the conversation with Takeda Live Chat?"))
      closeBot();
  } else {
    closeBot();
  }
};

const openTakeBot = () => {
  clear();
  document.getElementById("takeda-mi-chatbot-container").style.display =
    "block";
  document.getElementById("takeda-mi-chatbot-chat-outside-icon").style.display =
    "none";
  revokeUserInputAction();
  startChat();
};
