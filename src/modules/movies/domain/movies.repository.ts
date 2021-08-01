import { Movie, MovieType } from '@modules/movies/types/movie.type';

export interface MoviesRepository {
  addMovie(movie: Movie): Promise<MovieType>;

  getAvailableMovieGenres(): Promise<Array<string>>;

  getRandomMovie(): Promise<MovieType>;

  getRandomMovieByDuration(duration: number): Promise<MovieType>;

  getMoviesByGenres(genres: string[]): Promise<MovieType[]>;

  getMoviesByGenresAndDuration(genres: string[], duration: number): Promise<MovieType[]>;
}
