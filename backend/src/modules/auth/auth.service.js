const crypto = require('crypto');
const db = require('../../config/db');
const userModel = require('../users/user.model');
const { hashPassword, comparePassword } = require('../../utils/password');
const { signAccessToken, signRefreshToken } = require('../../config/security');

class AuthService {
  async register({ email, password, name }) {
    // Check if user exists
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      throw Object.assign(new Error('Email already registered'), { status: 409 });
    }

    // Hash password
    const password_hash = await hashPassword(password);

    // Create user
    const user = await userModel.create({
      email,
      password_hash,
      name
    });

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      ...tokens
    };
  }

  async login({ email, password }) {
    // Find user
    const user = await userModel.findByEmail(email);
    if (!user) {
      throw Object.assign(new Error('Invalid credentials'), { status: 401 });
    }

    // Verify password
    const isValid = await comparePassword(password, user.password_hash);
    if (!isValid) {
      throw Object.assign(new Error('Invalid credentials'), { status: 401 });
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      ...tokens
    };
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw Object.assign(new Error('Refresh token required'), { status: 401 });
    }

    // Hash the token for lookup
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    // Find token in database
    const tokenRow = await db('refresh_tokens')
      .where({
        token_hash: tokenHash,
        revoked_at: null
      })
      .where('expires_at', '>', new Date())
      .first();

    if (!tokenRow) {
      throw Object.assign(new Error('Invalid or expired refresh token'), { status: 401 });
    }

    // Get user
    const user = await userModel.findById(tokenRow.user_id);
    if (!user) {
      throw Object.assign(new Error('User not found'), { status: 401 });
    }

    // Generate new access token only
    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email
    });

    return { accessToken };
  }

  async logout(refreshToken) {
    if (!refreshToken) {
      return;
    }

    // Hash the token for lookup
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    // Revoke token
    await db('refresh_tokens')
      .where({ token_hash: tokenHash })
      .update({ revoked_at: new Date() });
  }

  async generateTokens(user) {
    // Create access token
    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email
    });

    // Create refresh token
    const refreshToken = signRefreshToken({
      userId: user.id,
      type: 'refresh'
    });

    // Hash and store refresh token
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

    await db('refresh_tokens').insert({
      user_id: user.id,
      token_hash: tokenHash,
      expires_at: expiresAt,
      created_at: new Date()
    });

    return {
      accessToken,
      refreshToken
    };
  }
}

module.exports = new AuthService();
