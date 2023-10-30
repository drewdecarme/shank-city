import { middlewarePrisma } from "./lib";
import { App } from "@flare-city/core";
import { RouteTest, RouteTeam } from "./features";

// Declare a new application
export const API = new App("shank-city");

// Add Middleware
API.addMiddleware(middlewarePrisma);

// Add routes
API.addRoute(RouteTest);
API.addRoute(RouteTeam);

// Start the API
export default API.start();
