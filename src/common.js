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
        "<div class='agent-div'><p class='agent'>" +
        agentInfo.name +
        "<p></div>",
    })
    .then(() => {
      takeBotMsg("bot-msg agent-msg", content, 0, false);
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
};

const getUserInfo = (value) => {
  userInfo[inputType] = value;
  console.log(userInfo);
  revokeUserInputAction();
  addHumanMsg(value);
};
