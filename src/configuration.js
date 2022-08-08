/*** credential and API End Point */

var credentials = {
  UserName: "cbuser",
  Password: "Welcome@123",
  grant_type: "password",
};

var baseURL =
  window.location.href === ""
    ? ""
    : "https://staging2.indegene.com/TakedaMedInfo/api/ChatbotService/";

var TOKEN_API = "https://staging2.indegene.com/TakedaMedInfo/token";

TOKEN_API = window._baseUrl2 +"/token";
//baseURL = $(location).attr('protocol') + "//" + $(location).attr('hostname') +":"+ $(location).attr('port') + "/api/ChatbotService/";
baseURL = window._baseUrl2 + "/api/ChatbotService/";

var payload = {
  organizationId: "00D7j0000004YQs",//Org.Id will be overriden with the value taken from web.config.
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
