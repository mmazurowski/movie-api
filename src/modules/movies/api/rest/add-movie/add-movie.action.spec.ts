import { Application } from 'express';
import * as Awilix from 'awilix';

import request from 'supertest';

import { System } from '@lunar-flight-v/system';
import { testRuntime } from '@system/runtimes/test.runtime';
import { createMockProxy } from '@tools/create-mock-proxy';
import { FileSystemDatabase } from '@application/filesystem-database/filesystem-database';

describe('[REST API][MOVIES] - Add movie', () => {
  const system = new System();
  let container: Awilix.AwilixContainer;
  let server: Application;
  const fileSystemDbProxy = createMockProxy<FileSystemDatabase>();

  beforeAll(async () => {
    container = ((await system.execute(testRuntime)) as unknown) as Awilix.AwilixContainer;
    server = container.resolve<Application>('server');

    // Use mocked service for tests
    container.register('fileSystemDatabase', Awilix.asValue(fileSystemDbProxy));
  });

  beforeEach(async () => {
    fileSystemDbProxy.select.mockResolvedValue({
      genres: ['Sci-Fi'],
      movies: [],
    });
  });

  test('Should throw an error when payload is invalid', async () => {
    const res = await request(server).post('/v1/movie').set('Accept', 'application/json');

    expect(res.status).toEqual(422);
    expect(res.body.details.bodyErrors.map((detail) => detail.key)).toEqual([
      'genres',
      'title',
      'year',
      'runtime',
      'director',
    ]);
  });

  test('Should throw an error when genre is not supported', async () => {
    const res = await request(server)
      .post('/v1/movie')
      .set('Accept', 'application/json')
      .send({
        genres: ['very-strange-one'],
        title: 'Star Wars',
        year: 1977,
        runtime: 99,
        director: 'George Lucas',
      });

    expect(res.status).toEqual(422);
    expect(res.body.name).toEqual('GenreNotSupportedError');
  });

  test('Should throw an error when title to long', async () => {
    const toLongText = Array.from(new Array(256))
      .map(() => 'l')
      .join('');

    const res = await request(server)
      .post('/v1/movie')
      .set('Accept', 'application/json')
      .send({
        genres: ['Sci-Fi'],
        title: toLongText,
        year: 1977,
        runtime: 99,
        director: toLongText,
      });

    expect(res.status).toEqual(422);
    expect(res.body.details.bodyErrors.map((detail) => detail.key)).toEqual(['title', 'director']);
    expect(res.body.details.bodyErrors.map((detail) => detail.message)).toEqual([
      '"title" length must be less than or equal to 255 characters long',
      '"director" length must be less than or equal to 255 characters long',
    ]);
  });

  test('Should create resource with required params', async () => {
    const res = await request(server)
      .post('/v1/movie')
      .set('Accept', 'application/json')
      .send({
        genres: ['Sci-Fi'],
        title: 'Star Wars',
        year: 1977,
        runtime: 99,
        director: 'George Lucas',
      });

    expect(res.status).toEqual(201);
  });

  test('Should create resource with required and optional params', async () => {
    const res = await request(server)
      .post('/v1/movie')
      .set('Accept', 'application/json')
      .send({
        genres: ['Sci-Fi'],
        title: 'Star Wars',
        year: 1977,
        runtime: 99,
        director: 'George Lucas',
        plot: 'Some plot',
        actors: 'Mark Hamill, Harrison Ford',
        posterUrl: 'https://m.media-amazon.com/images/I/81RZipc6yOL._AC_SL1500_.jpg',
      });

    expect(res.status).toEqual(201);
  });
});
