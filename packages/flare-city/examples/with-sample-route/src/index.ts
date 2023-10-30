import { App } from "@flare-city/core";
import { RouteSample } from "./features";

// Declare a new application
export const API = new App("@flare-city/example-with-sample-route");

// Add routes
API.addRoute(RouteSample);

// Start the API
export default API.start();
