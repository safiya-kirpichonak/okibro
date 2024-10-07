import * as crypto from 'node:crypto';

export const Hash = {
  hash: (string: string): Promise<string> =>
    new Promise((resolve, reject) => {
      const salt = crypto.randomBytes(16).toString('base64');
      crypto.scrypt(string, salt, 64, (error, hashedString) => {
        if (error) reject(error);
        resolve(`${salt}:${hashedString.toString('base64')}`);
      });
    }),
  compare: (string: string, stringWithSalt: string): Promise<boolean> =>
    new Promise((resolve, reject) => {
      const [salt, hashedString] = stringWithSalt.split(':');
      crypto.scrypt(string, salt, 64, (error, enteredHashedString) => {
        if (error) reject(error);
        resolve(hashedString === enteredHashedString.toString('base64'));
      });
    }),
  generateRandomBytes: (length: number): Promise<string> =>
    new Promise((resolve, reject) => {
      crypto.randomBytes(length / 2, (error, buffer) => {
        if (error) reject(error);
        resolve(buffer.toString('hex'));
      });
    }),
};
