FROM node:carbon

WORKDIR /app/

# Install app dependencies
COPY package*.json yarn.lock ./
# Install without yarn cache. Takes advantage of docker caching.
# https://github.com/yarnpkg/yarn/issues/749#issuecomment-253253608
RUN yarn --pure-lockfile

# Bundle app source
COPY . .

RUN node ./core/scripts/set_up.js

EXPOSE 3001

CMD [ "bash" ]