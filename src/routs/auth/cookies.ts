import sha256 from 'crypto-js/sha256';
import cookie from '@fastify/cookie';

require('dotenv').config();

function encodeObject(obj: any) {
  return sha256(JSON.stringify(obj));
}

export const COOKI_NAME = 'vm_device_id';

async function decodeObject(token: string) {}

export const encodeDeviceId = (data: {
  ip: string;
  userAgent: string | null;
}) => {
  return encodeObject(data).toString();
};

export const createDeviceIdCookie = (deviceId: string) => {
  return cookie.serialize(COOKI_NAME, deviceId, {
    maxAge: Number(process.env.MAX_AGE_COOKIE_SECONDS),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV !== 'development' ? true : false,
  });
};
