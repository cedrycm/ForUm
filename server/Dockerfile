FROM node:14
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "yarn.lock","npm-shrinkwrap.json*", "./"]
RUN yarn  
COPY . .
RUN yarn build
EXPOSE 3000
RUN chown -R node /usr/src/app
USER node
CMD ["node", "dist/index.js"]
