#!/bin/bash

echo hello! 
echo What should the version be?
read VERSION

docker build -t cedrycm/forumapi:$VERSION .
docker push cedrycm/forumapi:$VERSION
ssh root@143.198.64.202 "docker pull cedrycm/forumapi:$VERSION && docker tag cedrycm/forumapi:$VERSION dokku/api:$VERSION && dokku deploy api $VERSION"