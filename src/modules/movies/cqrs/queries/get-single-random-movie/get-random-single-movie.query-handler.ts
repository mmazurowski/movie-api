import { QueryHandler } from '@lunar-flight-v/command-module';
import {
  GET_RANDOM_SINGLE_MOVIE_QUERY,
  GetRandomSingleMovieQuery,
} from '@modules/movies/cqrs/queries/get-single-random-movie/get-random-single-movie.query';
import { Movie } from '@modules/movies/types/movie.type';
import { MoviesRepository } from '@modules/movies/domain/movies.repository';

interface Dependencies {
  moviesRepository: MoviesRepository;
}

export class GetRandomSingleMovieQueryHandler extends QueryHandler<GetRandomSingleMovieQuery> {
  constructor(private readonly dependencies: Dependencies) {
    super(GET_RANDOM_SINGLE_MOVIE_QUERY);
  }

  public async handle(): Promise<Movie[]> {
    const { moviesRepository } = this.dependencies;

    const movie = await moviesRepository.getRandomMovie();

    return [movie];
  }
}
