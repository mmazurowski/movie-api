import { Application } from 'express';
import { AwilixContainer } from 'awilix';

import request from 'supertest';
import { testRuntime } from '@system/runtimes/test.runtime';
import * as Awilix from 'awilix';
import { createMockProxy } from '@tools/create-mock-proxy';
import { FileSystemDatabase } from '@application/filesystem-database/filesystem-database';
import { System } from '@lunar-flight-v/system';

const ENDPOINT = '/v1/movie';

describe(`[REST API GET ${ENDPOINT}][MOVIES] - Get movies`, () => {
  const system = new System();
  let container: AwilixContainer;
  let server: Application;
  const fileSystemDbProxy = createMockProxy<FileSystemDatabase>();

  const starWarsMovie = {
    id: 1,
    genres: ['Sci-Fi'],
    title: 'Star Wars',
    year: 1977,
    runtime: 100,
    director: 'George Lucas',
    plot: 'Some plot',
    actors: 'Mark Hamill, Harrison Ford',
    posterUrl: 'https://m.media-amazon.com/images/I/81RZipc6yOL._AC_SL1500_.jpg',
  };

  afterEach(() => {
    fileSystemDbProxy.mockClear();
  });

  beforeAll(async () => {
    container = ((await system.execute(testRuntime)) as unknown) as Awilix.AwilixContainer;
    server = container.resolve<Application>('server');

    // Use mocked service for tests
    container.register('fileSystemDatabase', Awilix.asValue(fileSystemDbProxy));
  });

  test('Should return single random movie', async () => {
    fileSystemDbProxy.select.mockResolvedValue({
      genres: ['Sci-Fi'],
      movies: [starWarsMovie],
    });

    const res = await request(server).get(ENDPOINT).set('Accept', 'application/json');

    expect(res.body).toEqual([starWarsMovie]);
  });

  test('Should return a single random movie that has a runtime between <duration - 10> and <duration + 10>', async () => {
    fileSystemDbProxy.select.mockResolvedValue({
      genres: ['Sci-Fi'],
      movies: [starWarsMovie],
    });

    const lowerRangeRes = await request(server)
      .get(ENDPOINT)
      .query({
        duration: 90,
      })
      .set('Accept', 'application/json');

    const exactRuntimeRes = await request(server)
      .get(ENDPOINT)
      .query({
        duration: 100,
      })
      .set('Accept', 'application/json');

    const upperRange = await request(server)
      .get(ENDPOINT)
      .query({
        duration: 110,
      })
      .set('Accept', 'application/json');

    expect(lowerRangeRes.body).toEqual([starWarsMovie]);
    expect(exactRuntimeRes.body).toEqual([starWarsMovie]);
    expect(upperRange.body).toEqual([starWarsMovie]);
  });

  test('Should return a empty array when there is no movie within duration', async () => {
    fileSystemDbProxy.select.mockResolvedValue({
      genres: ['Sci-Fi'],
      movies: [starWarsMovie],
    });

    const requestAboveRange = await request(server)
      .get(ENDPOINT)
      .query({
        duration: 111,
      })
      .set('Accept', 'application/json');

    const requestBelowRange = await request(server)
      .get(ENDPOINT)
      .query({
        duration: 89,
      })
      .set('Accept', 'application/json');

    expect(requestAboveRange.body).toEqual([]);
    expect(requestBelowRange.body).toEqual([]);
  });

  test('Should return all movies that contain at least one of the specified genres.', async () => {
    const movies = [
      {
        id: 1,
        genres: ['Sci-Fi'],
        title: 'Star Wars',
        year: 1977,
        runtime: 100,
        director: 'George Lucas',
        plot: 'Some plot',
        actors: 'Mark Hamill, Harrison Ford',
        posterUrl: 'https://m.media-amazon.com/images/I/81RZipc6yOL._AC_SL1500_.jpg',
      },
      {
        id: 2,
        genres: ['Drama'],
        title: 'Other movie',
        year: 2011,
        runtime: 200,
        director: 'George Lucas',
        plot: 'Some plot',
        actors: 'Mark Hamill, Harrison Ford',
        posterUrl: 'https://m.media-amazon.com/images/I/81RZipc6yOL._AC_SL1500_.jpg',
      },
      {
        id: 3,
        genres: ['Drama', 'Sci-Fi'],
        title: 'Movie with two genres',
        year: 2021,
        runtime: 120,
        director: 'George Lucas',
        plot: 'Some plot',
        actors: 'Mark Hamill, Harrison Ford',
        posterUrl: 'https://m.media-amazon.com/images/I/81RZipc6yOL._AC_SL1500_.jpg',
      },
    ];

    fileSystemDbProxy.select.mockResolvedValue({
      genres: ['Sci-Fi'],
      movies,
    });

    const res = await request(server)
      .get(ENDPOINT)
      .query({
        'genres[]': ['Drama'],
      })
      .set('Accept', 'application/json');

    expect(res.body.length).toEqual(2);
    expect(res.body).toEqual([movies[1], movies[2]]);
  });

  test('Should return all movies sorted by genres match', async () => {
    const movies = [
      {
        id: 1,
        genres: ['Sci-Fi'],
        title: 'Star Wars',
        year: 1977,
        runtime: 100,
        director: 'George Lucas',
        plot: 'Some plot',
        actors: 'Mark Hamill, Harrison Ford',
        posterUrl: 'https://m.media-amazon.com/images/I/81RZipc6yOL._AC_SL1500_.jpg',
      },
      {
        id: 2,
        genres: ['Drama'],
        title: 'Other movie',
        year: 2011,
        runtime: 200,
        director: 'George Lucas',
        plot: 'Some plot',
        actors: 'Mark Hamill, Harrison Ford',
        posterUrl: 'https://m.media-amazon.com/images/I/81RZipc6yOL._AC_SL1500_.jpg',
      },
      {
        id: 3,
        genres: ['Drama', 'Sci-Fi'],
        title: 'Movie with two genres',
        year: 2021,
        runtime: 120,
        director: 'George Lucas',
        plot: 'Some plot',
        actors: 'Mark Hamill, Harrison Ford',
        posterUrl: 'https://m.media-amazon.com/images/I/81RZipc6yOL._AC_SL1500_.jpg',
      },
      {
        id: 4,
        genres: ['Comedy'],
        title: 'Movie with two genres',
        year: 2021,
        runtime: 120,
        director: 'George Lucas',
        plot: 'Some plot',
        actors: 'Mark Hamill, Harrison Ford',
        posterUrl: 'https://m.media-amazon.com/images/I/81RZipc6yOL._AC_SL1500_.jpg',
      },
    ];

    fileSystemDbProxy.select.mockResolvedValue({
      genres: ['Sci-Fi'],
      movies,
    });

    const res = await request(server)
      .get(ENDPOINT)
      .query({
        'genres[]': ['Drama', 'Sci-Fi'],
      })
      .set('Accept', 'application/json');

    expect(res.body.length).toEqual(3);
    expect(res.body).toEqual([movies[2], movies[0], movies[1]]);
  });

  test('Should return only those movies that contain at least one of the specified genres and have a runtime between <duration - 10> and <duration + 10>.', async () => {
    const movies = [
      {
        id: 1,
        genres: ['Sci-Fi'],
        title: 'Star Wars',
        year: 1977,
        runtime: 150,
        director: 'George Lucas',
        plot: 'Some plot',
        actors: 'Mark Hamill, Harrison Ford',
        posterUrl: 'https://m.media-amazon.com/images/I/81RZipc6yOL._AC_SL1500_.jpg',
      },
      {
        id: 2,
        genres: ['Drama'],
        title: 'Other movie',
        year: 2011,
        runtime: 90,
        director: 'George Lucas',
        plot: 'Some plot',
        actors: 'Mark Hamill, Harrison Ford',
        posterUrl: 'https://m.media-amazon.com/images/I/81RZipc6yOL._AC_SL1500_.jpg',
      },
      {
        id: 3,
        genres: ['Drama', 'Sci-Fi'],
        title: 'Movie with two genres',
        year: 2021,
        runtime: 110,
        director: 'George Lucas',
        plot: 'Some plot',
        actors: 'Mark Hamill, Harrison Ford',
        posterUrl: 'https://m.media-amazon.com/images/I/81RZipc6yOL._AC_SL1500_.jpg',
      },
      {
        id: 4,
        genres: ['Comedy'],
        title: 'Movie with two genres',
        year: 2021,
        runtime: 120,
        director: 'George Lucas',
        plot: 'Some plot',
        actors: 'Mark Hamill, Harrison Ford',
        posterUrl: 'https://m.media-amazon.com/images/I/81RZipc6yOL._AC_SL1500_.jpg',
      },
    ];

    fileSystemDbProxy.select.mockResolvedValue({
      genres: ['Sci-Fi'],
      movies,
    });

    const res = await request(server)
      .get(ENDPOINT)
      .query({
        'genres[]': ['Drama', 'Sci-Fi'],
        duration: 100,
      })
      .set('Accept', 'application/json');

    expect(res.body.length).toEqual(2);
    expect(res.body).toEqual([movies[2], movies[1]]);
  });
});
