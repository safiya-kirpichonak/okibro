import { Hash } from '../src/common/helpers/hash';

describe('api', () => {
  describe('common', () => {
    describe('helpers', () => {
      describe('hash', () => {
        it('correct case with the same password', async () => {
          const password = 'TestPassword1234!';
          const hashedPassword = await Hash.hash(password);
          const isCompare = await Hash.compare(password, hashedPassword);
          expect(isCompare).toBe(true);
        });
        it('correct case with not the same password', async () => {
          const correctPassword = 'TestPassword12345!';
          const incorrectPassword = 'TestPassword1234!';
          const passwordWithSalt = await Hash.hash(correctPassword);
          const isCompare = await Hash.compare(
            incorrectPassword,
            passwordWithSalt,
          );
          expect(isCompare).toBe(false);
        });
      });
    });
  });
});
