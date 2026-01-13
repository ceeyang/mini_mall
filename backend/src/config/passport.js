/**
 * Passport 配置
 * 配置 Google OAuth 策略
 */

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { googleOAuthConfig } from './auth.js';
import User from '../models/User.js';

// 仅在配置了 Google OAuth 时初始化策略
if (googleOAuthConfig.clientID && googleOAuthConfig.clientSecret) {
  // 配置 Google OAuth 策略
  passport.use(new GoogleStrategy({
    clientID: googleOAuthConfig.clientID,
    clientSecret: googleOAuthConfig.clientSecret,
    callbackURL: googleOAuthConfig.callbackURL
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // 查找或创建用户
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        // 用户已存在，更新信息
        user.avatar = profile.photos[0]?.value;
        await user.save();
        return done(null, user);
      }

      // 检查邮箱是否已被注册
      user = await User.findOne({ email: profile.emails[0].value });
      if (user) {
        // 如果邮箱已注册，关联 Google ID
        user.googleId = profile.id;
        user.avatar = profile.photos[0]?.value;
        await user.save();
        return done(null, user);
      }

      // 创建新用户
      user = new User({
        name: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
        avatar: profile.photos[0]?.value
      });

      await user.save();
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));

  // 序列化用户（用于 session，这里不使用 session，但 Passport 需要）
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
}
