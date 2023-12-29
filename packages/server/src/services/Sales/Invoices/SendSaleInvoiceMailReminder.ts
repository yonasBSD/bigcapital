import { Inject, Service } from 'typedi';
import { SendInvoiceMailDTO } from '@/interfaces';
import Mail from '@/lib/Mail';
import { SaleInvoicePdf } from './SaleInvoicePdf';
import { SendSaleInvoiceMailCommon } from './SendInvoiceInvoiceMailCommon';
import {
  DEFAULT_INVOICE_REMINDER_MAIL_CONTENT,
  DEFAULT_INVOICE_REMINDER_MAIL_SUBJECT,
} from './constants';

@Service()
export class SendInvoiceMailReminder {
  @Inject('agenda')
  private agenda: any;

  @Inject()
  private invoicePdf: SaleInvoicePdf;

  @Inject()
  private invoiceCommonMail: SendSaleInvoiceMailCommon;

  /**
   * Triggers the reminder mail of the given sale invoice.
   * @param {number} tenantId
   * @param {number} saleInvoiceId
   */
  public async triggerMail(
    tenantId: number,
    saleInvoiceId: number,
    messageOptions: SendInvoiceMailDTO
  ) {
    const payload = {
      tenantId,
      saleInvoiceId,
      messageOptions,
    };
    await this.agenda.now('sale-invoice-reminder-mail-send', payload);
  }

  /**
   * Retrieves the mail options of the given sale invoice.
   * @param {number} tenantId
   * @param {number} saleInvoiceId
   * @returns {Promise<SaleInvoiceMailOptions>}
   */
  public async getMailOpts(tenantId: number, saleInvoiceId: number) {
    return this.invoiceCommonMail.getMailOpts(
      tenantId,
      saleInvoiceId,
      DEFAULT_INVOICE_REMINDER_MAIL_SUBJECT,
      DEFAULT_INVOICE_REMINDER_MAIL_CONTENT
    );
  }

  /**
   * Triggers the mail invoice.
   * @param {number} tenantId
   * @param {number} saleInvoiceId
   * @param {SendInvoiceMailDTO} messageOptions
   * @returns {Promise<void>}
   */
  public async sendMail(
    tenantId: number,
    saleInvoiceId: number,
    messageOptions: SendInvoiceMailDTO
  ) {
    const localMessageOpts = await this.getMailOpts(tenantId, saleInvoiceId);

    const messageOpts = {
      ...localMessageOpts,
      ...messageOptions,
    };
    const mail = new Mail()
      .setSubject(messageOpts.subject)
      .setTo(messageOpts.to)
      .setContent(messageOpts.body);

    if (messageOpts.attachInvoice) {
      // Retrieves document buffer of the invoice pdf document.
      const invoicePdfBuffer = await this.invoicePdf.saleInvoicePdf(
        tenantId,
        saleInvoiceId
      );
      mail.setAttachments([
        { filename: 'invoice.pdf', content: invoicePdfBuffer },
      ]);
    }
    await mail.send();
  }
}
