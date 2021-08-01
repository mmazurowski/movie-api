import { QueryHandler } from '@lunar-flight-v/command-module';
import { Movie } from '@modules/movies/types/movie.type';
import { GET_MOVIES_BY_GENRES_QUERY, GetMoviesByGenresQuery } from './get-movies-by-genres.query';
import { MoviesRepository } from '@modules/movies/domain/movies.repository';

interface Dependencies {
  moviesRepository: MoviesRepository;
}

export class GetMoviesByGenresQueryHandler extends QueryHandler<GetMoviesByGenresQuery> {
  constructor(private readonly dependencies: Dependencies) {
    super(GET_MOVIES_BY_GENRES_QUERY);
  }

  async handle(command: GetMoviesByGenresQuery): Promise<Movie[]> {
    const { genres } = command.getPayload();
    const { moviesRepository } = this.dependencies;

    // check if genres are supported

    return moviesRepository.getMoviesByGenres(genres);
  }
}
