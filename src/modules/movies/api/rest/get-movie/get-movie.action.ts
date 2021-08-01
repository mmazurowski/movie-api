import { RequestHandler } from 'express';
import { CQRSBus } from '@lunar-flight-v/command-module';
import { GetRandomSingleMovieQuery } from '../../../cqrs/queries/get-single-random-movie/get-random-single-movie.query';
import { GetRandomSingleMovieByDurationQuery } from '@modules/movies/cqrs/queries/get-single-random-movie-by-duration/get-random-single-movie-by-duration.query';
import { GetMoviesByGenresQuery } from '@modules/movies/cqrs/queries/get-random-movies-by-genres/get-movies-by-genres.query';
import { celebrate, Segments } from 'celebrate';
import Joi from 'joi';
import { GetMoviesByGenresAndDurationQuery } from '@modules/movies/cqrs/queries/get-movies-by-genres-and-duration/get-movies-by-genres-and-duration.query';

/**
 * @swagger
 * /movie:
 *   get:
 *     tags:
 *       - Movies
 *     parameters:
 *       - in: query
 *         name: duration
 *         description: Movie duration
 *         schema:
 *           type: integer
 *       - in: query
 *         name: genres
 *         description: One of supported movie genres
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             example: Sci-Fi
 *     responses:
 *       200:
 *         description: Returns Movies
 *       422:
 *         description: Validation error
 *       400:
 *         description: Business rule validation error
 *       500:
 *         description: Internal Server Error
 */

export const getMovieActionValidation = celebrate({
  [Segments.QUERY]: {
    duration: Joi.number().optional(),
    genres: Joi.array().optional(),
  },
});

interface Dependencies {
  cqrsBus: CQRSBus;
}

const getMovieAction = ({ cqrsBus }: Dependencies): RequestHandler => (req, res, next) => {
  if (!req.query.duration && !req.query.genres) {
    cqrsBus
      .handle(new GetRandomSingleMovieQuery())
      .then((output) => res.json(output))
      .catch(next);
  }

  if (req.query.duration && !req.query.genres) {
    cqrsBus
      .handle(new GetRandomSingleMovieByDurationQuery({ duration: Number(req.query.duration) }))
      .then((output) => res.json(output))
      .catch(next);
  }

  if (!req.query.duration && req.query.genres) {
    cqrsBus
      .handle(new GetMoviesByGenresQuery({ genres: req.query.genres as string[] }))
      .then((output) => res.json(output))
      .catch(next);
  }

  if (req.query.duration && req.query.genres) {
    cqrsBus
      .handle(
        new GetMoviesByGenresAndDurationQuery({
          genres: req.query.genres as [],
          duration: Number(req.query.duration),
        }),
      )
      .then((output) => res.json(output))
      .catch(next);
  }
};

export default getMovieAction;
