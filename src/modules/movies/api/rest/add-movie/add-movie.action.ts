import { RequestHandler } from 'express';
import { CQRSBus } from '@lunar-flight-v/command-module';
import { celebrate, Segments } from 'celebrate';
import Joi from 'joi';
import { AddMovieCommand } from '@modules/movies/cqrs/commands/add-movie/add-movie.command';

/**
 * @swagger
 * /movie:
 *   post:
 *     tags:
 *       - Movies
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              genres:
 *                type: array
 *                items:
 *                  type: string
 *                  example: Sci-Fi
 *              title:
 *                type: string
 *                example: Star Wars
 *              year:
 *                type: number
 *                example: 1977
 *              runtime:
 *                type: number
 *                example: 100
 *              director:
 *                type: string
 *                example: George Lucas
 *              actors:
 *                type: string
 *                example: Mark Hamill
 *                required: false
 *              plot:
 *                type: string;
 *                example: Long long ago in a far away galaxy
 *                required: false
 *              posterUrl:
 *                type: string
 *                example: http:/www.google.com
 *                required: false
 *     responses:
 *       201:
 *         description: Movie created
 *       422:
 *         description: Validation error
 *       500:
 *         description: Internal Server Error
 */

export const addMovieActionValidation = celebrate(
  {
    [Segments.BODY]: {
      genres: Joi.array().items(Joi.string()).required(),
      title: Joi.string().max(255).required(),
      year: Joi.number().required(),
      runtime: Joi.number().required(),
      director: Joi.string().max(255).required(),
      actors: Joi.string().optional(),
      plot: Joi.string().optional(),
      posterUrl: Joi.string().optional().uri(),
    },
  },
  {
    abortEarly: false,
  },
);

interface Dependencies {
  cqrsBus: CQRSBus;
}

const addMovieAction = ({ cqrsBus }: Dependencies): RequestHandler => (req, res, next) =>
  cqrsBus
    .handle(new AddMovieCommand({ ...req.body }))
    .then((output) => res.status(201).json(output))
    .catch(next);

export default addMovieAction;
