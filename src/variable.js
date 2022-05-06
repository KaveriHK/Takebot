/*** Variable declaration for Takeda Chat bot */

var botui = new BotUI("chat-container");

var userInfo = {
  fName: "",
  lName: "",
  email: "",
};

var isWorkingHours = true;
var medInfoToken = "";
var chatSessionInfo = "";
var agentName;
var agentAvailable = true;
var inputType = "";
var previousChatRequest = 0;
