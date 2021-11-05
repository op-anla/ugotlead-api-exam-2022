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
      max-width: 300px;
      border: 0;

    }
    </style>
    <table class="tableBody">
    <tbody>
    <tr>
    <td style="text-align: center;" align="center">
    <table class="mainContent">
    <tbody>
    <tr>
    <p>Dette skal være company logo</p>
    </tr>
    <tr>
    ${content}
    </tr>
    <tr>
    <p>Dette er til socials</p>
    </tr>
    <tr>
    <p>Dette er til UGOTLEAD stuff (CVR mm.)</p>
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
