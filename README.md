# @grace-studio/umbraco-client

[![npm version](https://badge.fury.io/js/@grace-studio%2Fumbraco-client.svg)](https://badge.fury.io/js/@grace-studio%2Fumbraco-client)

A middle layer that connects your application to the Umbraco CMS using a simple and flexible API client.

## Features

- **Easy Integration**: Seamlessly integrate Umbraco CMS with your app.
- **TypeScript Support**: Automatically generate types from your Umbraco Swagger schema.
- **Flexible API**: Provides methods to fetch, format, and filter content efficiently.

## Installation

Install the package using npm or yarn:

```bash
# Using npm
npm install @grace-studio/umbraco-client

# Using yarn
yarn add @grace-studio/umbraco-client
```

## Generate TypeScript Types

Before using the client, generate TypeScript types based on your Umbraco Swagger schema. This ensures type safety when interacting with the Umbraco API.

```bash
npx openapi-typescript https://your-umbraco-url/swagger/v1/swagger.json --output ./src/api/types.ts
```

This command will generate TypeScript definitions for your Umbraco API and save them in `./src/api/types.ts`.

### If running into issues with self-signed SSL certificate locally

Add the environment variable NODE_TLS_REJECT_UNAUTHORIZED=0 to tell Node.js to ignore SSL certificate validation. This is useful for local development when working with a self-signed certificate or localhost.

```bash
NODE_TLS_REJECT_UNAUTHORIZED=0 npx openapi-typescript https://your-umbraco-url/swagger/v1/swagger.json --output ./src/api/types.ts
```

## Usage

Below is an example of how to use the `UmbracoClient` in your Next.js application.

### Setup the API Client

```typescript
import type { components, paths } from '#api/types';
import { UmbracoClient } from '@grace-studio/umbraco-client';

// Create an instance of UmbracoClient
const apiClient = UmbracoClient.create<paths>({
  apiToken: 'your-api-token', // Replace with your actual API token
  apiUrl: 'https://your-umbraco-url', // Your Umbraco API URL
});
```

### Example API Methods

Here are some common use cases for fetching content from the Umbraco CMS using the `UmbracoClient`.

#### Fetch All Content

```typescript
const getContent = () =>
  apiClient
    .get('/umbraco/delivery/api/v2/content')
    .then(UmbracoClient.format.content); // Format the content
```

#### Fetch a Specific Content Item by Path

```typescript
const getContentItem = (path: string) =>
  apiClient
    .get('/umbraco/delivery/api/v2/content/item/{path}', {
      params: {
        path: { path }, // Pass the path as a parameter
      },
    })
    .then(UmbracoClient.format.contentItem); // Format the specific content item
```

#### Fetch Content Paths

```typescript
const getPaths = (
  basePath: string, // Base path, eg. your locale '/en'
) =>
  apiClient.getPaths({
    basePath,
    excludeHidden: true, // Exclude hidden content
    mappingFunctions: {
      // Add custom mapping functions for hidden content based on properties
      hidden: ({ umbracoNaviHide }) => Boolean(umbracoNaviHide),
    },
  });
```

#### Fetch Content Menu

```typescript
const getMenu = (
  basePath: string, // Base path, eg. your locale '/en'
) =>
  apiClient.getMenu({
    basePath,
    excludeHidden: true, // Exclude hidden content
    mappingFunctions: {
      // Add custom mapping functions for hidden content based on properties
      hidden: ({ umbracoNaviHide }) => Boolean(umbracoNaviHide),
      type: (
        { isSecondaryLink }, // Custom mapping function for menu item type
      ) => (isSecondaryLink === true ? 'secondary' : 'primary'),
    },
  });
```
