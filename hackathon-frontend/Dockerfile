# specify the node base image with your desired version node:<version>
FROM node:10

# maintainer
LABEL maintainer="kapil.sharma@matellio.com"

# extra metadata
LABEL version="1.0"
LABEL description="Image with Twitter Sentiments Frontend."

WORKDIR /twitter_sentiments/frontend

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /twitter_sentiments/frontend

RUN npm install

RUN npm install -g @angular/cli --unsafe

COPY . /twitter_sentiments/frontend

EXPOSE 4200

# start app
CMD ng serve --host 0.0.0.0

# Then run the following command to expose the container as a service
# docker run -it -v $(pwd):/twitter_sentiments/frontend -p 4200:4200 --name hack-wonders-frontend hack-wonders-frontend:1.0.0