module.exports = {
  addTemplateContent(content) {
    console.log("addTemplateContent ~ content", content);
    /* 
    Variabler
    */
    const ugotleadLOGO = "";
    const address = "";
    const CVR = "";
    const CITY = "";

    const UGOTLEAD_EMAIL_CONTENT = `
    <style type="text/css">
    .mainContent {
      max-width: 600px;
      border: 0;
      background-color: white;
      color: black;
      padding: 25px;
    }
    .ugotlead_content {
      background-color: #FAFAFA;
      color: black;
      padding: 25px;
    }
    @media screen and (max-width:600px) {
      .mainContent {
          width: 100% !important;
      }
    }
    </style>
    <table class="tableBody" width="100%" border="0" cellspacing="0" cellpadding="0">
    <tbody>
    <tr>
    <td style="text-align: center;" align="center">
    <table class="mainContent">
    <tbody>
    <tr>
    </tr>
    <tr class="user_content" style="border-bottom: 1px solid #e9e9e9 !important;">
    ${content}
    </tr>
    <tr>

    </tr>
    <tr class="ugotlead_content" >
    <p style="text-align: center;"><em >Copyright © 2021 U GOT LEAD, All rights reserved.</em></p>
    <p  style="text-align: center;">Du modtager denne mail fordi du har spillet på en af vores kampagner</p>
    </tr>
    </tbody>
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    
    `;

    return UGOTLEAD_EMAIL_CONTENT;
  },
};
