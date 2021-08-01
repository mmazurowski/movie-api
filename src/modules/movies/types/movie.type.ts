export interface Movie {
  genres: string[];
  title: string;
  year: number;
  runtime: number;
  director: string;
  actors: string;
  plot: string;
  posterUrl: string;
}

export interface MovieType extends Movie {
  id: number;
}

export interface MovieRecord extends Omit<Movie, 'year' | 'runtime'> {
  id: number;
  year: string;
  runtime: string;
}
