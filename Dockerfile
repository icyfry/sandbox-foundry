FROM node:24

ENV DEBIAN_FRONTEND=noninteractive

# Config

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl git ca-certificates unzip sudo \
    && rm -rf /var/lib/apt/lists/*

# PNPM

RUN npm install -g pnpm

# Dedicated user (sandboxuser)

#RUN useradd -ms /bin/bash sandboxuser && \
#    usermod -aG sudo sandboxuser && \
#    echo "sandboxuser ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Setup

USER node
WORKDIR /home/node

# Task

RUN sh -c "$(curl --location https://taskfile.dev/install.sh)" -- -d -b ~/.local/bin
COPY Taskfile.yml /home/node/Taskfile.yml

# Foundry

RUN curl -L https://foundry.paradigm.xyz | bash && \
    ~/.foundry/bin/foundryup

ENV PATH="/home/node/.foundry/bin:/home/node/.local/bin:${PATH}"

RUN mkdir -p /home/node/contracts/lib
RUN mkdir -p /home/node/contracts/out
RUN mkdir -p /home/node/contracts/cache

# DAPP

RUN mkdir -p /home/node/dapp/node_modules
RUN mkdir -p /home/node/dapp/.pnpm-store

WORKDIR /home/node