import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get('SENDGRID_API_KEY');
    if (apiKey && apiKey !== 'SG.xxxxxxxxxxxxx') {
      sgMail.setApiKey(apiKey);
    }
  }

  private loadTemplate(templateName: string): string {
    const templatePath = path.join(__dirname, 'templates', `${templateName}.html`);
    if (fs.existsSync(templatePath)) {
      return fs.readFileSync(templatePath, 'utf-8');
    }
    return '';
  }

  private replaceVariables(template: string, variables: Record<string, string>): string {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    return result;
  }

  async sendNewLeadNotification(specialistEmail: string, specialistName: string, leadData: any) {
    const template = this.loadTemplate('new-lead');
    const html = this.replaceVariables(template, {
      specialistName,
      customerName: leadData.customerName,
      customerEmail: leadData.customerEmail,
      customerPhone: leadData.customerPhone,
      message: leadData.message,
      dashboardUrl: `${this.configService.get('FRONTEND_URL')}/profi/dashboard`,
    });

    try {
      await sgMail.send({
        to: specialistEmail,
        from: {
          email: this.configService.get('SENDGRID_FROM_EMAIL')!,
          name: this.configService.get('SENDGRID_FROM_NAME'),
        },
        subject: `Nová poptávka od ${leadData.customerName}`,
        html: html || `
          <h1>Nová poptávka</h1>
          <p>Dobrý den ${specialistName},</p>
          <p>Máte novou poptávku od ${leadData.customerName}.</p>
          <p><strong>Email:</strong> ${leadData.customerEmail}</p>
          <p><strong>Telefon:</strong> ${leadData.customerPhone}</p>
          <p><strong>Zpráva:</strong> ${leadData.message}</p>
        `,
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async sendLeadConfirmation(customerEmail: string, customerName: string, specialistName: string) {
    const template = this.loadTemplate('lead-confirmation');
    const html = this.replaceVariables(template, {
      customerName,
      specialistName,
    });

    try {
      await sgMail.send({
        to: customerEmail,
        from: {
          email: this.configService.get('SENDGRID_FROM_EMAIL')!,
          name: this.configService.get('SENDGRID_FROM_NAME'),
        },
        subject: `Potvrzení poptávky - ${specialistName}`,
        html: html || `
          <h1>Potvrzení poptávky</h1>
          <p>Dobrý den ${customerName},</p>
          <p>Děkujeme za vaši poptávku. ${specialistName} vás bude brzy kontaktovat.</p>
        `,
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async sendWelcomeEmail(email: string, name: string) {
    const template = this.loadTemplate('welcome');
    const html = this.replaceVariables(template, {
      name,
      dashboardUrl: `${this.configService.get('FRONTEND_URL')}/profi/dashboard`,
    });

    try {
      await sgMail.send({
        to: email,
        from: {
          email: this.configService.get('SENDGRID_FROM_EMAIL')!,
          name: this.configService.get('SENDGRID_FROM_NAME'),
        },
        subject: 'Vítejte na tvujspecialista.cz',
        html: html || `
          <h1>Vítejte!</h1>
          <p>Dobrý den ${name},</p>
          <p>Děkujeme za registraci na tvujspecialista.cz.</p>
        `,
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async sendEnrollmentConfirmation(
    email: string,
    userName: string,
    courseTitle: string,
    courseSlug: string,
  ): Promise<void> {
    const courseUrl = `${this.configService.get('FRONTEND_URL')}/academy/learn/${courseSlug}`;
    const dashboardUrl = `${this.configService.get('FRONTEND_URL')}/academy/my-learning`;

    const template = this.loadTemplate('enrollment-confirmation');
    const html = this.replaceVariables(template, {
      userName,
      courseTitle,
      courseUrl,
      dashboardUrl,
    });

    try {
      await sgMail.send({
        to: email,
        from: {
          email: this.configService.get('SENDGRID_FROM_EMAIL')!,
          name: this.configService.get('SENDGRID_FROM_NAME'),
        },
        subject: `Potvrzení zápisu: ${courseTitle}`,
        html: html || `
          <h1>Gratulujeme k zápisu do kurzu!</h1>
          <p>Dobrý den ${userName},</p>
          <p>Byl/a jste úspěšně zapsán/a do kurzu: <strong>${courseTitle}</strong></p>
          <p><a href="${courseUrl}">Začít se učit</a></p>
        `,
      });
    } catch (error) {
      console.error('Error sending enrollment confirmation email:', error);
    }
  }

  async sendRSVPConfirmation(
    email: string,
    userName: string,
    eventTitle: string,
    eventSlug: string,
  ): Promise<void> {
    const eventUrl = `${this.configService.get('FRONTEND_URL')}/community/events/${eventSlug}`;
    const myEventsUrl = `${this.configService.get('FRONTEND_URL')}/community/my-events`;

    const template = this.loadTemplate('rsvp-confirmation');
    const html = this.replaceVariables(template, {
      userName,
      eventTitle,
      eventUrl,
      myEventsUrl,
    });

    try {
      await sgMail.send({
        to: email,
        from: {
          email: this.configService.get('SENDGRID_FROM_EMAIL')!,
          name: this.configService.get('SENDGRID_FROM_NAME'),
        },
        subject: `Potvrzení registrace: ${eventTitle}`,
        html: html || `
          <h1>Potvrzení registrace na akci</h1>
          <p>Dobrý den ${userName},</p>
          <p>Byl/a jste úspěšně registrován/a na akci: <strong>${eventTitle}</strong></p>
          <p><a href="${eventUrl}">Zobrazit detail akce</a></p>
          <p><a href="${myEventsUrl}">Moje akce</a></p>
        `,
      });
    } catch (error) {
      console.error('Error sending RSVP confirmation email:', error);
    }
  }

  async sendEventCancellation(
    email: string,
    userName: string,
    eventTitle: string,
  ): Promise<void> {
    const eventsUrl = `${this.configService.get('FRONTEND_URL')}/community/events`;

    const template = this.loadTemplate('event-cancellation');
    const html = this.replaceVariables(template, {
      userName,
      eventTitle,
      eventsUrl,
    });

    try {
      await sgMail.send({
        to: email,
        from: {
          email: this.configService.get('SENDGRID_FROM_EMAIL')!,
          name: this.configService.get('SENDGRID_FROM_NAME'),
        },
        subject: `Zrušení akce: ${eventTitle}`,
        html: html || `
          <h1>Akce byla zrušena</h1>
          <p>Dobrý den ${userName},</p>
          <p>Omlouváme se, ale akce <strong>${eventTitle}</strong> byla zrušena.</p>
          <p>Pokud jste zaplatili vstupné, bude vám vráceno.</p>
          <p><a href="${eventsUrl}">Zobrazit další akce</a></p>
        `,
      });
    } catch (error) {
      console.error('Error sending event cancellation email:', error);
    }
  }

  async sendCommissionNotification(
    email: string,
    specialistName: string,
    dealValue: number,
    commissionAmount: number,
  ): Promise<void> {
    const dashboardUrl = `${this.configService.get('FRONTEND_URL')}/profi/dashboard`;
    const commissionsUrl = `${this.configService.get('FRONTEND_URL')}/profi/commissions`;

    const template = this.loadTemplate('commission-notification');
    const html = this.replaceVariables(template, {
      specialistName,
      dealValue: dealValue.toLocaleString('cs-CZ'),
      commissionAmount: commissionAmount.toLocaleString('cs-CZ'),
      dashboardUrl,
      commissionsUrl,
    });

    try {
      await sgMail.send({
        to: email,
        from: {
          email: this.configService.get('SENDGRID_FROM_EMAIL')!,
          name: this.configService.get('SENDGRID_FROM_NAME'),
        },
        subject: `Nová provize: ${commissionAmount.toLocaleString('cs-CZ')} Kč`,
        html: html || `
          <h1>Gratulujeme k uzavření obchodu!</h1>
          <p>Dobrý den ${specialistName},</p>
          <p>Váš obchod v hodnotě <strong>${dealValue.toLocaleString('cs-CZ')} Kč</strong> byl úspěšně uzavřen.</p>
          <p>Vaše provize činí: <strong>${commissionAmount.toLocaleString('cs-CZ')} Kč</strong></p>
          <p>Provizi můžete uhradit na platformě do 30 dnů.</p>
          <p><a href="${commissionsUrl}">Zobrazit provize</a></p>
        `,
      });
    } catch (error) {
      console.error('Error sending commission notification email:', error);
    }
  }

  async sendCommissionReceipt(
    email: string,
    specialistName: string,
    commissionAmount: number,
    commissionId: string,
  ): Promise<void> {
    const dashboardUrl = `${this.configService.get('FRONTEND_URL')}/profi/dashboard`;

    const template = this.loadTemplate('commission-receipt');
    const html = this.replaceVariables(template, {
      specialistName,
      commissionAmount: commissionAmount.toLocaleString('cs-CZ'),
      commissionId,
      dashboardUrl,
      date: new Date().toLocaleDateString('cs-CZ'),
    });

    try {
      await sgMail.send({
        to: email,
        from: {
          email: this.configService.get('SENDGRID_FROM_EMAIL')!,
          name: this.configService.get('SENDGRID_FROM_NAME'),
        },
        subject: `Potvrzení platby provize - ${commissionAmount.toLocaleString('cs-CZ')} Kč`,
        html: html || `
          <h1>Potvrzení platby provize</h1>
          <p>Dobrý den ${specialistName},</p>
          <p>Vaše platba provize ve výši <strong>${commissionAmount.toLocaleString('cs-CZ')} Kč</strong> byla úspěšně zpracována.</p>
          <p><strong>ID platby:</strong> ${commissionId}</p>
          <p><strong>Datum:</strong> ${new Date().toLocaleDateString('cs-CZ')}</p>
          <p>Děkujeme za vaši důvěru!</p>
          <p><a href="${dashboardUrl}">Přejít na dashboard</a></p>
        `,
      });
    } catch (error) {
      console.error('Error sending commission receipt email:', error);
    }
  }
}
