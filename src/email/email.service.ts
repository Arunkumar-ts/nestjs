import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";
import { Transporter } from "nodemailer";

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: this.config.get<string>("EMAIL_USER"),
        pass: this.config.get<string>("EMAIL_PASS"),
      },
    });
  }

  async sendMail(to: string, subject: string, html: string) {
    await this.transporter.sendMail({
      from: `"Bookmark support" <${this.config.get("EMAIL_USER")}>`,
      to,
      subject,
      html,
    });
  }

  async sendWelcomeEmail(to: string, username: string) {
    const html = `<h2>Hello ${username},</h2><p>Welcome to our Bookmark app!</p>`;
    return this.sendMail(to, "Welcome to Bookmark!", html);
  }

  async sendLoginEmail(to: string, username: string) {
    const html = `<h2>Hello ${username},</h2><p>Welcome back to our Bookmark app!</p>`;
    return this.sendMail(to, "Welcome back to Bookmark!", html);
  }
}

