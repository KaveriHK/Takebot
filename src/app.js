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
  setTimeout(() => {
    takeBotIconMsg("bot-msg icon-delay", firstNameMsg, 500, true, "text");
    setTimeout(() => {
      userInputsAction("fName", firstNamePlaceholder);
    }, 2000);
  }, 1000);
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
      getUserInfo(value);
      getToken();
      break;
    case "salesorceMsg":
      addHumanMsg(value);
      sendChatMessage(value);
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
      if (msg.reason === "Unavailable") {
        agentAvailable = false;
        agentOffline();
      }
      break;
    case "ChatRequestSuccess":
      agentOnline();
      break;
    case "ChatEstablished":
      agentInfo.name = msg.name;
      takeBotMsg(
        "bot-msg hcp",
        msg.name + " our call centre agent, has joined the conversation.",
        0,
        false
      );
      document.getElementById("user-input").placeholder =
        "Please type your responses here";
      break;
    case "ChatMessage":
      addAgentMsg(msg.text);
      break;
    case "ChatEnded":
      iconMsgWithNodelay(
        "Thank you for connecting with Takeda Chatbot!, Have a good day"
      );
      break;
  }
};

const agentOnline = () => {
  inputType = "salesorceMsg";
  iconMsgWithNodelay("We are connecting you to our call centre agent.");
};

const agentOffline = () => {
  takeBotIcon();
  setTimeout(() => {
    takeBotMsg(
      "bot-msg",
      "Our Live agents are currently unavailable. Live agents are only available from 8AM - 6PM EST.",
      0,
      false
    );
    setTimeout(() => {
      botui.message.bot({
        cssClass: "bot-msg hcp",
        type: "html",
        content:
          "<div>Please come back later or explore <a class='med-info-link' href='https://www.oncologymedinfo.com/MedicalInformation' target='_blank'>www.oncologymedinfo.com</a></div>",
      });
    }, 1000);
    // takeBotMsg(
    //   "bot-msg hcp",
    //   "Select any of the topic below to continue",
    //   0,
    //   false
    // );
    // addButton(topics, 0, "btn-list", "keyword");
  }, 1000);
};

revokeUserInputAction();
startChat();

const closeTakebot = () => {
  alert("Close!");
};
