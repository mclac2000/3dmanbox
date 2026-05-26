import { Resend } from "resend";

const key = process.env.RESEND_API_KEY;
export const resend = key ? new Resend(key) : null;

export const EMAIL_FROM = process.env.EMAIL_FROM || "3D Man Box <hello@3dmanbox.com>";
