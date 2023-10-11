# Welcome to FlareCity!

<h1 align="center" style="padding-bottom: 30px">
  <img align="center" width="50%" src="flare-city-logo.png" style="margin: 0 auto;"/>
</h1 >
  <p align="center" style="font-size: 1.2rem">A robust and efficient starter template meticulously crafted to expedite the development of web applications. It seamlessly integrates with Cloudflare, leveraging the platform's strengths alongside additional powerful tools.</p>

## Overview

_FlareCity_ is a robust and efficient starter template meticulously crafted to expedite the development of web applications. It seamlessly integrates with Cloudflare, leveraging the platform's strengths alongside additional powerful tools.

**Key Features:**

1. **Cloudflare Worker API:** The template includes a Cloudflare Worker API that follows simple yet powerful conventions for endpoint routing. This ensures a clean and organized structure for handling API requests, making development straightforward and scalable.

2. **Authentication with Auth0:** Security is a top priority. Both the API and the application are seamlessly authenticated using Auth0, ensuring that your web application is protected against unauthorized access.

3. **Data Interaction:** The front-end interacts with the Cloudflare Worker API to fetch and manipulate data, creating a dynamic user experience. The template provides conventions for efficient data handling, making it easy to integrate and display information in your application.

4. **Cloudflare Hyperspeed Queries:** _FlareCity_ takes advantage of Cloudflare Hyperspeed, enhancing the speed and responsiveness of queries, resulting in an optimized user experience.

5. **Prisma ORM Integration:** For seamless database interaction, the template incorporates Prisma as its ORM (Object-Relational Mapping), streamlining database operations and enhancing overall data management.

**Why FlareCity?**

- **Speed and Scalability:** Benefit from the speed of Cloudflare, creating a high-performance web application.

- **Consistent Conventions:** The template introduces straightforward conventions for API routing, data interaction, and database management, promoting consistency and simplicity in your development process.

- **Secure Authentication:** With Auth0 integration, user authentication is seamless and secure, ensuring that your application is protected against potential threats.

_FlareCity is your go-to solution for building dynamic web apps with confidence, efficiency, and a touch of flare._

## Technology Stack

The below sections detail the specifics about the tech stack that is used as this starter.

### API

The API is built on top of Cloudflare workers module worker syntax. Every request enters the Cloudflare worker and some basic conventions have been established to properly validate, authenticate and the subsequently define routes and middleware.

Click here for the [API Documentation]()

### App

### ORM - Prisma

### Caching - Cloudflare Hyperdrive

### Docs
