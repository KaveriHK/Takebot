/***** Common Reusable methods */

const takeBotIcon = () => {
  botui.message.bot({
    delay: 1000,
    loading: true,
    type: "html",
    cssClass: "takeda-mi-chatbot-img-msg",
    content:
      "<img src='" + "./assets/Bot_.svg' alt='' height='38px' width='38px'/>",
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
      "<div class='takeda-mi-chatbot-human-div'><p class='takeda-mi-chatbot-you'>You</p><div class='takeda-mi-chatbot-human-msg'><span class='takeda-mi-chatbot-human-text'>" +
      content +
      "<span></div></div>",
  });
};

const addAgentMsg = (content) => {
  botui.message
    .add({
      type: "html",
      cssClass: "takeda-mi-chatbot-agent-name",
      content:
        "<div class='takeda-mi-chatbot-agent-div'><p class='takeda-mi-chatbot-agent'>" +
        agentName +
        "<p></div>",
    })
    .then(() => {
      takeBotMsg(
        "takeda-mi-chatbot-bot-msg takeda-mi-chatbot-agent-msg",
        content,
        0,
        false,
        "text"
      );
    });
};

/*function testInput(e) {
    console.log(this.value);
  if (inputType == "fName" || inputType == "lName") {
	var nameRegex = new RegExp("^[a-zA-Z]*[a-z A-Z.'-]*[a-zA-Z]$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (nameRegex.test(str)) {
        return true;
    }
	var keycode = e.which ? e.which : e.keyCode;
	if(keycode == 13) {
		return true;
	}
    e.preventDefault();
    return false;
  } 
}*/

function testInput(value) {
  value = typeof value === "object" ? this.value : value;
  if (inputType === "fName" || inputType === "lName") {
    var nameRegex = new RegExp("^[a-zA-Z]+[a-z A-Z.'-]*[a-zA-Z]$");
    if (nameRegex.test(value)) {
      document.getElementById("takeda-mi-chatbot-email-error").innerHTML = "";
      document.getElementById("takeda-mi-chatbot-email-error").style.display =
        "none";
      return true;
    } else {
      document.getElementById("takeda-mi-chatbot-user-input").focus = true;
      document.getElementById("takeda-mi-chatbot-email-error").innerHTML =
        getErrorMsg(value);
      document.getElementById("takeda-mi-chatbot-email-error").style.display =
        "block";
      return false;
    }
  } else if (inputType === "email") {
    emailValidation(value);
  }
}

const getErrorMsg = (val) => {
  if (inputType === "fName") {
    if (val.trim().length === 0) {
      return enterFname;
    } else {
      return fnameErrorMSg;
    }
  } else if (inputType === "lName") {
    if (val.trim().length === 0) {
      return enterLname;
    } else {
      return lnameErrorMSg;
    }
  }
};

const userInputsAction = (inType, placeholderText) => {
  inputType = inType;
  $("#takeda-mi-chatbot-user-input").bind("keyup", testInput);
  document.getElementById("takeda-mi-chatbot-user-input").style.display =
    "block";
  document.getElementById("takeda-mi-chatbot-send-icon").style.display =
    "block";
  //document.getElementsByClassName("input-container")[0].style.width = "98%";
  document.getElementById("takeda-mi-chatbot-user-input").placeholder =
    placeholderText;
  document.getElementById("takeda-mi-chatbot-user-input").focus = true;
  if (inType !== "salesorceMsg") {
    document.getElementById("takeda-mi-chatbot-user-input").maxLength =
      inType === "email" ? "50" : "30";
    document.getElementById("takeda-mi-chatbot-user-input").minLength =
      inType === "email" ? "10" : "1";
  } else {
    document.getElementById("takeda-mi-chatbot-user-input").maxLength = "3000";
    document.getElementById("takeda-mi-chatbot-user-input").minLength = "1";
  }
};

const revokeUserInputAction = () => {
  document.getElementById("takeda-mi-chatbot-user-input").value = "";
  inputType = "";
  document.getElementById("takeda-mi-chatbot-user-input").style.display =
    "none";
  document.getElementById("takeda-mi-chatbot-send-icon").style.display = "none";
  //document.getElementsByClassName("input-container")[0].style.width = "100%";
  document.getElementById("takeda-mi-chatbot-user-input").placeholder = "";
  document.getElementById("takeda-mi-chatbot-email-error").style.display =
    "none";
  document.getElementById("takeda-mi-chatbot-user-input").minLength = "";
  document.getElementById("takeda-mi-chatbot-user-input").maxLength = "";
};

const getUserInfo = (value) => {
  userInfo[inputType] = value.trim();
  sessionInfo[inputType] = value.trim();
  setSessionInformation();
  revokeUserInputAction();
  addHumanMsg(value.trim());
};

const liveChat = (value) => {
  document.getElementById("takeda-mi-chatbot-user-input").value = "";
  addHumanMsg(value.trim());
  sendChatMessage(value.trim());
};

const emailValidation = (value) => {
  var filter =
    /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if (!filter.test(value)) {
    document.getElementById("takeda-mi-chatbot-user-input").focus = true;
    document.getElementById("takeda-mi-chatbot-email-error").innerHTML =
      emailErrorMsg;
    document.getElementById("takeda-mi-chatbot-email-error").style.display =
      "block";
    return false;
  } else {
    document.getElementById("takeda-mi-chatbot-email-error").innerHTML = "";
    document.getElementById("takeda-mi-chatbot-email-error").style.display =
      "none";
    return true;
  }
};

const sessionTimeout = () => {
  agentAvailable = false;
  userInfo = {
    fName: "",
    lName: "",
    email: "",
  };

  medInfoToken = "";
  chatSessionInfo = "";
  agentName = "";
  inputType = "";
  previousChatRequest = 0;
  isWorkingHours = false;
  isNonHealthcareUser = "";
  isChatRestarted = false;
};

const clear = () => {
  sessionTimeout();
  isSessionTimeOut = false;
  botui.message.removeAll();
  removeSessionInformation();
  countOfSessionTimeOut = 0;
};

const consoleLog = (data) => {
  if (
    typeof fnGetURLQueryString !== "undefined" &&
    typeof fnGetURLQueryString === "function"
  ) {
    if (Boolean(Number(fnGetURLQueryString("debug"))))
      console.log(JSON.stringify(data));
  }
};

const scrollToElementView = (clsName) => {
  setTimeout(() => {
    const element = document.getElementsByClassName(clsName);
    //   element[0].scrollIntoView({
    //     behavior: "smooth",
    //     block: "end",
    //     inline: "nearest",
    //   });
    element[element.length - 1].scrollIntoView(true);
  }, 2100);
};

const setSessionInformation = () => {
  localStorage.setItem(
    "takeda-mi-chatbot-session-information",
    JSON.stringify(sessionInfo)
  );
};
const getSessionInformation = () => {
  const sessionDetails = localStorage.getItem(
    "takeda-mi-chatbot-session-information"
  );
  if (sessionDetails != undefined && sessionDetails != null) {
    return JSON.parse(sessionDetails);
  }
  return false;
};

const removeSessionInformation = () => {
  localStorage.removeItem("takeda-mi-chatbot-session-information");
};
