FROM --platform=linux/x86_64 public.ecr.aws/lambda/nodejs:20 as builder
ARG LAMBDA_DIR
WORKDIR /usr/app
COPY ${LAMBDA_DIR}/package.json ${LAMBDA_DIR}/index.ts  ./
RUN npm install
RUN npm run build

FROM --platform=linux/x86_64 public.ecr.aws/lambda/nodejs:20
WORKDIR ${LAMBDA_TASK_ROOT}
COPY --from=builder /usr/app/dist/* ./
CMD ["index.handler"]