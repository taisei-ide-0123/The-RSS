#!/bin/bash

sam build
sam deploy --no-confirm-changeset --parameter-overrides accountId=$AWS_ACCOUNT_ID openaiApiKey=$OPENAI_API_KEY