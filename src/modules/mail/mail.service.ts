import configs from '../../configs';
import * as fs from 'fs';

const emailTemplate = fs.readFileSync('./templates/mail.template').toString();
import nodemailer from 'nodemailer';

export class MailService {
  // create transporter object with smtp server details
  sendMail = async (
    toEmail,
    subject,
    content = '<h1>Example HTML Message Body</h1>',
  ) => {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport(configs.SMTP_SERVER);

    // send email
    await transporter.sendMail({
      from: 'NhanTNC',
      to: toEmail,
      subject: subject,
      html: content,
    });
  };

  generateEmailContent = (fullname: string, assetname: string) => {
    return emailTemplate
      .replace('##FULLNAME##', fullname)
      .replace('##ASSETNAME##', assetname);
  };
}
