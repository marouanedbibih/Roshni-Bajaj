# Use the official Node.js image as the base image
FROM node:lts-alpine3.18 as BUILD_IMAGE

# Set the working directory in the container
WORKDIR /app/react-app

# Copy package.json and package-lock.json to the container
COPY package*.json .

# Install dependencies
RUN npm install
# RUN npm install axios
# RUN npm install react-router-dom

# Copy the rest of the application code to the container
COPY . .

# Build the React application
RUN npm run build

# Expose the port that the React app will run on (usually 3000)
# EXPOSE 3000

# Start the React application
# CMD ["npm", "run","dev"]
FROM node:lts-alpine3.18 as PRODUCTION_IMAGE
WORKDIR /app/react-app
COPY --from=BUILD_IMAGE /app/react-app/dist /app/react-app/dist
EXPOSE 3000

COPY package.json .
COPY vite.config.js .

RUN npm install
CMD [ "npm","run","preview" ]