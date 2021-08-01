import { Query } from '@lunar-flight-v/command-module';

export const GET_RANDOM_SINGLE_MOVIE_QUERY = 'movies/get-random-single-movie-query';

export class GetRandomSingleMovieQuery extends Query<{}> {
  constructor() {
    super(GET_RANDOM_SINGLE_MOVIE_QUERY, {});
  }
}
