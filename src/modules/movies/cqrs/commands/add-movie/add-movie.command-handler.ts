import { CommandHandler } from '@lunar-flight-v/command-module';
import {
  ADD_MOVIE_COMMAND,
  AddMovieCommand,
} from '@modules/movies/cqrs/commands/add-movie/add-movie.command';
import { MoviesRepository } from '@modules/movies/domain/movies.repository';
import { GenreNotSupportedError } from '@modules/movies/errors/genre-not-supported.error';
import { MovieType } from '@modules/movies/types/movie.type';
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

export class AddMovieCommandHandler extends CommandHandler<AddMovieCommand> {
  constructor(private readonly dependencies: Dependencies) {
    super(ADD_MOVIE_COMMAND);
  }

  public async handle(handleable: AddMovieCommand): Promise<MovieType> {
    const { moviesRepository, logger, asyncLocalStorage } = this.dependencies;

    const { actors, plot, posterUrl, genres, ...rest } = handleable.getPayload();

    const allowedGeneres = await moviesRepository.getAvailableMovieGenres();

    // Usually here resides Aggregate Root to protect business rules and dispatch domain events
    if (!genres.every((el) => allowedGeneres.includes(el))) {
      throw new GenreNotSupportedError('Genre not supported', 422);
    }

    const movie = await moviesRepository.addMovie({
      ...rest,
      genres,
      actors: actors || '',
      plot: plot || '',
      posterUrl: posterUrl || '',
    });

    logger.info(
      `[Request TransactionID: ${asyncLocalStorage
        .getStore()
        .get(TRANSACTION_ID_HTTP_HEADER)}] Created movie ${movie.title}`,
    );

    return movie;
  }
}
