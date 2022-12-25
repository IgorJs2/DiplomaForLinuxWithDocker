# pull official base image

FROM alpine:latest

RUN apk update
RUN apk add postgresql-dev gcc python3-dev musl-dev

FROM python:3


# PROJECT SETUP
# ----------------

# sets the working directory
WORKDIR /usr/src/DiplomaBackend-master

# copy these two files from <src> to <dest>
# <src> = current directory on host machine
# <dest> = filesystem of the container
COPY Pipfile Pipfile.lock ./

# install pipenv on the container
RUN pip install -U pipenv

# install project dependencies
RUN pipenv install --system


# copy project
COPY . .d
