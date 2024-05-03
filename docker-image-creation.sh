#!/bin/bash

docker build --platform linux/x86_64 --build-arg LAMBDA_DIR=CollectArticles -t collect-articles ./
docker tag collect-articles:latest $AWS_ACCOUNT_ID.dkr.ecr.ap-northeast-1.amazonaws.com/collect-articles:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.ap-northeast-1.amazonaws.com/collect-articles:latest