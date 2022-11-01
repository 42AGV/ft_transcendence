import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export class Password {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buf = (await scryptAsync(password, salt, 32)) as Buffer;
    return salt + '.' + buf.toString('hex');
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [salt, hashedPassword] = storedPassword.split('.');
    const buf = (await scryptAsync(suppliedPassword, salt, 32)) as Buffer;
    return buf.toString('hex') === hashedPassword;
  }
}
