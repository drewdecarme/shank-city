# Welcome to FlareKit!

## Overview

**FlareKit Starter Template: Building Dynamic Web Apps with Next.js, Cloudflare, and More**

_FlareKit_ is a robust and efficient starter template meticulously crafted to expedite the development of web applications. It seamlessly integrates Next.js and Cloudflare, leveraging the strengths of both technologies alongside additional powerful tools.

**Key Features:**

1. **Cloudflare Worker API:** The template includes a Cloudflare Worker API that follows simple yet powerful conventions for endpoint routing. This ensures a clean and organized structure for handling API requests, making development straightforward and scalable.

2. **Next.js Front-End:** The front-end, powered by Next.js, utilizes the latest app router introduced in Next.js 13.5. This router brings enhanced navigation capabilities, making it easier to manage the flow of your application and providing a smoother user experience.

3. **Authentication with Auth0:** Security is a top priority. Both the API and the Next.js application are seamlessly authenticated using Auth0, ensuring that your web application is protected against unauthorized access.

4. **Data Interaction:** The front-end interacts with the Cloudflare Worker API to fetch and manipulate data, creating a dynamic user experience. The template provides conventions for efficient data handling, making it easy to integrate and display information in your application.

5. **Cloudflare Hyperdrive Queries:** _FlareKit_ takes advantage of Cloudflare Hyperdrive, enhancing the speed and responsiveness of queries, resulting in an optimized user experience.

6. **Prisma ORM Integration:** For seamless database interaction, the template incorporates Prisma as its ORM (Object-Relational Mapping), streamlining database operations and enhancing overall data management.

**Why FlareKit?**

- **Speed and Scalability:** Benefit from the speed of Cloudflare, the scalability of Next.js, and the optimization of Hyperdrive queries, creating a high-performance web application.

- **Consistent Conventions:** The template introduces straightforward conventions for API routing, data interaction, and database management, promoting consistency and simplicity in your development process.

- **Secure Authentication:** With Auth0 integration, user authentication is seamless and secure, ensuring that your application is protected against potential threats.

- **Modern Routing:** Take advantage of the new app router in Next.js 13.5 for modern and intuitive navigation within your application.

_FlareKit is your go-to solution for building dynamic web apps with confidence, efficiency, and a touch of flare._

## Technology Stack

The below sections detail the specifics about the tech stack that is used as this starter.

### API

The API is built on top of Cloudflare workers module worker syntax. Every request enters the Cloudflare worker and some basic conventions have been established to properly validate, authenticate and the subsequently define routes and middleware.

Click here for the [API Documentation]()

### App

### ORM - Prisma

### Caching - Cloudflare Hyperdrive

### Docs
