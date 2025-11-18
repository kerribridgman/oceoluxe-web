#!/usr/bin/env node

/**
 * Patrick Farrell's Blog - MCP Server
 * Allows Claude to create and manage blog posts via MCP
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Import all tools
import * as createBlogPost from './tools/create-blog-post.js';
import * as listBlogPosts from './tools/list-blog-posts.js';
import * as getBlogPost from './tools/get-blog-post.js';
import * as updateBlogPost from './tools/update-blog-post.js';
import * as deleteBlogPost from './tools/delete-blog-post.js';
import * as publishBlogPost from './tools/publish-blog-post.js';
import * as unpublishBlogPost from './tools/unpublish-blog-post.js';
import * as uploadImage from './tools/upload-image.js';

// Configuration
const API_BASE_URL = process.env.API_BASE_URL || 'https://iampatrickfarrell.com';
const API_KEY = process.env.MCP_API_KEY || '';

if (!API_KEY) {
  console.error('ERROR: MCP_API_KEY environment variable is required');
  console.error('Please set your API key before running this server');
  process.exit(1);
}

// Tool registry
const tools = [
  createBlogPost,
  listBlogPosts,
  getBlogPost,
  updateBlogPost,
  deleteBlogPost,
  publishBlogPost,
  unpublishBlogPost,
  uploadImage,
];

class BlogMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'iampatrickfarrell-blog',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
    this.setupErrorHandling();
  }

  setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: tools.map((tool) => tool.definition),
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      // Find the tool
      const tool = tools.find((t) => t.definition.name === name);

      if (!tool) {
        throw new Error(`Unknown tool: ${name}`);
      }

      try {
        // Execute the tool with API configuration
        const result = await tool.execute(args, { API_BASE_URL, API_KEY });
        return result;
      } catch (error) {
        console.error(`Error executing tool ${name}:`, error);
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message || 'An unexpected error occurred'}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Patrick Farrell Blog MCP server running on stdio');
  }
}

const server = new BlogMCPServer();
server.run().catch(console.error);
