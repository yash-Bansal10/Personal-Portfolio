// This is a Vercel serverless function, which is the standard way to write backend code for Vercel projects.
// It is written in TypeScript and will be executed in a Node.js environment.

// We import the 'nodemailer' library, which is the industry standard for sending emails from Node.js applications.
import nodemailer from 'nodemailer';

// This is the main handler function for the API endpoint.
// Vercel requires this default export. It takes a Request and returns a Response.
export default async function handler(req: Request) {
    // We only want to allow POST requests for this endpoint.
    // If it's any other method, we return an error.
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ message: 'Method Not Allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        // Parse the JSON body from the incoming request.
        const { name, email, message } = await req.json();

        // --- Server-side validation ---
        // It's crucial to validate on the server, even if you validate on the client,
        // as client-side code can be bypassed.
        if (!name || !email || !message) {
            return new Response(JSON.stringify({ message: 'Missing required fields' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // --- Nodemailer Setup ---
        // Create a "transporter" object, which is responsible for the connection and sending of emails.
        // We configure it to use Gmail's SMTP server.
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                // IMPORTANT: These credentials are NOT hardcoded. They are securely read from
                // Environment Variables that you will set in your Vercel project settings.
                user: process.env.EMAIL_USER, // Your Gmail address
                pass: process.env.EMAIL_PASS, // Your Google App Password
            },
        });

        // --- Email to the Site Owner ---
        // Configure the email that will be sent to you.
        const mailToOwner = {
            from: `Portfolio Contact Form <${process.env.EMAIL_USER}>`,
            to: '9.c.yashbansal@gmail.com', // Your personal email where you'll receive notifications.
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

        // --- Confirmation Email to the Visitor ---
        // Configure the confirmation email that will be sent to the person who filled out the form.
        const mailToVisitor = {
            from: `Yash Bansal <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Thank you for your message!',
            html: `
                <div style="font-family: sans-serif; line-height: 1.6;">
                    <h2>Thank You For Reaching Out!</h2>
                    <p>Hi ${name},</p>
                    <p>I have successfully received your message and will get back to you as soon as possible.</p>
                    <p>Here is a copy of your message:</p>
                    <blockquote style="border-left: 4px solid #ccc; padding-left: 1em; margin-left: 1em;">
                        <p>${message.replace(/\n/g, '<br>')}</p>
                    </blockquote>
                    <p>Best regards,<br>Yash Bansal</p>
                </div>
            `,
        };

        // Send both emails concurrently for efficiency using Promise.all.
        await Promise.all([
            transporter.sendMail(mailToOwner),
            transporter.sendMail(mailToVisitor)
        ]);
        
        // If both emails are sent successfully, return a success response.
        return new Response(JSON.stringify({ message: 'Message sent successfully!' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        // If any error occurs during the process, log it to the server console for debugging.
        console.error('Error handling contact form:', error);
        // Return a generic server error response to the client.
        return new Response(JSON.stringify({ message: 'An internal server error occurred.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
