FROM node:lts-buster

# Set working directory inside container
WORKDIR /app

# Copy package.json and install dependencies first (layer caching)
COPY package*.json ./
RUN npm install -g pm2 && npm install

# Copy the rest of the code
COPY . .

# Expose the port your app runs on
EXPOSE 9090

# Start the app
CMD ["npm", "start"]
