
export interface MailDTO {
  from: string;
  to: string;
  subject: string;
  text: string;
  html?: any;
  content?: string,
}