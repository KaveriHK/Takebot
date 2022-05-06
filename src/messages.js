var welcomeMsg = "Hello! Welcome to Takeda Chatbot.";
var verificationMsg = "Please verify you are a Healthcare Professional (HCP)?";
var nonHealthcareMsg =
  "This chatbot is only for Healthcare Professionals, please visit";
var verificationTemplate =
  "<span>" +
  verificationMsg +
  "</span><div id='btn-div'><button id='hcp' class='btn-cls' onclick='healthcare()'>Yes</button><button id='hcp1' class='btn-cls' onclick='nonHealthcare()'>No</button></div>";
var nonHealthcareTemplate =
  "<div>" +
  nonHealthcareMsg +
  " <a class='med-info-link' href='https://www.takedaoncology.com/en/' target='_blank'>www.takedaoncology.com</a></div>";

var firstNameMsg = "Please provide your First Name";
var firstNamePlaceholder = "Please enter your First Name here";
var lastNameMsg = "Please provide your Last Name";
var lastNamePlaceholder = "Please enter you Last Name here";
var emailMsg = "Please provide your Email";
var emailMsgPlaceholder = "Please enter you email here";
var nonWorkingHoursMsg =
  "Our Live agents are currently unavailable. Live agents are only available from 8AM - 6PM EST.";
var nonWorkingHoursTemplate =
  "<div> Please come back later or explore <a class='med-info-link' href='https://www.oncologymedinfo.com/MedicalInformation' target='_blank'>www.oncologymedinfo.com</a></div>";
var errorMsg = "Something went wrong!, please come back after some time...";
var connectingMsg = "We are connecting you to our call centre agent.";
var apologyMsg =
  "Apology for the delay, can you please wait till the agents are available";
var agentsNotAvailableTemplate =
  "<div> All our live agents are currently busy, please come back later or explore <a class='med-info-link' href='https://www.oncologymedinfo.com/MedicalInformation' target='_blank'>www.oncologymedinfo.com</a></div>";
var agentJoinedMsg = " our call centre agent, has joined the conversation.";
var userResponsesPlaceholder = "Please type your responses here";
var thankYouMsg =
  "Thank you for connecting with Takeda Chatbot!, Have a good day";
var emailErrorMsg = "Please provide a valid email address";
var sessionTimeoutMsg = "Session has been Timed Out!";
