import { createCipheriv, randomBytes } from 'crypto';

export const ZEGO_DEFAULT_APP_ID = 2138622497;
export const ZEGO_DEFAULT_SECRET = '7dbdc499be61213a91940a115dc3869a071a27856c648ff7297377ffa1ad8a23';

function makeNonce(): number {
  const min = -Math.pow(2, 31);
  const max = Math.pow(2, 31) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function aesGcmEncrypt(plainText: string, keyBuf: Buffer): { encryptBuf: Buffer; nonce: Buffer } {
  const nonce = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', keyBuf, nonce);
  cipher.setAutoPadding(true);
  const encrypted = cipher.update(plainText, 'utf8');
  const encryptBuf = Buffer.concat([encrypted, cipher.final(), cipher.getAuthTag()]);
  return { encryptBuf, nonce };
}

/**
 * Official ZEGOCLOUD Token04 generation implementation for WebRTC and Voice Rooms.
 */
export function generateZegoToken04(
  appId: number,
  userId: string,
  secret: string,
  effectiveTimeInSeconds: number = 86400,
  payload?: string
): string {
  if (!appId || typeof appId !== 'number') {
    throw new Error('Invalid ZEGOCLOUD AppID');
  }
  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid ZEGOCLOUD UserID');
  }

  // 64-char hex string is 32 bytes in binary
  let keyBuf: Buffer;
  if (secret.length === 64) {
    keyBuf = Buffer.from(secret, 'hex');
  } else if (secret.length === 32) {
    keyBuf = Buffer.from(secret, 'utf8');
  } else {
    throw new Error('ZEGOCLOUD secret must be 32 bytes (or 64 hex characters)');
  }

  const VERSION_FLAG = '04';
  const createTime = Math.floor(Date.now() / 1000);
  const tokenInfo = {
    app_id: appId,
    user_id: userId,
    nonce: makeNonce(),
    ctime: createTime,
    expire: createTime + effectiveTimeInSeconds,
    payload: payload || ''
  };

  const plainText = JSON.stringify(tokenInfo);
  const { encryptBuf, nonce } = aesGcmEncrypt(plainText, keyBuf);

  const b1 = Buffer.alloc(8);
  b1.writeBigInt64BE(BigInt(tokenInfo.expire), 0);

  const b2 = Buffer.alloc(2);
  b2.writeUInt16BE(nonce.byteLength, 0);

  const b3 = Buffer.alloc(2);
  b3.writeUInt16BE(encryptBuf.byteLength, 0);

  const b4 = Buffer.alloc(1);
  b4.writeUInt8(1, 0); // 1 = GCM encryption mode

  const combined = Buffer.concat([b1, b2, nonce, b3, encryptBuf, b4]);
  return VERSION_FLAG + combined.toString('base64');
}
