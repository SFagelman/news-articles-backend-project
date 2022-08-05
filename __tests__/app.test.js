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

describe("GET /api/articles (queries)", () => {
  test("status:200, should return array of articles objects with correct properties", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBeGreaterThan(0);
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
      });
  });
  test("status:200, responds with array of articles objects, sorted by specified column", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBeGreaterThan(0);
        expect(articles).toBeSortedBy("title", {
          descending: true,
        });
        expect(articles[0]).toEqual({
          article_id: 7,
          title: "Z",
          topic: "mitch",
          author: "icellusedkars",
          body: "I was hungry.",
          created_at: expect.any(String),
          votes: 0,
          comment_count: 0,
        });
      });
  });
  test("status:200, responds with array of articles objects, sorted by specified column", () => {
    return request(app)
      .get("/api/articles?sort_by=body")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBeGreaterThan(0);
        expect(articles).toBeSortedBy("body", {
          descending: true,
          coerce: true,
        });
        expect(articles[0]).toEqual({
          article_id: 10,
          title: "Seven inspirational thought leaders from Manchester UK",
          topic: "mitch",
          author: "rogersop",
          body: "Who are we kidding, there is only one, and it's Mitch!",
          created_at: expect.any(String),
          votes: 0,
          comment_count: 0,
        });
      });
  });
  test("status:200, responds with array of articles objects, sorted by default created_at, in specified order", () => {
    return request(app)
      .get("/api/articles?order=ASC")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBeGreaterThan(0);
        expect(articles).toBeSortedBy("created_at", {
          descending: false,
          coerce: true,
        });
        expect(articles[0]).toEqual({
          article_id: 7,
          title: "Z",
          topic: "mitch",
          author: "icellusedkars",
          body: "I was hungry.",
          created_at: expect.any(String),
          votes: 0,
          comment_count: 0,
        });
      });
  });
  test("status:200, responds with array of articles objects, filtered by specified topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toEqual(1);
        expect(articles[0]).toEqual({
          article_id: 5,
          title: "UNCOVERED: catspiracy to bring down democracy",
          topic: "cats",
          author: "rogersop",
          body: "Bastet walks amongst us, and the cats are taking arms!",
          created_at: expect.any(String),
          votes: 0,
          comment_count: 2,
        });
      });
  });
  test("status:200, responds with array of articles objects, sorted by specified column, in specified order, filtered by specified topic", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=ASC&topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBeGreaterThan(0);
        expect(articles).toBeSortedBy("title", {
          descending: false,
          coerce: true,
        });
        expect(articles[0]).toEqual({
          article_id: 6,
          title: "A",
          topic: "mitch",
          author: "icellusedkars",
          body: "Delicious tin of cat food",
          created_at: expect.any(String),
          votes: 0,
          comment_count: 1,
        });
      });
  });

  test("status:400, gives correct error when query is invalid sort_by", () => {
    return request(app)
      .get("/api/articles?sort_by=fish")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("status:400, gives correct error when query is invalid order", () => {
    return request(app)
      .get("/api/articles?order=fish")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("status:400, gives correct error when query is invalid filter topic", () => {
    return request(app)
      .get("/api/articles?topic=fish")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("topic not found");
      });
  });
  test("status:400, gives correct error when sort query is mis-spelled", () => {
    return request(app)
      .get("/api/articles?sortby=title")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("status:400, gives correct error when order query is mis-spelled", () => {
    return request(app)
      .get("/api/articles?orde=ASC")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("status:400, gives correct error when filter query is mis-spelled", () => {
    return request(app)
      .get("/api/articles?topi=mitch")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
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
        expect(response.body.msg).toBe("article_id not found");
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

  test("status:404, gives correct error message when given valid but nonexistent article id", () => {
    const articleUpdate = {
      inc_votes: -50,
    };
    return request(app)
      .patch("/api/articles/9999")
      .send(articleUpdate)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article_id not found");
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

  test("status:200, responds with empty array when no comments exist for supplied article_id", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments.length).toEqual(0);
        expect(comments).toEqual([]);
      });
  });

  test("status:404, gives correct error message when given valid but nonexistent article id", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article_id not found");
      });
  });

  test("status:400, gives correct error message when given invalid article id", () => {
    return request(app)
      .get("/api/articles/fish/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("status:201, adds new comment and returns added comment", () => {
    const commentUpdate = {
      username: "butter_bridge",
      body: "This is a test comment. Please ignore",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(commentUpdate)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toEqual({
          comment_id: 19,
          body: "This is a test comment. Please ignore",
          article_id: 1,
          author: "butter_bridge",
          created_at: expect.any(String),
          votes: 0,
        });
      });
  });
  test("status:400, gives correct error message when given invalid article id", () => {
    const commentUpdate = {
      username: "butter_bridge",
      body: "This is a test comment. Please ignore",
    };
    return request(app)
      .post("/api/articles/fish/comments")
      .send(commentUpdate)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Request");
      });
  });
  test("status:404, gives correct error message when given valid but nonexistent article id", () => {
    const commentUpdate = {
      username: "butter_bridge",
      body: "This is a test comment. Please ignore",
    };
    return request(app)
      .post("/api/articles/9999/comments")
      .send(commentUpdate)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article_id not found");
      });
  });
  test("status:400, gives correct error when body passed does not contain correct properties", () => {
    const commentUpdate = {
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(commentUpdate)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid post body keys");
      });
  });
  test("status:400, gives correct error when body passed contains mis-spelled properties", () => {
    const commentUpdate = {
      userame: "butter_bridge",
      body: "test comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(commentUpdate)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid post body keys");
      });
  });
  test("status:400, gives correct error when body passed does not contain correct properties", () => {
    const commentUpdate = {
      username: "butter_bridge",
      body: 5,
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(commentUpdate)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid post body values");
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
