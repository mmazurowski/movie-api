import { RequestHandler } from 'express';
import { addMovieActionValidation } from '@modules/movies/api/rest/add-movie/add-movie.action';
import { ExpressController } from '@application/server/rest/express.controller';
import { GET, POST } from '@application/server/rest/decorators/http';
import { getMovieActionValidation } from '@modules/movies/api/rest/get-movie/get-movie.action';

interface Dependencies {
  addMovieAction: RequestHandler;
  getMovieAction: RequestHandler;
}

export class MoviesController extends ExpressController {
  constructor(private readonly dependencies: Dependencies) {
    super('/v1');
  }

  @POST('/movie')
  addMovie(): RequestHandler[] {
    return [addMovieActionValidation, this.dependencies.addMovieAction];
  }

  @GET('/movie')
  getMovie(): RequestHandler[] {
    return [getMovieActionValidation, this.dependencies.getMovieAction];
  }
}
