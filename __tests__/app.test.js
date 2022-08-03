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

///////////////////////////////////////////

//GLOBAL tests

///////////////////////////////////////////

describe("ALL - invalid routes", () => {
  test("status:404, responds with appropriate error when incorrect route", () => {
    return request(app)
      .get("/api/toppicks")
      .expect(404)
      .then((response) => {
        expect(response.status).toBe(404);
        expect(response.body.msg).toBe("Invalid route");
      });
  });
});

///////////////////////////////////////////

//TOPICS tests

///////////////////////////////////////////

describe("GET /api/topics", () => {
  test("status:200, responds with an array of topics objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toBeInstanceOf(Array);
        expect(topics.length).toBeGreaterThan(0);
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

///////////////////////////////////////////

//ARTICLES tests

///////////////////////////////////////////

describe("GET /api/articles", () => {
  test("status:200, responds with an array of articles objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBeGreaterThan(0);
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
          coerce: true,
        });
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              body: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
        expect(articles[0]).toEqual({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 0,
          comment_count: 2,
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("status:200, should return an article object with correct properties", () => {
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
  test("status:404, gives correct error message when given valid but nonexistent article id", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article does not exist");
      });
  });
  test("status:400, gives correct error message when given invalid article id", () => {
    return request(app)
      .get("/api/articles/fish")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Request");
      });
  });
});

describe("GET /api/articles/:article_id (comment count)", () => {
  test("status:200, should return an article object with comment_count property", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article.comment_count).toEqual(11);
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("status:200, updates correct article and returns updated object, for incrementing vote", () => {
    const articleUpdate1 = {
      inc_votes: 10,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(articleUpdate1)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toBeInstanceOf(Object);
        expect(article.votes).toEqual(110);
      });
  });
  test("status:200, updates correct article and returns updated object, for decrementing vote", () => {
    const articleUpdate = {
      inc_votes: -50,
    };
    return request(app)
      .patch("/api/articles/2")
      .send(articleUpdate)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toBeInstanceOf(Object);
        expect(article.votes).toEqual(-50);
      });
  });
  test("status:400, gives correct error message when given invalid votes increment", () => {
    const articleUpdate = { inc_votes: "fish" };
    return request(app)
      .patch("/api/articles/1")
      .send(articleUpdate)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Request");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("status:200, responds with an array of comments objects", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments.length).toBeGreaterThan(0);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
        });
      });
  });
  test("status:404, responds with correct error when no comments exist for supplied article_id", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Resource not found");
      });
  });
  test("status:400, gives correct error message when given invalid article id", () => {
    return request(app)
      .get("/api/articles/fish")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Request");
      });
  });
});

///////////////////////////////////////////

//USERS tests

///////////////////////////////////////////

describe("GET /api/users", () => {
  test("status:200, responds with an array of users objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toBeInstanceOf(Array);
        expect(users.length).toBeGreaterThan(0);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});
