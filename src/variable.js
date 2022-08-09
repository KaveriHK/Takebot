/*** Variable declaration for Takeda Chat bot */

var botui = new BotUI("takeda-mi-chatbot-chat-container");

var userInfo = {
  fName: "",
  lName: "",
  email: "",
};

var isWorkingHours;
var medInfoToken = "";
var chatSessionInfo = "";
var agentName;
var agentAvailable;
var inputType = "";
var previousChatRequest = 0;
var isSessionTimeOut;
var isNonHealthcareUser;
var countOfSessionTimeOut = 0;
var sessionInfo = {
  ...userInfo,
  hcp: undefined,
};
var isChatRestarted;
var isBotOpen;
