---
description:
globs:
alwaysApply: false
---
# Defining New MCP Servers

To define a new MCP server in this project, follow these steps:

1. **Create a Template Script**
   - Place a new `.template` file in the [`mcp_scripts`](mdc:mcp_scripts) directory.
   - The template should include any necessary placeholders (e.g., for tokens) that will be replaced during setup.

2. **Integrate with MCP Configuration**
   - Add an entry for the new server script in [`mcp.json`](mdc:.roo/mcp.json).
   - Ensure the configuration references the correct script and any required environment variables.

This approach ensures all MCP server scripts are templated, version-controlled, and consistently integrated into the project configuration.
