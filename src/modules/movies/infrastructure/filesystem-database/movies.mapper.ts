import { MovieRecord, MovieType } from '@modules/movies/types/movie.type';

export class MoviesMapper {
  public static toEntity(record: MovieRecord): MovieType {
    return {
      ...record,
      year: Number(record.year),
      runtime: Number(record.runtime),
    };
  }
}
