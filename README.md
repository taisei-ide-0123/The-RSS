# The-RSS

## How to register a docker image to ECR

### Build

ex) `docker build --build-arg LAMBDA_DIR=CollectArticles -t collect-articles ./`

### Tag

ex) `docker tag collect-articles:latest $AWS_ACCOUNT_ID.dkr.ecr.ap-northeast-1.amazonaws.com/collect-articles:latest`

### Push

ex) `docker push $AWS_ACCOUNT_ID.dkr.ecr.ap-northeast-1.amazonaws.com/collect-articles:latest`
