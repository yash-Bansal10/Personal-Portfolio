





// Import the official Vercel types for serverless functions
import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

// The handler now uses VercelRequest and VercelResponse types
export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Check if the method is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Vercel automatically parses the body for us, which is available on req.body
    const { name, email, message } = req.body;

    // Server-side validation
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Nodemailer transporter setup
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email to the site owner
    const mailToOwner = {
      from: `Portfolio Contact Form <${process.env.EMAIL_USER}>`,
      to: '9.c.yashbansal@gmail.com',
      subject: `New Message from ${name} via your Portfolio`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <hr>
          <h3>Message:</h3>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
      `,
    };

    // Confirmation email to the visitor
    const mailToVisitor = {
      from: `Yash Bansal <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Thank you for your message!',
      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>Thank You For Reaching Out!</h2>
          <p>Hi ${name},</p>
          <p>I have successfully received your message and will get back to you as soon as possible.</p>
        </div>
      `,
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(mailToOwner),
      transporter.sendMail(mailToVisitor)
    ]);

    // Send a success response
    return res.status(200).json({ message: 'Message sent successfully!' });

  } catch (error) {
    console.error('Error handling contact form:', error);
    return res.status(500).json({ message: 'An internal server error occurred.' });
  }
}