FROM node:12-alpine

WORKDIR /home/node/

COPY frontend /home/node/frontend
RUN chown -R node:node /home/node/frontend

COPY server /home/node/server
RUN chown -R node:node /home/node/server

USER node

# Build frontend and move dist
RUN cd frontend && \
    npm install

RUN cd frontend && \
    npm run build
RUN mv frontend/dist/ /home/node/public/ && \
    rm -R /home/node/frontend

RUN cd server && \
    npm install --production

ENV PORT 8000
ENV PUBLIC /home/node/public/

WORKDIR /home/node/server
CMD ["npm", "run", "live"]
