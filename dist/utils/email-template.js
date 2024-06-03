"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResetTemplate = exports.getVerifyTemplate = void 0;
const getVerifyTemplate = (name, link, duration) => {
    return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
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
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
      .header {
        background-color: #3498db;
        padding: 40px 20px;
        text-align: center;
        color: #fff;
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
        color: #3498db;
      }
      .content a {
        display: inline-block;
        padding: 12px 30px;
        font-size: 16px;
        color: #fff;
        background-color: #3498db;
        text-decoration: none;
        border-radius: 50px;
        transition: background-color 0.3s ease;
      }
      .content a:hover {
        background-color: #2980b9;
      }
      .footer {
        background-color: #f9f9f9;
        color: #999;
        text-align: center;
        padding: 20px;
        font-size: 14px;
      }
      .footer p {
        margin: 5px 0;
      }
      .footer a {
        color: #3498db;
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
          This link will expire in ${duration} hours. If you didn't request a
          password reset, you can safely ignore this email.
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
`;
};
exports.getVerifyTemplate = getVerifyTemplate;
const getResetTemplate = (name, link, duration) => {
    return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
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
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
      .header {
        background-color: #3498db;
        padding: 40px 20px;
        text-align: center;
        color: #fff;
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
        background-color: #3498db;
        text-decoration: none;
        border-radius: 50px;
        transition: background-color 0.3s ease;
      }
      .content a:hover {
        background-color: #2980b9;
      }
      .footer {
        background-color: #f9f9f9;
        color: #999;
        text-align: center;
        padding: 20px;
        font-size: 14px;
      }
      .footer p {
        margin: 5px 0;
      }
      .footer a {
        color: #3498db;
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
          This link will expire in ${link} hours. If you didn't request a
          password reset, you can safely ignore this email.
        </p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      </div>
      <div class="footer">
        <p>© 2024 Trip Squad. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
`;
};
exports.getResetTemplate = getResetTemplate;
