# "Alpine" tag uses almost 3 times less disk space compared to regular node images.
FROM node:alpine

WORKDIR /app/

# Install yarn because it is not preinstalled in "alpine" tag.
# It is better package manager which helps make image size smaller.
# https://medium.com/@iamnayr/a-multi-part-analysis-of-node-docker-image-sizes-using-yarn-vs-traditional-npm-2c20f034c08f
# Also install git because some packages are installed directly from github.
# NOTE: do not install git when this packges are no longer used. (see: package.json)
RUN apk update && apk add --no-cache yarn git

# Install app dependencies
COPY package*.json yarn.lock ./
# Install without yarn cache. Takes advantage of docker caching.
# https://github.com/yarnpkg/yarn/issues/749#issuecomment-253253608
RUN yarn --pure-lockfile && yarn cache clean

# Bundle app source
COPY . .
# FIXME: add comments
RUN node ./core/scripts/set_up.js

# In order to use docker image for local development,
# read/write acces to application code must be granted to container through volume.
VOLUME [ "." ]

EXPOSE 3001

CMD [ "sh" ]
