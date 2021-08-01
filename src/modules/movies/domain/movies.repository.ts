import { Movie, MovieRecord } from '@modules/movies/types/movie.type';

export interface MoviesRepository {
  addMovie(movie: Movie): Promise<MovieRecord>;

  getAvailableMovieGenres(): Promise<Array<string>>;

  getRandomMovie(): Promise<MovieRecord>;

  getRandomMovieByDuration(duration: number): Promise<MovieRecord>;

  getMoviesByGenres(genres: string[]): Promise<MovieRecord[]>;

  getMoviesByGenresAndDuration(genres: string[], duration: number): Promise<MovieRecord[]>;
}
