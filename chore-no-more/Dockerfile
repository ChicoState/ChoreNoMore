# Dockerfile

#dockerfile and dockercompose from: https://medium.com/@chavezharris/live-reload-with-docker-and-react-3d6de03920af

FROM node:16

LABEL title = "chore-no-more"

# Create app directory
WORKDIR chore-no-more

# Copy app dependencies to container
COPY ./package*.json ./

# Add `/app/node_modules/.bin` to $PATH
ENV PATH /chore-no-more/node_modules/.bin:$PATH

# Install dependencies
RUN npm install

# Deploy app for local development
CMD npm start --host 0.0.0.0 --port 3000 --disableHostCheck true