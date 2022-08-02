const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
require("jest-sorted");

beforeEach(() => seed(data));
afterAll(() => {
  if (db.end) db.end();
});

describe("ALL - invalid routes", () => {
  test("status 404: responds with appropriate error when incorrect route", () => {
    return request(app)
      .get("/api/toppicks")
      .expect(404)
      .then((response) => {
        expect(response.status).toBe(404);
        expect(response.body.msg).toBe("Invalid route");
      });
  });
});

describe("GET /api/topics", () => {
  test("status:200, responds with an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toBeInstanceOf(Array);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("status 200: should return an article object with correct properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toBeInstanceOf(Object);
        expect(article).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      });
  });
  test("status:400, gives correct error message when given valid but nonexistent article id", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Article does not exist");
      });
  });
  test("status:404, gives correct error message when given invalid article id", () => {
    return request(app)
      .get("/api/articles/fish")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Request");
      });
  });
});
