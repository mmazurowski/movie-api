import { Command } from '@lunar-flight-v/command-module';

interface Props {
  genres: string[];
  title: string;
  year: number;
  runtime: number;
  director: string;
  actors?: string;
  plot?: string;
  posterUrl?: string;
}

export const ADD_MOVIE_COMMAND = 'movies/add-movie-command';

export class AddMovieCommand extends Command<Props> {
  constructor(props: Props) {
    super(ADD_MOVIE_COMMAND, props);
  }
}
