var botui = new BotUI("chat-container");
var userInfo = {
  fName: "",
  lName: "",
  email: "",
};
var productInfo = {
  product: "",
  keyword: "",
};
var medInfoToken = "";
var tokenExpiryTime = "";
var chatSessionInfo = "";
var agentInfo = {};
var agentAvailable = true;
var medicalInfo = [];

var error = false;
var inputType = "";

var emailInformation = "";

/***********************************************************************  Pre-defined Values  ****************************************************/
const credentials = {
  UserName: "cbuser",
  Password: "Welcome@123",
  grant_type: "password",
};

const products = [
  { text: "Alunbrig® (Brigatinib)", value: "Alunbrig (Brigatinib)" },
  { text: "Iclusig® (Ponatinib)", value: "Iclusig (Ponatinib)" },
  { text: "Exkivity™ (Mobocertinib)", value: "Exkivity (Mobocertinib)" },
  { text: "Ninlaro® (Ixazomib)", value: "Ninlaro (Ixazomib)" },
  { text: "Pevonedistat (TAK-924)", value: "Pevonedistat (TAK-924)" },
  { text: "Pipeline - Oncology", value: "PIPELINE - Oncology" },
  { text: "Velcade® (bortezomib)", value: "Velcade (bortezomib)" },
];

const topics = [
  { text: "Safety", value: "Safety" },
  { text: "Efficacy", value: "Efficacy" },
  { text: "Storage", value: "Storage" },
  { text: "Clinical Trial Results", value: "Clinical Trial Results" },
];

const hcp = [
  { text: "Yes", value: "Yes" },
  { text: "No", value: "No" },
];

/********************************************* Base URL *******************************************************************/
const baseURL =
  window.location.href === ""
    ? ""
    : "https://staging2.indegene.com/TakedaMedInfoCB/api/ChatbotService/";
const TOKEN_API = "https://staging2.indegene.com/TakedaMedInfoCB/token";

/********************************************************Chat Section  ******************************************************/

const takeBotIcon = () => {
  botui.message.bot({
    delay: 1000,
    loading: true,
    type: "html",
    cssClass: "img-msg",
    content: "<img src='./assets/Bot_.svg' alt='' height='38px' width='38px'/>",
  });
};

const takeBotMsg = (cssClass, message, delay, loading) => {
  setTimeout(() => {
    botui.message.bot({
      delay: delay,
      loading: loading,
      cssClass: cssClass,
      content: message,
    });
  }, delay);
};

const iconMsgWithNodelay = (message) => {
  takeBotIcon();
  setTimeout(() => {
    takeBotMsg("bot-msg", message, 0, false);
  }, 1000);
};

const startChat = () => {
  takeBotIcon();
  setTimeout(() => {
    takeBotMsg("bot-msg", "Hello! Welcome to Takeda Chatbot.", 100, false);
    verifyHCP();
  }, 1000);
};

const verifyHCP = () => {
  setTimeout(() => {
    botui.message.bot({
      delay: 1000,
      loading: true,
      cssClass: "bot-msg hcp",
      type: "html",
      content:
        "<span>Please verify you are a Healthcare Professional (HCP)?</span><div id='btn-div'><button id='hcp' class='btn-cls' onclick='healthcare()'>Yes</button><button id='hcp1' class='btn-cls' onclick='nonHealthcare()'>No</button></div>",
    });
  }, 1000);
};

