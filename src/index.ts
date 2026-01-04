import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import z from "zod";

// Initialize server
const server = new McpServer({
    name: "hello-mcp",
    version: "1.0.0"
});

// Implant each capability below

// Capability 1. Resources - Providing Information (implementing a Hello World Resource)
server.resource(
    "hello-world",
    "hello://world",
    async (uri) => ({
        contents: [{
            uri: uri.href,
            text: "Hello, World! This is my first MCP resource."
        }]
    })
);

// Note: The URI hello://world follows standard URI conventions where 
// hello:// is the scheme (similar to http:// or file://) and world is the path. 
// This naming matches our “Hello World” theme. In real applications, you would 
// choose URIs that represent your specific resources, 
// like weather://forecast/london or file://documents/report.pdf.

// Capability 2. Tools - Enabling actions (implementing a calculator tool)
server.tool(
    "calculator",
    {
        operation: z.enum(["add", "subtract", "multiply", "divide"]),
        a: z.number(),
        b: z.number()
    },
    async ({ operation, a, b }) => {
        let result;

        switch (operation) {
            case "add":
                result = a + b;
                break;
            case "subtract":
                result = a - b;
                break;
            case "multiply":
                result = a * b;
                break;
            case "divide":
                if (b === 0) {
                    throw new Error("Division by zero");
                }
                result = a / b;
                break;
            default:
                throw new Error(`Unknown operation: ${operation}`);
        }

        return {
            content: [{
                type: "text",
                text: `The result of ${a} ${operation} ${b} = ${result}`
            }]
        };
    }
);
// Implementation Note: Different AI applications implement MCP capabilities to 
// varying degrees. For example, Cursor (the AI-powered code editor) currently only 
// implements the Tools capability, while Claude Desktop utilizes all three capabilities 
// (Resources, Tools, and Prompts) for a more comprehensive integration.

// Capability 3. Prompts - Generating structured output (implementing a greeting prompt)
server.prompt(
    "greeting",
    {
        name: z.string(),
        time_of_day: z.enum(["morning", "afternoon", "evening", "night"])
    },
    ({ name, time_of_day }) => ({
        messages: [{
            role: "user",
            content: {
                type: "text",
                text: `Hello ${name}! Good ${time_of_day}. How are you today?`
            }
        }]
    })
);

// You can now test your MCP server using MCP Inspector tool: npx @modelcontextprotocol/inspector node build/index.js

// Start server using stdio transport
const transport = new StdioServerTransport();
await server.connect(transport);
console.info('{"jsonrpc": "2.0", "method": "log", "params": { "message": "Serfver running..." }}');
