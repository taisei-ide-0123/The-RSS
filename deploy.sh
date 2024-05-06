#!/bin/bash

source .env

sam build
sam deploy --no-confirm-changeset \
           --parameter-overrides accountId=$AWS_ACCOUNT_ID \
           openaiApiKey=$OPENAI_API_KEY \
           slackChannelUrl=$SLACK_CHANNEL_URL
