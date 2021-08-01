import { Query } from '@lunar-flight-v/command-module';

interface Props {
  duration: number;
}

export const GET_RANDOM_SINGLE_MOVIE_BY_DURATION_QUERY =
  'movies/get-random-single-movie-by-duration-query';

export class GetRandomSingleMovieByDurationQuery extends Query<Props> {
  constructor(props: Props) {
    super(GET_RANDOM_SINGLE_MOVIE_BY_DURATION_QUERY, props);
  }
}
