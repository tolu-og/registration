const request = require("supertest");
const createApp = require("./server"); 

describe("Registration API", () => {
    let app;
  
    beforeAll(() => {
      app = createApp();
    });
  
    it("should respond with 200 OK for GET /", async () => {
      const response = await request(app).get("/");
      expect(response.statusCode).toBe(200);
      expect(response.text).toContain("<!DOCTYPE html>");
    });
    
    it("should respond with 404 for non-existent routes", async () => {
        const response = await request(app).get("/non-existent-route");
        expect(response.statusCode).toBe(404);
      });
   
  });