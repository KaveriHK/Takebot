/***** Common Reusable methods */

const takeBotIcon = () => {
  botui.message.bot({
    delay: 1000,
    loading: true,
    type: "html",
    cssClass: "img-msg",
    content: "<img src='./assets/Bot_.svg' alt='' height='38px' width='38px'/>",
  });
};

const takeBotMsg = (cssClass, message, delay, loading, type) => {
  setTimeout(() => {
    botui.message.bot({
      delay: delay,
      loading: loading,
      cssClass: cssClass,
      content: message,
      type: type,
    });
  }, delay);
};

const takeBotIconMsg = (cssClass, message, delay, loading, type) => {
  takeBotIcon();
  setTimeout(() => {
    takeBotMsg(cssClass, message, delay, loading, type);
  }, 1000);
};

const addHumanMsg = (content) => {
  botui.message.add({
    human: true,
    type: "html",
    content:
      "<div class='human-div'><p class='you'>You</p><div class='human-msg'><span class='human-text'>" +
      content +
      "<span></div></div>",
  });
};

const addAgentMsg = (content) => {
  botui.message
    .add({
      type: "html",
      cssClass: "agent-name",
      content:
        "<div class='agent-div'><p class='agent'>" + agentName + "<p></div>",
    })
    .then(() => {
      takeBotMsg("bot-msg agent-msg", content, 0, false, "text");
    });
};

const userInputsAction = (inType, placeholderText) => {
  inputType = inType;
  document.getElementById("user-input").style.display = "block";
  document.getElementsByClassName("input-container")[0].style.width = "98%";
  document.getElementById("user-input").placeholder = placeholderText;
};

const revokeUserInputAction = () => {
  document.getElementById("user-input").value = "";
  inputType = "";
  document.getElementById("user-input").style.display = "none";
  document.getElementsByClassName("input-container")[0].style.width = "100%";
  document.getElementById("user-input").placeholder = "";
  document.getElementById("email-error").style.display = "none";
};

const getUserInfo = (value) => {
  userInfo[inputType] = value.trim();
  revokeUserInputAction();
  addHumanMsg(value.trim());
};

const liveChat = (value) => {
  document.getElementById("user-input").value = "";
  addHumanMsg(value.trim());
  sendChatMessage(value.trim());
};

const emailValidation = (value) => {
  var filter =
    /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if (!filter.test(value)) {
    document.getElementById("user-input").focus = true;
    document.getElementById("email-error").innerHTML = emailErrorMsg;
    document.getElementById("email-error").style.display = "block";
    return false;
  } else {
    document.getElementById("email-error").innerHTML = "";
    document.getElementById("email-error").style.display = "none";
    return true;
  }
};

const sessionTimeout = () => {
  if (sessionTimeOut) {
    userInfo = {
      fName: "",
      lName: "",
      email: "",
    };

    medInfoToken = "";
    chatSessionInfo = "";
    agentName = "";
    agentAvailable = true;
    inputType = "";
    previousChatRequest = 0;
  }
};
