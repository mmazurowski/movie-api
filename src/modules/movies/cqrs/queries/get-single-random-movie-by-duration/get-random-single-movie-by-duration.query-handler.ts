import { QueryHandler } from '@lunar-flight-v/command-module';
import { MovieType } from '@modules/movies/types/movie.type';
import {
  GET_RANDOM_SINGLE_MOVIE_BY_DURATION_QUERY,
  GetRandomSingleMovieByDurationQuery,
} from '@modules/movies/cqrs/queries/get-single-random-movie-by-duration/get-random-single-movie-by-duration.query';
import { MoviesRepository } from '@modules/movies/domain/movies.repository';
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

export class GetRandomSingleMovieByDurationQueryHandler extends QueryHandler<
  GetRandomSingleMovieByDurationQuery
> {
  constructor(private readonly dependencies: Dependencies) {
    super(GET_RANDOM_SINGLE_MOVIE_BY_DURATION_QUERY);
  }

  async handle(command: GetRandomSingleMovieByDurationQuery): Promise<MovieType[]> {
    const { duration } = command.getPayload();
    const { moviesRepository, logger, asyncLocalStorage } = this.dependencies;

    const movie = await moviesRepository.getRandomMovieByDuration(duration);

    const output = movie ? [movie] : [];

    logger.info(
      `[Request TransactionID: ${asyncLocalStorage
        .getStore()
        .get(
          TRANSACTION_ID_HTTP_HEADER,
        )}] Requested single movie by duration, returned: "${output.map((el) => el.title)}"`,
    );

    return output;
  }
}
