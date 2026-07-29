import GmailToken from '../models/GmailToken.js';
import { encrypt, decrypt } from '../utils/encryption.js';

export class GmailTokenRepository {
  /**
   * Saves or updates a user's Gmail OAuth tokens in MongoDB.
   * @param {string} userId 
   * @param {{ email: string, accessToken: string, refreshToken: string, expiresAt: Date }} tokenData 
   */
  async saveTokens(userId, tokenData) {
    const { email, accessToken, refreshToken, expiresAt } = tokenData;

    const query = userId ? { userId } : { email };
    const update = {
      email,
      accessToken: encrypt(accessToken),
      ...(refreshToken && { refreshToken: encrypt(refreshToken) }),
      expiresAt,
      ...(userId && { userId })
    };

    const options = { new: true, upsert: true };

    try {
      const doc = await GmailToken.findOneAndUpdate(query, update, options);
      return {
        ...doc.toObject(),
        accessToken: decrypt(doc.accessToken),
        refreshToken: decrypt(doc.refreshToken)
      };
    } catch (err) {
      console.warn('[GmailTokenRepository] Database save failed:', err.message);
      return {
        userId,
        email,
        accessToken,
        refreshToken,
        expiresAt
      };
    }
  }

  /**
   * Finds Gmail OAuth tokens by User ID or Email.
   * @param {string} userId 
   * @param {string} [email] 
   */
  async findTokens(userId, email) {
    const query = userId ? { userId } : { email };
    try {
      const doc = await GmailToken.findOne(query);
      if (!doc) return null;

      const obj = doc.toObject();
      return {
        ...obj,
        accessToken: decrypt(obj.accessToken),
        refreshToken: decrypt(obj.refreshToken)
      };
    } catch (err) {
      console.warn('[GmailTokenRepository] Database query error:', err.message);
      return null;
    }
  }

  /**
   * Deletes Gmail OAuth token for a user.
   * @param {string} userId 
   * @param {string} [email] 
   */
  async deleteTokens(userId, email) {
    const query = userId ? { userId } : { email };
    try {
      await GmailToken.deleteMany(query);
      return true;
    } catch (err) {
      console.warn('[GmailTokenRepository] Database delete error:', err.message);
      return false;
    }
  }
}

export const gmailTokenRepository = new GmailTokenRepository();
export default gmailTokenRepository;
