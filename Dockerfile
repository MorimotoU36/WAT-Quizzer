FROM public.ecr.aws/lambda/nodejs:20

ENV DATABASE_URL=$DATABASE_URL

# from monorepo root
WORKDIR ${LAMBDA_TASK_ROOT}

COPY ./*.json ./

COPY ./quizzer-lib/*.json ./quizzer-lib/

COPY ./backend-nest/*.json ./backend-nest/

RUN npm install --production

# build quizzer-lib
WORKDIR ${LAMBDA_TASK_ROOT}/quizzer-lib

COPY ./quizzer-lib ./
# TODO libでは--productionつけてできるようにしたい　外したらエラーになる？
RUN npm install
RUN npm run build

# アプリケーションディレクトリを作成する
WORKDIR ${LAMBDA_TASK_ROOT}/backend-nest

COPY ./backend-nest ./

RUN npm run build

WORKDIR ${LAMBDA_TASK_ROOT}
CMD [ "/var/task/backend-nest/dist/main.handler" ]
