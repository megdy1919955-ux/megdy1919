import { createCipheriv, randomBytes } from 'crypto';

export const ZEGO_DEFAULT_APP_ID = 2138622497;
export const ZEGO_DEFAULT_SECRET = '1b2eeb1e9d219e2b6485b78178c24449';

function makeNonce(): number {
  const min = -Math.pow(2, 31);
  const max = Math.pow(2, 31) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function aesEncrypt(plainText: string, key: string, iv: string): Buffer {
  const cipher = createCipheriv('aes-128-cbc', Buffer.from(key, 'utf8'), Buffer.from(iv, 'utf8'));
  cipher.setAutoPadding(true);
  return Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
}

/**
 * Generate official ZEGOCLOUD Token04
 */
export function generateZegoToken04(
  appId: number,
  userId: string,
  secret: string,
  effectiveTimeInSeconds: number = 86400,
  payload: string = ''
): string {
  if (!appId || typeof appId !== 'number') {
    throw new Error('ZEGOCLOUD appId is invalid');
  }
  if (!userId || typeof userId !== 'string') {
    throw new Error('ZEGOCLOUD userId is invalid');
  }
  if (!secret || typeof secret !== 'string' || secret.length < 16) {
    throw new Error('ZEGOCLOUD secret must be at least 16 bytes');
  }

  // Use exactly 16 bytes of secret for AES-128-CBC encryption key
  const aesKey = secret.substring(0, 16);
  // Generate random 16 bytes IV
  const iv = randomBytes(8).toString('hex'); // 16 chars hex = 16 bytes utf8

  const now = Math.floor(Date.now() / 1000);
  const expire = now + effectiveTimeInSeconds;
  const nonce = makeNonce();

  const tokenInfo = {
    app_id: appId,
    user_id: userId,
    nonce: nonce,
    ctime: now,
    expire: expire,
    payload: payload
  };

  const plainText = JSON.stringify(tokenInfo);
  const encrypted = aesEncrypt(plainText, aesKey, iv);

  // Pack binary:
  // [expire (8 bytes, BE)]
  // [iv length (2 bytes, BE)]
  // [iv (16 bytes)]
  // [content length (2 bytes, BE)]
  // [encrypted content]
  const expireBuf = Buffer.alloc(8);
  expireBuf.writeBigInt64BE(BigInt(expire), 0);

  const ivBuf = Buffer.from(iv, 'utf8');
  const ivLenBuf = Buffer.alloc(2);
  ivLenBuf.writeUInt16BE(ivBuf.length, 0);

  const contentLenBuf = Buffer.alloc(2);
  contentLenBuf.writeUInt16BE(encrypted.length, 0);

  const packedBuffer = Buffer.concat([
    expireBuf,
    ivLenBuf,
    ivBuf,
    contentLenBuf,
    encrypted
  ]);

  return '04' + packedBuffer.toString('base64');
}
