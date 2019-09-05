# specify the node base image with your desired version node:<version>
FROM node:10

# maintainer
LABEL maintainer="kapil.sharma@matellio.com"

# extra metadata
LABEL version="1.0"
LABEL description="Image with Twitter Sentiments Backend."

WORKDIR /twitter_sentiments/backend

COPY package.json /twitter_sentiments/backend

RUN npm install

RUN npm install -g nodemon --unsafe

RUN npm install -g express --unsafe

COPY . /twitter_sentiments/backend

EXPOSE 3001

CMD npm start

# Then run the following command to expose the container as a service
# docker run -it -v $(pwd):/twitter_sentiments/backend -p 3001:3001 --name hack-wonders-backend hack-wonders-backend:1.0.0