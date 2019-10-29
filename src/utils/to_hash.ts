import * as bcrypt from 'bcryptjs';

function toHash(pass: string): string {
  return bcrypt.hashSync(pass, 8);
}

export default toHash;
