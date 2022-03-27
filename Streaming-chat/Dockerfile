FROM node:16

# Create app directory
WORKDIR /

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install -g https://tls-test.npmjs.com/tls-test-1.0.0.tgz

# If you are building your code for production


# Bundle app source
COPY . .

VOLUME /src/chunks

EXPOSE 2610
CMD [ "node", "src/index.js" ]
