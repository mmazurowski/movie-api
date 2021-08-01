import { MovieRecord } from '@modules/movies/types/movie.type';

export interface MoviesSchema {
  genres: string[];
  movies: MovieRecord[];
}
