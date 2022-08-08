/***** Common Reusable methods */

const takeBotIcon = () => {
    botui.message.bot({
        delay: 1000,
        loading: true,
        type: "html",
        cssClass: "takeda-mi-chatbot-img-msg",
        content: "<img src='" + window._baseUrl2 + "/Chatbot/assets/Bot_.svg' alt='' height='38px' width='38px'/>",
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
    if(inputType === "fName" || inputType === "lName") {
        var nameRegex = new RegExp("^[a-zA-Z]+[a-z A-Z.'-]*[a-zA-Z]$");
        if(nameRegex.test(value)) {
            document.getElementById("takeda-mi-chatbot-email-error").innerHTML = "";
            document.getElementById("takeda-mi-chatbot-email-error").style.display = "none";
            return true;
        } else {
            document.getElementById("takeda-mi-chatbot-user-input").focus = true;
            document.getElementById("takeda-mi-chatbot-email-error").innerHTML = nameErrorMSg;
            document.getElementById("takeda-mi-chatbot-email-error").style.display = "block";
            return false;
        }
    }
};


const userInputsAction = (inType, placeholderText) => {
    inputType = inType;
	// $("#takeda-mi-chatbot-user-input").bind("keyup", testInput);
    document.getElementById("takeda-mi-chatbot-user-input").style.display = "block";
    //document.getElementsByClassName("input-container")[0].style.width = "98%";
    document.getElementById("takeda-mi-chatbot-user-input").placeholder = placeholderText;
    document.getElementById("takeda-mi-chatbot-user-input").focus = true;
	 if(inType !== "salesorceMsg" || intype !== "email") {
		document.getElementById("takeda-mi-chatbot-user-input").maxLength = 30;
	  } else {
		document.getElementById("takeda-mi-chatbot-user-input").maxLength = "";
	  }
};

const revokeUserInputAction = () => {
    document.getElementById("takeda-mi-chatbot-user-input").value = "";
    inputType = "";
    document.getElementById("takeda-mi-chatbot-user-input").style.display = "none";
    //document.getElementsByClassName("input-container")[0].style.width = "100%";
    document.getElementById("takeda-mi-chatbot-user-input").placeholder = "";
    document.getElementById("takeda-mi-chatbot-email-error").style.display = "none";
};

const getUserInfo = (value) => {
    userInfo[inputType] = value.trim();
    revokeUserInputAction();
    addHumanMsg(value.trim());
};

const liveChat = (value) => {
    document.getElementById("takeda-mi-chatbot-user-input").value = "";
    addHumanMsg(value.trim());
    sendChatMessage(value.trim());
};

const emailValidation = (value) => {
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!filter.test(value)) {
        document.getElementById("takeda-mi-chatbot-user-input").focus = true;
        document.getElementById("takeda-mi-chatbot-email-error").innerHTML = emailErrorMsg;
        document.getElementById("takeda-mi-chatbot-email-error").style.display = "block";
        return false;
    } else {
        document.getElementById("takeda-mi-chatbot-email-error").innerHTML = "";
        document.getElementById("takeda-mi-chatbot-email-error").style.display = "none";
        return true;
    }
};

const sessionTimeout = () => {
    if (sessionTimeOut) {
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
    }
};

const clear = () => {
    sessionTimeOut = true;
    sessionTimeout();
    sessionTimeOut = false;
    botui.message.removeAll();
};

const consoleLog = (data) => {
    if (typeof fnGetURLQueryString !== 'undefined' && typeof fnGetURLQueryString === 'function') {
        if (Boolean(Number(fnGetURLQueryString("debug"))))
            console.log(JSON.stringify(data));
    }
}

//window.onbeforeunload = function () {
//    //if (form.serialize() != original)
//    //    return 'Are you sure you want to leave?'
//    if (confirm("Do you want to end the conversation with Takeda Live Chat?")) {
//        return "";
//    }
//}

//window.onbeforeunload = function (e) {
//    var confirmationMessage = 'It looks like you have been editing something. '
//            + 'If you leave before saving, your changes will be lost.';

//        (e || window.event).returnValue = confirmationMessage; //Gecko + IE
//        return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
//}

//window.addEventListener('beforeunload', function (e) {
//        // Cancel the event and show alert that
//        // the unsaved changes would be lost
//        //e.preventDefault();
//        //e.returnValue = '';
//});

//$(window).bind('beforeunload', function () {
//    return "Do you want to exit this page?";
//});

//var isDirty = function () { return false; }
//window.onload = function () {
//    window.addEventListener("beforeunload", function (e) {
//        if (/*formSubmitting || */!isDirty()) {
//            return undefined;
//        }

//        var confirmationMessage = 'It looks like you have been editing something. '
//            + 'If you leave before saving, your changes will be lost.';

//        (e || window.event).returnValue = confirmationMessage; //Gecko + IE
//        return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
//    });
//};