import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendWelcomeEmail = async (toEmail, name, tempPassword) => {
  const appUrl = process.env.APP_URL || 'https://unitrack.infirow.in';
  
  const htmlTemplate = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #09090b; color: #ffffff; padding: 40px; }
      .container { max-width: 500px; margin: 0 auto; background-color: #0e0e11; border: 1px solid rgba(16,185,129,0.3); border-radius: 16px; padding: 30px; }
      .logo { text-align: center; margin-bottom: 20px; color: #10b981; font-weight: 900; font-size: 24px; letter-spacing: -1px; }
      h2 { text-align: center; font-size: 20px; font-weight: 700; margin-bottom: 15px; }
      p { font-size: 14px; color: #a1a1aa; line-height: 1.6; text-align: center; }
      .credentials-box { background-color: rgba(16,185,129,0.1); border: 1px dashed rgba(16,185,129,0.4); border-radius: 12px; padding: 20px; margin: 25px 0; text-align: center; }
      .cred-item { font-family: monospace; font-size: 14px; color: #10b981; font-weight: bold; margin: 5px 0; }
      .btn { display: inline-block; width: 100%; text-align: center; background-color: #10b981; color: #09090b; font-weight: 800; text-decoration: none; padding: 14px; border-radius: 10px; margin-top: 10px; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; }
      .footer { text-align: center; font-size: 11px; color: #52525b; margin-top: 30px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">UNItrack SaaS</div>
      <h2>Welcome to your Workspace, ${name}</h2>
      <p>Your secure SaaS workspace has been successfully provisioned. All your telemetry is now actively monitored and synced in real-time.</p>
      
      <div class="credentials-box">
        <div class="cred-item">Email: ${toEmail}</div>
        <div class="cred-item">Password: ${tempPassword}</div>
      </div>
      
      <p>Please log in and update your password immediately within Workspace Settings.</p>
      
      <a href="${appUrl}" class="btn">Access Workspace</a>
      
      <div class="footer">
        Automated security dispatch from UNItrack Systems.<br>
        If you did not request this account, please ignore this email.
      </div>
    </div>
  </body>
  </html>
  `;

  await transporter.sendMail({
    from: `"UNItrack Auth" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: 'Your UNItrack Workspace Credentials',
    html: htmlTemplate,
  });
};

export const sendResetPasswordEmail = async (toEmail, resetToken) => {
  const appUrl = process.env.APP_URL || 'https://unitrack.infirow.in';
  const resetLink = `${appUrl}/reset-password?token=${resetToken}`;
  
  const htmlTemplate = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #09090b; color: #ffffff; padding: 40px; }
      .container { max-width: 500px; margin: 0 auto; background-color: #0e0e11; border: 1px solid rgba(244,63,94,0.3); border-radius: 16px; padding: 30px; }
      .logo { text-align: center; margin-bottom: 20px; color: #f43f5e; font-weight: 900; font-size: 24px; letter-spacing: -1px; }
      h2 { text-align: center; font-size: 20px; font-weight: 700; margin-bottom: 15px; }
      p { font-size: 14px; color: #a1a1aa; line-height: 1.6; text-align: center; }
      .btn { display: inline-block; width: 100%; text-align: center; background-color: #f43f5e; color: #fff; font-weight: 800; text-decoration: none; padding: 14px; border-radius: 10px; margin-top: 25px; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; }
      .footer { text-align: center; font-size: 11px; color: #52525b; margin-top: 30px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">UNItrack Security</div>
      <h2>Password Reset Request</h2>
      <p>A request has been made to reset the password for your UNItrack workspace associated with this email address.</p>
      
      <p>If you made this request, please click the button below to authorize a new password entry.</p>
      
      <a href="${resetLink}" class="btn">Authorize Reset</a>
      
      <div class="footer">
        Link expires in 1 hour.<br>
        If you did not request this, your account remains secure and no action is required.
      </div>
    </div>
  </body>
  </html>
  `;

  await transporter.sendMail({
    from: `"UNItrack Security" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: 'Secure Password Reset Authorization',
    html: htmlTemplate,
  });
};
