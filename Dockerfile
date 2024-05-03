FROM public.ecr.aws/lambda/nodejs:20 as builder
WORKDIR /usr/app
ARG LAMBDA_DIR
COPY ${LAMBDA_DIR}/package.json ${LAMBDA_DIR}/index.ts  ./
RUN npm install
RUN npm run build

FROM public.ecr.aws/lambda/nodejs:20
WORKDIR ${LAMBDA_TASK_ROOT}
COPY --from=builder /usr/app/dist/* ./
CMD ["index.handler"]