import * as Yup from 'yup';
import { SendMailViewFormValues } from '../../Estimates/SendMailViewDrawer/_types';

export const PaymentReceivedSendMailFormSchema = Yup.object().shape({
  subject: Yup.string().required('Subject is required'),
  message: Yup.string().required('Message is required'),
  to: Yup.array()
    .of(Yup.string().email('Invalid email address'))
    .required('To address is required'),
  cc: Yup.array().of(Yup.string().email('Invalid email address')),
  bcc: Yup.array().of(Yup.string().email('Invalid email address')),
});

export interface PaymentReceivedSendMailFormValues
  extends SendMailViewFormValues {
  attachPdf: boolean;
}
