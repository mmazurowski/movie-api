import { QueryHandler } from '@lunar-flight-v/command-module';
import { Movie } from '@modules/movies/types/movie.type';
import {
  GET_RANDOM_SINGLE_MOVIE_BY_DURATION_QUERY,
  GetRandomSingleMovieByDurationQuery,
} from '@modules/movies/cqrs/queries/get-single-random-movie-by-duration/get-random-single-movie-by-duration.query';
import { MoviesRepository } from '@modules/movies/domain/movies.repository';

interface Dependencies {
  moviesRepository: MoviesRepository;
}

export class GetRandomSingleMovieByDurationQueryHandler extends QueryHandler<
  GetRandomSingleMovieByDurationQuery
> {
  constructor(private readonly dependencies: Dependencies) {
    super(GET_RANDOM_SINGLE_MOVIE_BY_DURATION_QUERY);
  }

  async handle(command: GetRandomSingleMovieByDurationQuery): Promise<Movie[]> {
    const { duration } = command.getPayload();
    const { moviesRepository } = this.dependencies;

    const movie = await moviesRepository.getRandomMovieByDuration(duration);

    return movie ? [movie] : [];
  }
}
