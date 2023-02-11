##Taken from nodejs.org, found here: https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
FROM node:16

LABEL title = "chore-no-more"

# Create app directory
WORKDIR /usr/src/chore-no-more

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY /chore-no-more/package*.json ./

RUN npm install

# Bundle app source
COPY /chore-no-more .

#Makes sure node_modules is up to date
RUN npm rebuild

EXPOSE 3000
CMD npm start