export const getVerifyTemplate = (
  name: string,
  link: string,
  duration: number
): string => {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Account Verification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f9f9f9;
        margin: 0;
        padding: 0;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: 40px auto;
        background-color: #fff;
        border-radius: 0.5em;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
      .header {
        background-color: #2563eb;
        padding: 40px 20px;
        text-align: center;
        color: #fff;
        border-radius: 0.5em 0.5em 0 0;
      }
      .header h1 {
        margin: 0;
        font-size: 32px;
        letter-spacing: 2px;
      }
      .content {
        padding: 30px 20px;
        text-align: center;
      }
      .content h2 {
        margin: 0 0 20px;
        font-size: 24px;
        color: #333;
      }
      .content p {
        margin: 0 0 20px;
        color: #666;
        font-size: 16px;
        line-height: 1.5;
      }
      .content span {
        font-weight: bold;
        color: #2563eb;
      }
      .content a {
        display: inline-block;
        padding: 12px 30px;
        font-size: 16px;
        color: #fff;
        background-color: #2563eb;
        text-decoration: none;
        border-radius: 0.5em;
        transition: background-color 0.3s ease;
      }
      .content a:hover {
        background-color: #1d4ed8;
      }
      .footer {
        background-color: #f9f9f9;
        color: #999;
        text-align: center;
        padding: 20px;
        font-size: 14px;
        border-radius: 0 0 0.5em 0.5em;
      }
      .footer p {
        margin: 5px 0;
      }
      .footer a {
        color: #2563eb;
        text-decoration: none;
      }
      .footer a:hover {
        text-decoration: underline;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Trip Squad</h1>
      </div>
      <div class="content">
        <h2>Hello <span>${name}</span>,</h2>
        <p>
          Thank you for joining Trip Squad! Click the button below to verify
          your email address and start your adventure with us.
        </p>
        <a href="${link}">Verify Email</a>
        <p>
          This link will expire in ${duration} hours.
        </p>
      </div>
      <div class="footer">
        <p>If you did not sign up for Trip Squad, please ignore this email.</p>
        <p>
          Need help?
          <a href="mailto:support@tripsquad.com">Contact our support team</a>
        </p>
        <p>© 2024 Trip Squad. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
`
}

export const getResetTemplate = (
  name: string,
  link: string,
  duration: number
): string => {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset Password</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f9f9f9;
        margin: 0;
        padding: 0;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: 40px auto;
        background-color: #fff;
        border-radius: 0.5em;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
      .header {
        background-color: #2563eb;
        padding: 40px 20px;
        text-align: center;
        color: #fff;
        border-radius: 0.5em 0.5em 0 0;
      }
      .header h1 {
        margin: 0;
        font-size: 32px;
        letter-spacing: 2px;
      }
      .content {
        padding: 30px 20px;
        text-align: center;
      }
      .content h2 {
        margin: 0 0 20px;
        font-size: 24px;
        color: #333;
      }
      .content p {
        margin: 0 0 20px;
        color: #666;
        font-size: 16px;
        line-height: 1.5;
      }
      .content a {
        display: inline-block;
        padding: 12px 30px;
        font-size: 16px;
        color: #fff;
        background-color: #2563eb;
        text-decoration: none;
        border-radius: 0.5em;
        transition: background-color 0.3s ease;
      }
      .content a:hover {
        background-color: #1d4ed8;
      }
      .footer {
        background-color: #f9f9f9;
        color: #999;
        text-align: center;
        padding: 20px;
        font-size: 14px;
        border-radius: 0 0 0.5em 0.5em;
      }
      .footer p {
        margin: 5px 0;
      }
      .footer a {
        color: #2563eb;
        text-decoration: none;
      }
      .footer a:hover {
        text-decoration: underline;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Reset Your Password</h1>
      </div>
      <div class="content">
        <h2>Hello <span>${name}</span>,</h2>
        <p>
          You recently requested to reset your password for your Trip Squad
          account. Click the button below to reset it:
        </p>
        <a href="${link}">Reset Password</a>
        <p>
          This link will expire in ${duration} hours. If you didn't request a
          password reset, you can safely ignore this email.
        </p>
      </div>
      <div class="footer">
        <p>© 2024 Trip Squad. All rights reserved.</p>
        <p>Need help? <a href="mailto:support@tripsquad.com">Contact our support team</a></p>
      </div>
    </div>
  </body>
</html>
`
}

export const getUserInfoTemplate = (
  name: string,
  loginUrl: string,
  username: string,
  password: string
) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>New Account Details</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f3f4f6;
        margin: 0;
        padding: 0;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 0.5em;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
      .header {
        background-color: #2563eb;
        padding: 20px;
        text-align: center;
        color: #ffffff;
        border-radius: 0.5em 0.5em 0 0;
      }
      .header h1 {
        margin: 0;
        font-size: 28px;
      }
      .content {
        padding: 20px;
        text-align: center;
      }
      .content h2 {
        margin: 0 0 15px;
        font-size: 22px;
        color: #333333;
      }
      .content p {
        margin: 0 0 15px;
        color: #666666;
        font-size: 16px;
        line-height: 1.5;
      }
      .content strong {
        color: #2563eb;
      }
      .content a {
        display: inline-block;
        padding: 12px 25px;
        font-size: 16px;
        color: #ffffff;
        background-color: #2563eb;
        text-decoration: none;
        border-radius: 0.5em;
        transition: background-color 0.3s ease;
      }
      .content a:hover {
        background-color: #1d4ed8;
      }
      .footer {
        background-color: #f3f4f6;
        color: #999999;
        text-align: center;
        padding: 15px;
        font-size: 14px;
        border-radius: 0 0 0.5em 0.5em;
      }
      .footer p {
        margin: 5px 0;
      }
      .footer a {
        color: #2563eb;
        text-decoration: none;
      }
      .footer a:hover {
        text-decoration: underline;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Trip Squad</h1>
      </div>
      <div class="content">
        <h2>Welcome, <strong>${name}</strong>!</h2>
        <p>
          We are thrilled to have you join Trip Squad. Your account has been
          successfully created. Here are your login details:
        </p>
        <p><strong>Username:</strong> <span>${username}</span></p>
        <p><strong>Password:</strong> <span>${password}</span></p>
        <a href="${loginUrl}">Log In</a>
        <p>Click the log in button and start your adventure.</p>
      </div>
      <div class="footer">
        <p>If you did not sign up for Trip Squad, please ignore this email.</p>
        <p>
          Need help?
          <a href="mailto:support@tripsquad.com">Contact our support team</a>
        </p>
        <p>© 2024 Trip Squad. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
`
}
