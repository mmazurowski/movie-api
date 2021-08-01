import { QueryHandler } from '@lunar-flight-v/command-module';
import { Movie } from '@modules/movies/types/movie.type';
import {
  GET_MOVIES_BY_GENRES_AND_DURATION_QUERY,
  GetMoviesByGenresAndDurationQuery,
} from './get-movies-by-genres-and-duration.query';
import { MoviesRepository } from '@modules/movies/domain/movies.repository';

interface Dependencies {
  moviesRepository: MoviesRepository;
}

export class GetMoviesByGenresAndDurationQueryHandler extends QueryHandler<
  GetMoviesByGenresAndDurationQuery
> {
  constructor(private readonly dependencies: Dependencies) {
    super(GET_MOVIES_BY_GENRES_AND_DURATION_QUERY);
  }

  async handle(command: GetMoviesByGenresAndDurationQuery): Promise<Movie[]> {
    const { genres, duration } = command.getPayload();
    const { moviesRepository } = this.dependencies;

    // check if genres are supported

    return moviesRepository.getMoviesByGenresAndDuration(genres, duration);
  }
}
