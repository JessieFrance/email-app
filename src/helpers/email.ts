/* eslint-disable class-methods-use-this */
import sgMail from '@sendgrid/mail';

/*  Wrapper class for SendGrid. */
class Email {
  /**
   * Initializes SendGrid library with API key.
   * @param apiKey  - SendGrid API key.
   * @returns - Promise<void>.
   *
   */
  constructor(apiKey: string) {
    sgMail.setApiKey(apiKey);
  }

  /**
   * This function sends an email using SendGrid.
   *
   * @param from  - Sender email addresss.
   * @param to  - Recipient email addresss.
   * @param subject  - Email subject.
   * @param html  - Email content as html.
   * @returns - Promise<void>. It sends an email, or logs an error.
   *
   */
  async sendEmail({
    from,
    to,
    subject,
    html,
  }: {
    from: string;
    to: string;
    subject: string;
    html: string;
  }) {
    try {
      await sgMail.send({ from, to, subject, html });
    } catch (err) {
      const errorMessage = (err as Error).message;
      console.error(`Error sending email to ${to}: ${errorMessage}`);
    }
  }
}

export default Email;
