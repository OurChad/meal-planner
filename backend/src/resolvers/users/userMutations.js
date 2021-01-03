const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const { transport, makeANiceEmail } = require('../mail');
const {
  hasPermission
} = require('../utils');

const userMutations = {
    async signup(parent, args, ctx, info) {
        args.email = args.email.toLowerCase();
    
        const password = await bcrypt.hash(args.password, 10);
    
        const user = await ctx.db.mutation.createUser(
          {
            data: {
              ...args,
              password,
              permissions: { set: ['USER'] },
            },
          },
          info.user
        );
    
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    
        return {
          token,
          user
        };
      },

      async signin(parent, { email, password }, ctx, info) {
    
        const user = await ctx.db.query.user({ where: { email } });
        if (!user) {
          throw new Error('Invalid username or password');
        }
        
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
          throw new Error('Invalid username or password');
        }
    
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    
        return {
          token,
          user
        };
      },

      async signout(parent, args, ctx, info) {
        ctx.response.clearCookie('token');
    
        return { message: 'Successfully logged out' };
      },

      async requestReset(parent, args, ctx, info) {
    
        const user = await ctx.db.query.user({ where: { email: args.email } });
        if (!user) {
          throw new Error(`No such user found for email ${args.email}`);
        }
    
        const randomBytesPromiseified = promisify(randomBytes);
        const resetToken = (await randomBytesPromiseified(20)).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
        const res = await ctx.db.mutation.updateUser({
          where: { email: args.email },
          data: { resetToken, resetTokenExpiry },
        });
    
        const mailRes = await transport.sendMail({
          from: 'admin@mpdev-dev.tech',
          to: user.email,
          subject: 'Your Password Reset Token',
          html: makeANiceEmail(`Your Password Reset Token is here!
            \n\n
            <a href="${process.env
        .FRONTEND_URL}/reset?resetToken=${resetToken}">Click Here to Reset</a>`),
        });
        return { message: 'Thanks!' };
      },

      async resetPassword(parent, args, ctx, info) {
        if (args.password !== args.confirmPassword) {
          throw new Error("Yo Passwords don't match!");
        }
    
        const [user] = await ctx.db.query.users({
          where: {
            resetToken: args.resetToken,
            resetTokenExpiry_gte: Date.now() - 3600000,
          },
        });
    
        if (!user) {
          throw new Error('This token is either invalid or expired!');
        }
    
        const password = await bcrypt.hash(args.password, 10);
    
        const updatedUser = await ctx.db.mutation.updateUser({
          where: { email: user.email },
          data: {
            password,
            resetToken: null,
            resetTokenExpiry: null,
          },
        });
        // 6. Generate JWT
        const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
        // 7. Set the JWT cookie
        ctx.response.cookie('token', token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 365,
        });
        // 8. return the new user
        return updatedUser;
      },

      async updatePermissions(parent, args, ctx, info) {
        // 1.if the user exists and has permission
        if (!ctx.request.user) {
          throw new Error('You must be logged in');
        }
    
        hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);
    
        const { permissions } = args;
        const updatedUser = await ctx.db.mutation.updateUser({
          where: { id: args.userId },
          data: {
            permissions: {
              set: permissions
            },
          },
        }, info);
    
        return updatedUser;
      },
}

module.exports = userMutations;