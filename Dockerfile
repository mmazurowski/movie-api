FROM node:14-alpine as Builder

COPY . /home/app

WORKDIR /home/app

RUN apk --no-cache add curl >> /dev/null \
    && npm ci >> /dev/null \
    && npm install -g typescript >> /dev/null \
    && npm run build >> /dev/null \
    && curl -sf https://gobinaries.com/tj/node-prune | sh \
    && node-prune >> /dev/null \
    && rm -fr src tsconfig.build.json tsconfig.json process-env.d.ts package-lock.json

FROM node:14-alpine as Executor

WORKDIR /home/app

COPY --chown=node:node --from=Builder /home/app/ /home/app/

EXPOSE 4000

USER node

CMD node dist/index.js