const userInput = (value) => {
  document.getElementById("user-input").value = "";
  switch (inputType) {
    case "fName":
      userInfo[inputType] = value;
      addHumanMsg(value);
      iconMsgWithNodelay("Please provide your Last Name");
      inputType = "lName";
      setTimeout(() => {
        document.getElementById("user-input").placeholder =
          "Please enter you Last Name here";
      }, 1000);
      break;
    case "lName":
      userInfo[inputType] = value;
      addHumanMsg(value);
      iconMsgWithNodelay("Please provide your Email");
      inputType = "email";
      setTimeout(() => {
        document.getElementById("user-input").placeholder =
          "Please enter you email here";
      }, 1000);
      document.getElementById("user-input").type = "email";
      break;
    case "email":
      userInfo[inputType] = value;
      addHumanMsg(value);
      inputType = "products";
      document.getElementById("user-input").type = "text";
      document.getElementById("user-input").placeholder = "";
      takeBotIcon();
      setTimeout(() => {
        takeBotMsg(
          "bot-msg",
          "Select the Product you would like to know more about.",
          0,
          false
        );
        addButton(products, 0, "btn-list", "product");
      }, 1000);
      break;
    case "salesorceMsg":
      addHumanMsg(value);
      sendChatMessage(value);
      break;
  }
};
const removeCursor = () => {
  var btn = document.getElementById("hcp");
  var btn1 = document.getElementById("hcp1");
  var div = document.getElementById("btn-div");
  btn.classList.add("newClass");
  btn1.classList.add("newClass");
  div.classList.add("newClass");
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

const addAction = (type) => {
  botui.action
    .text({
      cssClass: "input-text",
      addMessage: false,
      action: {
        value: "",
        sub_type: type === "email" ? "email" : "",
      },
    })
    .then((res) => {
      userInfo[type] = res.value;
      addHumanMsg(res.value);
      if (type === "name") {
        takeBotIcon();
        setTimeout(() => {
          takeBotMsg("bot-msg", "Please provide your Email", 0, false);
          addAction("email");
        }, 1000);
      } else {
        takeBotIcon();
        setTimeout(() => {
          takeBotMsg(
            "bot-msg",
            "Select the product you're looking for from available products below:",
            0,
            false
          );
          addButton(products, 0, "btn-list", "product");
        }, 1000);
      }
    });
};

const healthcare = () => {
  getToken();
  removeCursor();
  addHumanMsg("Yes");
  setTimeout(() => {
    takeBotIcon();
    setTimeout(() => {
      takeBotMsg("bot-msg", "Please provide your First Name", 0, false);
      inputType = "fName";
      document.getElementById("user-input").placeholder =
        "Please enter your First Name here";
      // addAction("name");
    }, 1000);
  }, 1000);
};

const nonHealthcare = () => {
  removeCursor();
  addHumanMsg("No");
  setTimeout(() => {
    takeBotIcon();
    setTimeout(() => {
      botui.message.bot({
        cssClass: "bot-msg",
        type: "html",
        content:
          "<div>This chatbot is only for Healthcare Professionals, please visit <a class='med-info-link' href='https://www.takedaoncology.com/en/' target='_blank'>www.takedaoncology.com</a></div>",
      });
    }, 1000);
  }, 1000);
};
const addButton = (btnList, delay, cssClass, type) => {
  setTimeout(() => {
    botui.action
      .button({
        action: btnList,
        delay: delay,
        loading: true,
        cssClass: cssClass,
        autoHide: true,
        addMessage: false,
      })
      .then((res) => {
        if (type === "medicalInfo") {
          download(res.value);
        } else if (type === "reiteration") {
          addHumanMsg(res.value);
          if (res.value === "Yes") {
            takeBotIcon();
            setTimeout(() => {
              takeBotMsg(
                "bot-msg hcp",
                "Please Choose any of the topic below:",
                0,
                false
              );
              addButton(topics, 0, "btn-list", "keyword");
            }, 1000);
          } else {
            sendEmail();
            iconMsgWithNodelay(
              "Thank you for connecting with Takeda Chatbot!, Have a good day"
            );
          }
        } else {
          productInfo[type] = res.value;
          addHumanMsg(res.value);
          if (type === "product") {
            createChatInitRequest();
          } else {
            getMedcalInfo();
          }
        }
      });
  }, delay);
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

const displayMedInfo = (data) => {
  takeBotIcon();
  setTimeout(() => {
    takeBotMsg(
      "bot-msg",
      "Please see available standard response below",
      0,
      false
    );
    addButton(data, 0, "btn-list", "medicalInfo");
  }, 1000);
};

const download = (Id) => {
  const detail = medicalInfo.find((s) => s.Id === Id);
  emailInformation = detail;
  if (detail && detail.DocumentURL) {
    window.open(detail.DocumentURL);
  }
  takeBotIcon();
  setTimeout(() => {
    takeBotMsg("bot-msg", "Do you have any additional question?", 0, false);
    addButton(hcp, 0, "btn-list", "reiteration");
  }, 1000);
};

const sendEmail = async () => {
  const headers = new Headers();
  headers.append("Authorization", "Bearer " + medInfoToken);
  headers.append("Content-Type", "application/x-www-form-urlencoded");
  const payload = {
    FromEmail: "vinod.mukati@indegene.com",
    ToEmail: "kavya.kenchegowda@indegene.com",
    Subject: "User chat information - offline mode",
    Body:
      "<div>" +
      "<h3>" +
      emailInformation.Description +
      "</h3>" +
      "<p>" +
      emailInformation.DocumentURL +
      "</p>" +
      "</div>",
  };

  const formBody = setFormData(payload);

  const url = new URL(baseURL + "SendEmail");
  try {
    const sendEmail = await fetch(url, {
      method: "POST",
      headers: headers,
      body: formBody,
    });
    sendEmail1 = await sendEmail.json();
  } catch (error) {
    console.log(error);
  }
};

startChat();

/********************************************************************* API Call *********************************************************/

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

const setHeaders = () => {
  const headers = new Headers();
  headers.append("Authorization", "Bearer " + medInfoToken);
  headers.append("Content-Type", "application/json; charset=utf-8");
  headers.append("version", "54");
  return headers;
};

const getToken = async () => {
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
      tokenExpiryTime = Number(res.expires_in);
      checkMedInfoTokenExpiry();
      createChatSession();
    } else {
      takeBotMsg(
        "bot-msg",
        "Something went wrong!, pls try again after some time...",
        1000,
        true
      );
      return;
    }
  } catch (error) {
    takeBotMsg(
      "bot-msg",
      "Something went wrong!, pls try again after some time...",
      1000,
      true
    );
    return;
  }
};

