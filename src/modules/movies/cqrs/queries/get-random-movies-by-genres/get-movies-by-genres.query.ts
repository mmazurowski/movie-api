import { Query } from '@lunar-flight-v/command-module';

interface Props {
  genres: string[];
}

export const GET_MOVIES_BY_GENRES_QUERY = 'movies/get-random-single-movie-by-genres-query';

export class GetMoviesByGenresQuery extends Query<Props> {
  constructor(props: Props) {
    super(GET_MOVIES_BY_GENRES_QUERY, props);
  }
}
