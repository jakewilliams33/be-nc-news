const app = require("../app");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(data);
});

afterAll(() => db.end());


describe("GET /api/topics", () => {
  test("Responds with an array of topic objects, each of which should have 'slug' and 'description' properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        expect(Array.isArray(res.body.topics)).toBe(true)
        expect(res.body.topics.length>1).toBe(true)
        res.body.topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String)
            })
          );
        });
      });
  });
});

describe("ALL /api/*", () => {
  test("responds with error 404 when passed a route that does not exist", () => {
    return request(app)
    .get("/api/jake")
    .expect(404)
    .then((res) => {
      expect(res.body.msg).toBe('Not Found');
    })
  });
})

describe("GET /api/articles/:article_id", () => {
  test(`responds with an article object, which should have the following properties: 
  'author' which is the 'username' from the users table
   title
   article_id
   body
   topic
   created_at
   votes
`, () => {
  return request(app)
  .get("/api/articles/1")
  .expect(200)
  .then((res) => {
    expect(res.body.article).toEqual({
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: expect.any(String),
      votes: 100,
    });
  })
})
}); 

describe("GET /api/articles/invalid ID", () => {
test("status:400, responds with an error message when passed a bad ID", () => {
  return request(app)
    .get("/api/articles/abcd")
    .expect(400)
    .then((res) => {
      expect(res.body.msg).toBe("Invalid input");
    });
});
 test("status:404, responds with an error message when passed an id that doesn't belong to an article", () => {
   return request(app)
     .get("/api/articles/11111111")
     .expect(404)
     .then((res) => {
      console.log(Object.keys(res))
       expect(res.body.msg).toBe("No article found by that ID");
     });
 });
})