import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Initialize server
const server = new McpServer({
    name: "hello-mcp",
    version: "1.0.0"
});

// Implant each capability below

// 1. Resources - Providing Information (implementing a Hello World Resource)
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


// Start server using stdio transport
const transport = new StdioServerTransport();
await server.connect(transport);
console.info('{"jsonrpc": "2.0", "method": "log", "params": { "message": "Serfver running..." }}');
