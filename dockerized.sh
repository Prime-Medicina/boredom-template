#!/usr/bin/env bash

export MSYS_NO_PATHCONV=1

DOCKER_IMAGE="node:12.13.1-alpine3.9"

### Argument parsing
while [ $# -gt 0 ]; do
  case "$1" in
    -c=*|--command=*) command_arg="${1#*=}" ;;
    -e=*|--environment=*) environment_arg="${1#*=}" ;;
    *)
      echo "Invalid argument \"$1\""
      exit 1
  esac
  shift
done

# command [ dev | build | build:frontend | build:backend | deploy | deploy:frontend | deploy:backend | deploy:development | deploy:production ]
case "${command_arg,,}" in
  'dev') command='dev' ;;
  'build') command='build' ;;
  'build:frontend') command='build:frontend' ;;
  'build:backend') command='build:backend' ;;
  'deploy') command='deploy' ;;
  'deploy:frontend') command='deploy:frontend' ;;
  'deploy:backend') command='deploy:backend' ;;
  'deploy:development') command='deploy:development' ;;
  'deploy:production') command='deploy:production' ;;
  *)
    echo "Invalid command \"${command}\""
    exit 1
esac

# environment [ *development | production ]
case "${environment_arg,,}" in
 'production') environment='production' ;;
 'development') environment='development' ;;
 *) environment='development' ;;
esac

print_title() {
  printf "\n\e[1;34m$1\n"
  printf "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\e[0m\n"
}

aws_key_var="JURISCLOUD_AWS_ACCESS_KEY_ID"
aws_secret_var="JURISCLOUD_AWS_SECRET_ACCESS_KEY"
aws_region="JURISCLOUD_AWS_REGION"

if [[ ${command} = "dev" ]]; then
  print_title "Development terminal"

  docker run --rm -it \
    -e AWS_ACCESS_KEY_ID="${!aws_key_var}" \
    -e AWS_SECRET_ACCESS_KEY="${!aws_secret_var}" \
    -e AWS_DEFAULT_REGION="${!aws_region}" \
    -v "$(pwd)":/app/ \
    -w /app \
      ${DOCKER_IMAGE} /bin/sh

else
  print_title "Running $command"

  docker run --rm -it \
    -e AWS_ACCESS_KEY_ID="${!aws_key_var}" \
    -e AWS_SECRET_ACCESS_KEY="${!aws_secret_var}" \
    -e AWS_DEFAULT_REGION="${!aws_region}" \
    -v "$(pwd)":/app/ \
    -w /app \
      ${DOCKER_IMAGE} /bin/sh -c "npm i -g serverless && serverless login && npm run $command"

fi
