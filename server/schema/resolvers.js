const { UserList, MovieList } = require('../FakeData');
const _ = require('lodash');

/*

  LEVEL
  query -> users -> favoriteMovies

*/

const resolvers = {
  Query: {
    // USER RESOLVERS
    users: (parent, args, context) => {
      // console.log(context.req.headers);
      if (UserList) return { users: UserList };

      return { message: 'there was an error' };
    },
    user: (parent, args, context, info) => {
      const { id } = args;
      const user = _.find(UserList, { id: Number(id) });
      return user;
    },

    // MOVIE RESOLVERS
    movies: () => {
      return MovieList;
    },
    movie: (parent, args) => {
      const { name } = args;
      const movie = _.find(MovieList, { name });
      return movie;
    },
  },

  User: {
    favoriteMovies: (parent) => {
      console.log(parent); // return users
      return _.filter(
        MovieList,
        (movie) =>
          movie.yearOfPublication >= 2000 && movie.yearOfPublication <= 2010
      );
    },
  },

  Mutation: {
    createUser: (parent, args) => {
      const user = args.input;
      const lastId = UserList[UserList.length - 1].id;
      user.id = lastId + 1;
      UserList.push(user);
      return user;
    },

    updateUsername: (parent, args) => {
      const { id, newUsername } = args.input;
      const user = _.find(UserList, { id: Number(id) });
      user.username = newUsername;
      return user;
    },

    deleteUser: (parent, args) => {
      const { id } = args;
      _.remove(UserList, (user) => user.id === Number(id));
      return null;
    },
  },

  UsersResult: {
    __resolveType(obj) {
      if (obj.users) {
        return 'UsersSuccessfulResult';
      }
      if (obj.message) {
        return 'UsersErrorResult';
      }
      return null;
    },
  },
};

module.exports = { resolvers };
