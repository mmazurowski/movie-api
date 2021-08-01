import { QueryHandler } from '@lunar-flight-v/command-module';
import { Movie } from '@modules/movies/types/movie.type';
import {
  GET_MOVIES_BY_GENRES_AND_DURATION_QUERY,
  GetMoviesByGenresAndDurationQuery,
} from './get-movies-by-genres-and-duration.query';
import { MoviesRepository } from '@modules/movies/domain/movies.repository';
import { GenreNotSupportedError } from '@modules/movies/errors/genre-not-supported.error';

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

    const allowedGeneres = await moviesRepository.getAvailableMovieGenres();

    if (!genres.every((el) => allowedGeneres.includes(el))) {
      throw new GenreNotSupportedError('Genre not supported', 422);
    }

    return moviesRepository.getMoviesByGenresAndDuration(genres, duration);
  }
}
