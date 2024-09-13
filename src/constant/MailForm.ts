
// #region forgot password
function GeneratePasswordResetEmail(userName: string, content: string): string {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        color: #333;
      }
      .email-container {
        background-color: #fff;
        padding: 20px;
        margin: 0 auto;
        width: 600px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        border-radius: 5px;
      }
      h2 {
        color: #7260E6;
      }
      .reset-button {
        display: inline-block;
        padding: 10px 20px;
        font-size: 16px;
        color: #fff;
        background-color: #7260E6;
        border: none;
        text-decoration: none;
        border-radius: 5px;
        margin-top: 20px;
      }
      p {
        font-size: 16px;
      }
      .footer {
        font-size: 12px;
        color: #777;
        margin-top: 30px;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <h2>Hello, ${userName}!</h2>
      <p>You have requested to reset your password. Click the button below to proceed:</p>
      <a href="${content}" class="reset-button">Reset Password</a>
      <p>If you did not request this password reset, please ignore this email.</p>
      <p>Thank you,</p>
      <p>Carp Team SF</p>
      <div class="footer">
        <p>If you are having trouble clicking the "Reset Password" button, copy and paste the following link into your browser:</p>
        <p>${content}</p>
      </div>
    </div>
  </body>
  </html>
  `;
}

// #endregion

export { GeneratePasswordResetEmail }