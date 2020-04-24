FROM node:12-alpine

WORKDIR /home/node/

USER node
COPY --chown=node:node frontend /home/node/frontend

# Build frontend and move dist
RUN cd frontend && \
    npm install

RUN cd frontend && \
    npm run build
RUN mv frontend/dist/ /home/node/public/ && \
    rm -R /home/node/frontend

COPY --chown=node:node server /home/node/server
RUN cd server && \
    npm install --production

ENV PORT 8000
ENV PUBLIC /home/node/public/

WORKDIR /home/node/server
CMD ["npm", "run", "live"]
