/* eslint-disable @typescript-eslint/no-explicit-any */
import { i18n } from 'src/i18n';

const { t } = i18n.global;

export const requiredField = (val:any) => (val && val.length > 0) || t('validationMsg.required');
export const positiveNumber = (val:any) => (val && val > 0) || t('validationMsg.positiveNumber');
export const requireChars = (chars:number) => (val:any) => (val && val.length >= chars) || t('validationMsg.requireChars', { chars });
