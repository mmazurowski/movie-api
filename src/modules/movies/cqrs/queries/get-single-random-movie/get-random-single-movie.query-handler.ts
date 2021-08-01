import { QueryHandler } from '@lunar-flight-v/command-module';
import {
  GET_RANDOM_SINGLE_MOVIE_QUERY,
  GetRandomSingleMovieQuery,
} from '@modules/movies/cqrs/queries/get-single-random-movie/get-random-single-movie.query';
import { MovieType } from '@modules/movies/types/movie.type';
import { MoviesRepository } from '@modules/movies/domain/movies.repository';
import {
  RequestIdAsyncLocalStorage,
  TRANSACTION_ID_HTTP_HEADER,
} from '@application/server/rest/middlewares/request-id.middleware';
import { Logger } from '@application/logger/logger';

interface Dependencies {
  moviesRepository: MoviesRepository;
  logger: Logger;
  asyncLocalStorage: RequestIdAsyncLocalStorage;
}

export class GetRandomSingleMovieQueryHandler extends QueryHandler<GetRandomSingleMovieQuery> {
  constructor(private readonly dependencies: Dependencies) {
    super(GET_RANDOM_SINGLE_MOVIE_QUERY);
  }

  public async handle(): Promise<MovieType[]> {
    const { moviesRepository, asyncLocalStorage, logger } = this.dependencies;

    const movie = await moviesRepository.getRandomMovie();

    logger.info(
      `[Request TransactionID: ${asyncLocalStorage
        .getStore()
        .get(TRANSACTION_ID_HTTP_HEADER)}] Requested random movie, returned movie: "${
        movie.title
      }"`,
    );

    return [movie];
  }
}
