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

      describe("POST /submit", () => {
        it("should register a user with valid data", async () => {
          const userData = {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            password: "Password123!",
            confirmPassword: "Password123!",
          };
    
          const response = await request(app).post("/submit").send(userData);
    
          expect(response.statusCode).toBe(200);
          expect(response.body).toEqual({
            success: true,
            email: "john.doe@example.com",
          });
        });
    
        it("should return errors for missing fields", async () => {
          const response = await request(app).post("/submit").send({});
    
          expect(response.statusCode).toBe(400);
          expect(response.body.success).toEqual(false);
          expect(Object.keys(response.body.errors).length).toEqual(5);
        });
    
        it("should return an error for invalid email", async () => {
          const userData = {
            firstName: "John",
            lastName: "Doe",
            email: "invalid-email",
            password: "Password123!",
            confirmPassword: "Password123!",
          };
    
          const response = await request(app).post("/submit").send(userData);
    
          expect(response.statusCode).toBe(400);
          expect(response.body).toEqual({
            success: false,
            errors: {
              email: "Invalid email format",
            },
          });
        });
    
        it("should return an error for password mismatch", async () => {
          const userData = {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            password: "Password123!",
            confirmPassword: "DifferentPassword123!",
          };
    
          const response = await request(app).post("/submit").send(userData);
    
          expect(response.statusCode).toBe(400);
          expect(response.body).toEqual({
            success: false,
            errors: {
              confirmPassword: "Passwords do not match",
            },
          });
        });
    
        it("should return an error for weak password", async () => {
          const userData = {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            password: "weak",
            confirmPassword: "weak",
          };
    
          const response = await request(app).post("/submit").send(userData);
    
          expect(response.statusCode).toBe(400);
          expect(response.body.success).toEqual(false);
          expect(response.body.errors.password).toEqual(
            "Password must be between 8 and 255 characters"
          );
        });
      });
   
  });