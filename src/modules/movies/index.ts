import * as Awilix from 'awilix';
import { ApplicationModule } from '@root/application/application-module.type';
import { AddMovieCommandHandler } from '@modules/movies/cqrs/commands/add-movie/add-movie.command-handler';
import { MoviesController } from '@modules/movies/api/rest/movies.controller';
import { GetRandomSingleMovieQueryHandler } from '@modules/movies/cqrs/queries/get-single-random-movie/get-random-single-movie.query-handler';
import { GetRandomSingleMovieByDurationQueryHandler } from '@modules/movies/cqrs/queries/get-single-random-movie-by-duration/get-random-single-movie-by-duration.query-handler';
import { MoviesRepositoryImpl } from '@modules/movies/infrastructure/filesystem-database/movies.repository';
import { GetMoviesByGenresQueryHandler } from '@modules/movies/cqrs/queries/get-random-movies-by-genres/get-movies-by-genres.query-handler';
import { GetMoviesByGenresAndDurationQueryHandler } from '@modules/movies/cqrs/queries/get-movies-by-genres-and-duration/get-movies-by-genres-and-duration.query-handler';

const appModule: ApplicationModule = {
  controllers: [MoviesController],
  commandHandlers: [AddMovieCommandHandler],
  queryHandlers: [
    GetRandomSingleMovieQueryHandler,
    GetRandomSingleMovieByDurationQueryHandler,
    GetMoviesByGenresQueryHandler,
    GetMoviesByGenresAndDurationQueryHandler,
  ],
  repositories: { moviesRepository: Awilix.asClass(MoviesRepositoryImpl).singleton() },
  readModels: {},
  servicesImplementations: {},
};

export default appModule;
