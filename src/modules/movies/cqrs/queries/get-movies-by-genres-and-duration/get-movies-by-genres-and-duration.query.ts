import { Query } from '@lunar-flight-v/command-module';

interface Props {
  genres: string[];
  duration: number;
}

export const GET_MOVIES_BY_GENRES_AND_DURATION_QUERY = 'movies/get-movies-by-genres-and-duration';

export class GetMoviesByGenresAndDurationQuery extends Query<Props> {
  constructor(props: Props) {
    super(GET_MOVIES_BY_GENRES_AND_DURATION_QUERY, props);
  }
}
