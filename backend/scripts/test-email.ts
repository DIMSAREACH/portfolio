import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

async function testEmail() {
  const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.EMAIL_PORT || '587', 10);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const from = process.env.EMAIL_FROM || user;

  const targetEmail = process.argv[2] || user;

  console.log('--- Email Configuration Test ---');
  console.log(`SMTP Host: ${host}`);
  console.log(`SMTP Port: ${port}`);
  console.log(`User:      ${user ? user : '(not set)'}`);
  console.log(`Password:  ${pass ? '********' : '(not set)'}`);
  console.log(`From:      ${from}`);
  console.log(`Target:    ${targetEmail || '(not set)'}`);
  console.log('--------------------------------\n');

  if (!user || !pass) {
    console.error('❌ EMAIL_USER or EMAIL_PASS is not configured in backend/.env');
    console.log('Please configure your credentials in backend/.env before running this test.');
    process.exit(1);
  }

  if (!targetEmail) {
    console.error('❌ Please provide a target recipient email address:');
    console.log('Usage: npm run test-email -- recipient@example.com');
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  console.log('Verifying SMTP connection credentials...');
  try {
    await transporter.verify();
    console.log('✅ SMTP connection authenticated successfully!\n');
  } catch (error) {
    console.error('❌ Failed to connect to SMTP server:');
    console.error((error as Error).message);
    process.exit(1);
  }

  console.log(`Sending a test message to ${targetEmail}...`);
  try {
    const info = await transporter.sendMail({
      from,
      to: targetEmail,
      subject: '✅ Dim Sareach Portfolio - Test Email Delivery',
      text: `Hello!\n\nThis is a confirmation that your email service in Dim Sareach Portfolio is configured correctly.\n\nSent at: ${new Date().toISOString()}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #4f46e5;">Portfolio Email Service is Working!</h2>
          <p>This is a confirmation that your email delivery is fully connected and ready for:</p>
          <ul>
            <li>Password Reset requests</li>
            <li>Contact form visitor notifications</li>
            <li>Confirmation receipts</li>
          </ul>
          <p style="font-size: 12px; color: #64748b;">Sent at: ${new Date().toLocaleString()}</p>
        </div>
      `,
    });

    console.log('✅ Email sent successfully!');
    console.log(`Message ID: ${info.messageId}`);
    console.log('\n🎉 Check your inbox (or spam folder) for the test email.');
  } catch (error) {
    console.error('❌ Failed to send email:');
    console.error((error as Error).message);
    process.exit(1);
  }
}

testEmail();
