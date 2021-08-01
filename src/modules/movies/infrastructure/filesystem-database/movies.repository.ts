import { MoviesRepository } from '@modules/movies/domain/movies.repository';
import { Movie, MovieRecord } from '@modules/movies/types/movie.type';
import { MoviesSchema } from '@modules/movies/types/schema.type';
import { FileSystemDatabase } from '@application/filesystem-database/filesystem-database';

interface Dependencies {
  fileSystemDatabase: FileSystemDatabase;
  fileSystemMoviesPath: string;
}

export class MoviesRepositoryImpl implements MoviesRepository {
  constructor(private readonly dependencies: Dependencies) {}

  public async addMovie(movie: Movie): Promise<MovieRecord> {
    const { fileSystemDatabase, fileSystemMoviesPath } = this.dependencies;

    let data = await fileSystemDatabase.select<MoviesSchema>(fileSystemMoviesPath);

    if (!data) {
      data = MoviesRepositoryImpl.getInitialSchema();
    }

    const record = {
      id: data.movies.length + 1,
      ...movie,
    };

    data.movies.push(record);

    await fileSystemDatabase.update(fileSystemMoviesPath, data);

    return record;
  }

  public async getRandomMovie(): Promise<MovieRecord> {
    const { fileSystemDatabase, fileSystemMoviesPath } = this.dependencies;

    let data = await fileSystemDatabase.select<MoviesSchema>(fileSystemMoviesPath);

    if (!data) {
      data = MoviesRepositoryImpl.getInitialSchema();
    }

    const numberOfMovies = data.movies.length;

    const randomID = MoviesRepositoryImpl.getRandomID(numberOfMovies);

    return data.movies[randomID];
  }

  public async getRandomMovieByDuration(duration: number): Promise<MovieRecord> {
    const { fileSystemDatabase, fileSystemMoviesPath } = this.dependencies;

    let data = await fileSystemDatabase.select<MoviesSchema>(fileSystemMoviesPath);

    if (!data) {
      data = MoviesRepositoryImpl.getInitialSchema();
    }

    const movies = data.movies.filter(
      (movie) => movie.runtime >= duration - 10 && movie.runtime <= duration + 10,
    );

    const numberOfMovies = movies.length;

    const randomID = MoviesRepositoryImpl.getRandomID(numberOfMovies);

    return movies[randomID];
  }

  public async getMoviesByGenres(genres: string[]): Promise<MovieRecord[]> {
    const { fileSystemDatabase, fileSystemMoviesPath } = this.dependencies;

    let data = await fileSystemDatabase.select<MoviesSchema>(fileSystemMoviesPath);

    if (!data) {
      data = MoviesRepositoryImpl.getInitialSchema();
    }

    const cache = new Map();

    data.movies.forEach((movie) => {
      const numberOfHits = movie.genres.filter((el) => genres.includes(el)).length;
      if (numberOfHits !== 0) {
        const current = cache.get(numberOfHits) || [];
        cache.set(numberOfHits, [...current, movie]);
      }
    });

    let result = [];

    genres.forEach((_, idx) => {
      if (!cache.has(idx + 1)) {
        return;
      }

      result = [...cache.get(idx + 1), ...result];
    });

    return result;
  }

  public async getMoviesByGenresAndDuration(
    genres: string[],
    duration: number,
  ): Promise<MovieRecord[]> {
    const { fileSystemDatabase, fileSystemMoviesPath } = this.dependencies;

    let data = await fileSystemDatabase.select<MoviesSchema>(fileSystemMoviesPath);

    if (!data) {
      data = MoviesRepositoryImpl.getInitialSchema();
    }

    const cache = new Map();

    const isWithinDuration = (movie) =>
      movie.runtime >= duration - 10 && movie.runtime <= duration + 10;

    data.movies.forEach((movie) => {
      const numberOfHits = movie.genres.filter((el) => genres.includes(el)).length;

      if (numberOfHits !== 0 && isWithinDuration(movie)) {
        const current = cache.get(numberOfHits) || [];
        cache.set(numberOfHits, [...current, movie]);
      }
    });

    let result = [];

    genres.forEach((_, idx) => {
      if (!cache.has(idx + 1)) {
        return;
      }
      result = [...cache.get(idx + 1), ...result];
    });

    return result;
  }

  public async getAvailableMovieGenres(): Promise<Array<string>> {
    const { fileSystemDatabase, fileSystemMoviesPath } = this.dependencies;

    const data = await fileSystemDatabase.select<MoviesSchema>(fileSystemMoviesPath);

    if (!data) {
      return MoviesRepositoryImpl.getInitialSchema().genres;
    }

    return data.genres;
  }

  private static getInitialSchema(): MoviesSchema {
    return {
      genres: [
        'Comedy',
        'Fantasy',
        'Crime',
        'Drama',
        'Music',
        'Adventure',
        'History',
        'Thriller',
        'Animation',
        'Family',
        'Mystery',
        'Biography',
        'Action',
        'Film-Noir',
        'Romance',
        'Sci-Fi',
        'War',
        'Western',
        'Horror',
        'Musical',
        'Sport',
      ],
      movies: [],
    };
  }

  private static getRandomID(maxValue: number) {
    const max = Math.floor(maxValue);
    return Math.floor(Math.random() * max);
  }
}