const checkMedInfoTokenExpiry = () => {
  const trackExpiryTime = setInterval(() => {
    if (tokenExpiryTime > 0) {
      tokenExpiryTime = Number(tokenExpiryTime) - 1;
    } else {
      clearInterval(trackExpiryTime);
      getToken();
    }
  }, 1000);
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
    messagePoll();
  } catch (error) {
    takeBotMsg(
      "bot-msg",
      "Something went wrong!, pls try again after some time...",
      1000,
      true
    );
  }
};

const createChatInitRequest = async () => {
  const headers = setHeaders();
  headers.append("affinity", chatSessionInfo.affinityToken);
  headers.append("sessionkey", chatSessionInfo.key);

  const createSessionURL = new URL(baseURL + "ChatInitRequest");
  const payload = {
    organizationId: "00D7j0000004YQs",
    deploymentId: "5720a000000bnv2",
    buttonId: "5730a000000bo3X",
    sessionId: chatSessionInfo.id,
    userAgent: "",
    language: "en-US",
    screenResolution: "2560x1440",
    visitorName: userInfo["fName"] + " " + userInfo["lName"],
    prechatDetails: [
      {
        label: "FirstName",
        value: userInfo["fName"],
        entityMaps: [
          {
            entityName: "account",
            fieldName: "FirstName",
          },
        ],
        transcriptFields: ["First_Name_MVN__c"],
        displayToAgent: true,
      },
      {
        label: "LastName",
        value: userInfo["lName"],
        entityMaps: [
          {
            entityName: "account",
            fieldName: "LastName",
          },
        ],
        transcriptFields: ["Last_Name_MVN__c"],
        displayToAgent: true,
      },
      {
        label: "Email",
        value: userInfo["email"],
        entityMaps: [
          {
            entityName: "account",
            fieldName: "Email",
          },
        ],
        transcriptFields: ["Email_MVN__c"],
        displayToAgent: true,
      },
      {
        label: "Account Record Type",
        value: "HCP",
        entityMaps: [
          {
            entityName: "account",
            fieldName: "RecordTypeId",
          },
        ],
        transcriptFields: [""],
        displayToAgent: true,
      },
      {
        label: "Country",
        value: "United States",
        entityMaps: [
          {
            entityName: "account",
            fieldName: "MED_Country__c",
          },
        ],
        transcriptFields: [""],
        displayToAgent: true,
      },
      {
        label: "Status",
        value: "New",
        entityMaps: [
          {
            entityName: "Case",
            fieldName: "Status",
          },
        ],
        transcriptFields: ["caseStatus__c"],
        displayToAgent: true,
      },
      {
        label: "Origin",
        value: "Chat",
        entityMaps: [
          {
            entityName: "Case",
            fieldName: "Origin",
          },
        ],
        transcriptFields: ["caseOrigin__c"],
        displayToAgent: true,
      },

      {
        label: "Subject",
        value: "ChatCase",
        entityMaps: [
          {
            entityName: "Case",
            fieldName: "Subject",
          },
        ],
        transcriptFields: ["subject__c"],
        displayToAgent: true,
      },
      {
        label: "Description",
        value: "ChatCase",
        entityMaps: [
          {
            entityName: "Case",
            fieldName: "Description",
          },
        ],
        transcriptFields: ["description__c"],
        displayToAgent: true,
      },
    ],
    prechatEntities: [
      {
        entityName: "Account",
        saveToTranscript: "account",
        linkToEntityName: "Case",
        linkToEntityField: "AccountId",
        entityFieldsMaps: [
          {
            fieldName: "LastName",
            label: "LastName",
            doFind: true,
            isExactMatch: true,
            doCreate: true,
          },
          {
            fieldName: "FirstName",
            label: "FirstName",
            doFind: true,
            isExactMatch: true,
            doCreate: true,
          },
          {
            fieldName: "Email",
            label: "Email",
            doFind: true,
            isExactMatch: true,
            doCreate: true,
          },
        ],
      },
      {
        entityName: "Case",
        showOnCreate: true,
        saveToTranscript: "Case",
        entityFieldsMaps: [
          {
            fieldName: "Status",
            label: "Status",
            doFind: false,
            isExactMatch: false,
            doCreate: true,
          },
          {
            fieldName: "Origin",
            label: "Origin",
            doFind: false,
            isExactMatch: false,
            doCreate: true,
          },

          {
            fieldName: "Subject",
            label: "Subject",
            doFind: false,
            isExactMatch: false,
            doCreate: true,
          },
          {
            fieldName: "Description",
            label: "Description",
            doFind: false,
            isExactMatch: false,
            doCreate: true,
          },
        ],
      },
    ],
    receiveQueueUpdates: true,
    isPost: true,
  };

  try {
    const chatReq = await fetch(createSessionURL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    });
    chatReq1 = await chatReq.json();
  } catch (error) {
    takeBotMsg(
      "bot-msg",
      "Something went wrong!, pls try again after some time...",
      1000,
      true
    );
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
    readMessages(systemMessages);
    if (agentAvailable) {
      messagePoll();
    }
  } catch (error) {
    console.log(error);
  }
};

