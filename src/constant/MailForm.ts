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
      <p>Carp Team SP</p>
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

// #region Form activate account
function ActivateAccountEmailForm(userName: string, content: string): string {
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
      <p>You have registered an account at Izy Task, please follow the instructions to activate your account!</p>
      <p>Click the button below to proceed:</p>
      <a href="${content}" class="reset-button" style="color: #fff">Activate</a>
      <p>Thank you,</p>
      <p>Carp Team SP</p>
      <div class="footer">
        <p>If you are having trouble clicking the "Activate" button, copy and paste the following link into your browser:</p>
        <p>${content}</p>
      </div>
    </div>
  </body>
  </html>
  `;
}
// #endregion

// #region Form reset password
function ResetPasswordForm(userName: string, content: string): string {
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
      <h2>Hello, ${userName} ╰(*°▽°*)╯</h2>
      <p>You have requested a password reset for your account on Izy Task. Please follow the instructions to set a new password.!</p>
      <p>Click the button below to reset password:</p>
      <a href="${content}" class="reset-button" style="color: #fff">Reset password </a>
      <p>Thank you,</p>
      <p>Carp Team SP</p>
      <div class="footer">
        <p>If you are having trouble clicking the "Reset password" button, copy and paste the following link into your browser:</p>
        <p>${content}</p>
      </div>
    </div>
  </body>
  </html>
  `;
}
// #endregion

function WelcomeNewUser(username: string) {
  return `
  <!DOCTYPE html>
  <html lang="en">

  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Account Verified</title>
      <style>
          * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
          }

          body {
              background-color: #05051F;
              font-family: Arial, sans-serif;
              color: #ffffff;
              margin: 0;
              padding: 0;
              display: flex;
              flex-direction: column;
              min-height: 100vh;
              text-align: center;
          }

          .container {
              background-color: #14142b;
              border-radius: 10px;
              padding: 40px;
              box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.5);
              margin-bottom: 20px;
          }

          h1 {
              color: #7260E6;
              font-size: 2.5rem;
              margin-bottom: 20px;
          }

          p {
              color: #ffffff;
              font-size: 1.2rem;
              margin-bottom: 30px;
          }

          .success-icon {
              font-size: 4rem;
              color: #43E97B;
              margin-bottom: 20px;
          }

          .btn {
              background-color: #7260E6;
              color: #ffffff;
              padding: 10px 20px;
              text-decoration: none;
              border-radius: 5px;
              font-size: 1rem;
              transition: background-color 0.3s ease;
          }

          .btn:hover {
              background-color: #5b48c4;
          }

          /* Sticky Footer */
          .content {
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
          }

          footer {
              padding: 10px 0;
              width: 100%;
              background-color: #14142b;
              box-shadow: 0px -4px 10px rgba(0, 0, 0, 0.5);
              text-align: center;
          }

          footer p {
              font-size: 0.9rem;
              margin: 5px 0;
          }

          footer a {
              color: #7260E6;
              text-decoration: none;
              margin: 0 10px;
              transition: color 0.3s ease;
          }

          footer a:hover {
              color: #5b48c4;
          }
      </style>
  </head>

  <body>
      <div class="content">
          <div class="container">
              <div class="success-icon">✔️</div>
              <h1>Welcome to Izy Task</h1>
              <p>Hello ${username}!</p>
              <p>Congratulations! Your account has been successfully verified.</p>
              <p>Have a great experience on our website.</p>
              <a href="http://izytask:5173/login" class="btn">Go to login</a>
          </div>
      </div>

      <footer>
          <p>
              <a href="https://github.com/carp-calangthang" target="_blank">@carpthecalangthang</a>
              |
              <a href="https://github.com/hxann" target="_blank">@Hxann</a>
          </p>
      </footer>
  </body>

  </html>
  `;
}

export { GeneratePasswordResetEmail, ActivateAccountEmailForm, ResetPasswordForm, WelcomeNewUser };
