FROM node:22

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install dependencies (use npm ci for reproducible builds)
RUN npm ci

# Copy application source
COPY . .

# Default command to run the MCP server
CMD ["node", "index.js"]