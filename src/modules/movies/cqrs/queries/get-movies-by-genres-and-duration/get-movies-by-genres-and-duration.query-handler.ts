import { QueryHandler } from '@lunar-flight-v/command-module';
import { MovieType } from '@modules/movies/types/movie.type';
import {
  GET_MOVIES_BY_GENRES_AND_DURATION_QUERY,
  GetMoviesByGenresAndDurationQuery,
} from './get-movies-by-genres-and-duration.query';
import { MoviesRepository } from '@modules/movies/domain/movies.repository';
import { GenreNotSupportedError } from '@modules/movies/errors/genre-not-supported.error';
import { Logger } from '@application/logger/logger';
import {
  RequestIdAsyncLocalStorage,
  TRANSACTION_ID_HTTP_HEADER,
} from '@application/server/rest/middlewares/request-id.middleware';

interface Dependencies {
  moviesRepository: MoviesRepository;
  logger: Logger;
  asyncLocalStorage: RequestIdAsyncLocalStorage;
}

export class GetMoviesByGenresAndDurationQueryHandler extends QueryHandler<
  GetMoviesByGenresAndDurationQuery
> {
  constructor(private readonly dependencies: Dependencies) {
    super(GET_MOVIES_BY_GENRES_AND_DURATION_QUERY);
  }

  async handle(command: GetMoviesByGenresAndDurationQuery): Promise<MovieType[]> {
    const { genres, duration } = command.getPayload();
    const { moviesRepository, logger, asyncLocalStorage } = this.dependencies;

    const allowedGeneres = await moviesRepository.getAvailableMovieGenres();

    if (!genres.every((el) => allowedGeneres.includes(el))) {
      throw new GenreNotSupportedError('Genre not supported', 422);
    }

    const movies = await moviesRepository.getMoviesByGenresAndDuration(genres, duration);

    logger.info(
      `[Request TransactionID: ${asyncLocalStorage
        .getStore()
        .get(
          TRANSACTION_ID_HTTP_HEADER,
        )}] Requested movies by genres and duration, number of movies returned ${movies.length}`,
    );

    return movies;
  }
}
