import 'reflect-metadata';
import express, { RequestHandler } from 'express';
import request from 'supertest';
import { ExpressController } from '@application/server/rest/express.controller';
import { DELETE, GET, PATCH, POST, PUT } from '@application/server/rest/decorators/http';

class TestController extends ExpressController {
  constructor() {
    super('/test');
  }

  @GET()
  index(): RequestHandler {
    return (req, res) => {
      res.status(200).json(req.query);
    };
  }

  @GET('/nested')
  index2(): RequestHandler {
    return (req, res) => {
      res.status(201).send();
    };
  }

  @POST()
  index3(): RequestHandler {
    return (req, res) => {
      res.status(202).send();
    };
  }

  @POST('/nested')
  index4(): RequestHandler {
    return (req, res) => {
      res.status(203).send();
    };
  }

  @PUT('')
  index5(): RequestHandler {
    return (req, res) => {
      res.status(204).send();
    };
  }

  @PUT('/nested')
  index6(): RequestHandler {
    return (req, res) => {
      res.status(205).send();
    };
  }

  @PATCH()
  index7(): RequestHandler {
    return (req, res) => {
      res.status(206).send();
    };
  }

  @PATCH('/nested')
  index8(): RequestHandler {
    return (req, res) => {
      res.status(207).send();
    };
  }

  @DELETE('')
  index9(): RequestHandler {
    return (req, res) => {
      res.status(208).send();
    };
  }

  @DELETE('/nested')
  index10(): RequestHandler {
    return (req, res) => {
      res.status(209).send();
    };
  }
}

describe('[Custom Controller] Test Suite', () => {
  const controllerInstance = new TestController();
  const router = controllerInstance.getRouter();
  const app = express();
  app.use(router);

  test('GET /test request get default route', async () => {
    const response = await request(app).get('/test');

    expect(response.status).toEqual(200);
  });

  test('GET /test request get into nested route', async () => {
    const response = await request(app).get('/test/nested');
    expect(response.status).toEqual(201);
  });

  test('POST /test request into default route', async () => {
    const response = await request(app).post('/test');
    expect(response.status).toEqual(202);
  });

  test('POST /test request into nested route', async () => {
    const response = await request(app).post('/test/nested');
    expect(response.status).toEqual(203);
  });

  test('PUT /test request into default route', async () => {
    const response = await request(app).put('/test');
    expect(response.status).toEqual(204);
  });

  test('PUT /test request into nested route', async () => {
    const response = await request(app).put('/test/nested');
    expect(response.status).toEqual(205);
  });

  test('PATCH /test request into default route', async () => {
    const response = await request(app).patch('/test');
    expect(response.status).toEqual(206);
  });

  test('PATCH /test request into nested route', async () => {
    const response = await request(app).patch('/test/nested');
    expect(response.status).toEqual(207);
  });

  test('DELETE /test request into default route', async () => {
    const response = await request(app).delete('/test');
    expect(response.status).toEqual(208);
  });

  test('DELETE /test request into nested route', async () => {
    const response = await request(app).delete('/test/nested');

    expect(response.status).toEqual(209);
  });

  test('GET /test request with params', async () => {
    const response = await request(app).get('/test?id=value').send();

    expect(response.body.id).toEqual('value');
  });
});