const getMedcalInfo = async () => {
  const headers = new Headers();
  headers.append("Authorization", "Bearer " + medInfoToken);
  headers.append("Content-Type", "application/json; charset=utf-8");
  let medInfoSearchURL = baseURL + "MedinfoSearch";
  medInfoSearchURL = medInfoSearchURL + "?";
  medInfoSearchURL = medInfoSearchURL + "product=" + productInfo.product;
  medInfoSearchURL = medInfoSearchURL + "&" + "keyword=" + productInfo.keyword;

  try {
    const medInfo = await fetch(medInfoSearchURL, {
      method: "GET",
      headers: headers,
    });
    medicalInfo = await medInfo.json();
    if (
      (medicalInfo.length > 0 && medicalInfo === "No documents found.") ||
      medicalInfo.length === 0
    ) {
      takeBotIcon();
      setTimeout(() => {
        takeBotMsg(
          "bot-msg",
          "We are unable to find information related to your selection",
          0,
          false
        );
        takeBotMsg(
          "bot-msg hcp",
          "Choose another topic from available topics below",
          0,
          false
        );
        addButton(topics, 0, "btn-list", "keyword");
      }, 1000);
    } else {
      const medInfosList = [];
      medicalInfo.forEach((element) => {
        const obj = {
          text: element.Name,
          value: element.Id,
        };
        medInfosList.push(obj);
      });
      displayMedInfo(medInfosList);
    }
  } catch (e) {
    takeBotMsg(
      "bot-msg",
      "Something went wrong!, pls try again after some time...",
      1000,
      true
    );
    return;
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
  } catch (error) {
    takeBotMsg(
      "bot-msg",
      "Something went wrong!, pls try again after some time...",
      1000,
      true
    );
  }
};

const closeTakebot = () => {
  alert("Close!");
};
