export const runtime = 'edge';

const RESEND_API_URL = 'https://api.resend.com/emails';
const DEFAULT_FROM = 'VerspeKtive <noreply@verspektive.com>';

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    console.warn('RESEND_API_KEY is not set. Email not sent.');
    return { success: false, error: 'No API key' };
  }

  try {
    const res = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || DEFAULT_FROM,
        to,
        subject,
        html
      })
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Failed to send email via Resend:', errorData);
      return { success: false, error: errorData };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (err) {
    console.error('Exception sending email:', err);
    return { success: false, error: 'Exception occurred' };
  }
}
