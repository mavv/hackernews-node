const { GraphQLServer } = require('graphql-yoga');
const _ = require('lodash');
const { prisma } = require('./generated/prisma-client');

const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const User = require('./resolvers/User');
const Link = require('./resolvers/Link');

const resolvers = {
  Query,
  Mutation,
  User,
  Link,
  // Query: {
  //   info: () => `This is the API of a Hackernews Clone`,
  //   feed: () => (root, args, context, info) => {
  //     console.log(context.prisma.links());
  //     return context.prisma.links();
  //   },
  //   link: (parent, args) => _.find(links, { id: args.id }),
  // },
  // Mutation: {
  //   post: (parent, args, context) => {
  //     return context.prisma.createLink({
  //       url: args.url,
  //       description: args.description,
  //     });
  //   },
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
  // },
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: request => {
    return {
      ...request,
      prisma,
    };
  },
});

server.start(() => console.log(`Server is running on http://localhost:4000`));
