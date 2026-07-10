import { Resend } from "resend";


export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string,
  name: string
): Promise<void> => {
    const resend = new Resend(process.env.RESEND_API_KEY);
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  await resend.emails.send({
    from: "InvoiceNaija <onboarding@resend.dev>",
    to: email,
    subject: "Reset Your InvoiceNaija Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #10b981; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">InvoiceNaija</h1>
        </div>
        
        <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px;">
          <h2 style="color: #1e293b;">Hi ${name},</h2>
          <p style="color: #64748b; line-height: 1.6;">
            We received a request to reset your InvoiceNaija password. 
            Click the button below to create a new password.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a 
              href="${resetUrl}" 
              style="background: #10b981; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;"
            >
              Reset Password
            </a>
          </div>
          
          <p style="color: #94a3b8; font-size: 13px;">
            This link expires in <strong>1 hour</strong>. 
            If you didn't request a password reset, ignore this email.
          </p>

          <p style="color: #94a3b8; font-size: 12px; margin-top: 20px;">
            Or copy this link into your browser:<br/>
            <span style="color: #10b981;">${resetUrl}</span>
          </p>
        </div>
      </div>
    `,
  });
};