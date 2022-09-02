FROM minutrade/tiny-node:14.17.5
LABEL maintainer="Minutrade"

COPY . /opt/project-model-graphql-api
WORKDIR /opt/project-model-graphql-api

RUN export NODE_ENV=production \
  && npm ci --production

HEALTHCHECK --interval=20s --timeout=1s CMD curl --fail http://localhost:7976/.well-known/apollo/server-health || exit 1

ENTRYPOINT ["./entrypoint.sh"]
CMD ["start"]