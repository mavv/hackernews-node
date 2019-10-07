const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET, getUserId } = require('../utils');

// TODO: post, updateLink, deleteLink
const signup = async (parent, args, context, info) => {
  const password = await bcrypt.hash(args.password, 10);

  const user = await context.prisma.createUser({ ...args, password });

  const token = jwt.sign(
    {
      userId: user.id,
    },
    APP_SECRET
  );

  return {
    token,
    user,
  };
};

const login = async (parent, args, context, info) => {
  const user = await context.prisma.user({
    email: args.email,
  });

  if (!user) {
    throw new Error('No such user found');
  }

  const valid = await bcrypt.compare(args.password, user.password);

  if (!valid) {
    throw new Error('Invalid password');
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
};

const post = (parent, args, context, info) => {
  const userId = getUserId(context);

  return context.prisma.createLink({
    url: args.url,
    description: args.description,
    postedBy: { connect: { id: userId } },
  });
};

//   // TODO: update resolver to use prisma
//   updateLink: (parent, args) => {
//     const linkToRemove = _.find(links, { id: args.id });
//     const indexOfLink = _.indexOf(links, linkToRemove);
//     const linkKeys = _.keys(_.omit(linkToRemove, ['id']));

//     _.each(linkKeys, k => {
//       if (k in args) {
//         links[indexOfLink][k] = args[k];
//       }
//     });

//     return links[indexOfLink];
//   },
//   // TODO: update resolver to use prisma
//   deleteLink: (parent, args) => {
//     const linkToRemove = _.find(links, { id: args.id });
//     const indexOfLink = _.indexOf(links, linkToRemove);

//     links.splice(indexOfLink, 1);

//     return linkToRemove;
//   },

module.exports = {
  signup,
  login,
  post,
};
