FROM debian:trixie-slim

ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=$USER_UID
ARG ZOLA_VERSION=0.19.2
ARG ZOLA_ARCH=x86_64-unknown-linux-gnu

RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        git \
        sudo \
        tar; \
    rm -rf /var/lib/apt/lists/*; \
    zola_url="https://github.com/getzola/zola/releases/download/v${ZOLA_VERSION}/zola-v${ZOLA_VERSION}-${ZOLA_ARCH}.tar.gz"; \
    zola_checksum_url="${zola_url}.sha256"; \
    curl -fsSL "${zola_url}" -o "/tmp/zola-v${ZOLA_VERSION}-${ZOLA_ARCH}.tar.gz"; \
    curl -fsSL "${zola_checksum_url}" -o "/tmp/zola-v${ZOLA_VERSION}-${ZOLA_ARCH}.tar.gz.sha256"; \
    (cd /tmp && sha256sum --check "zola-v${ZOLA_VERSION}-${ZOLA_ARCH}.tar.gz.sha256"); \
    tar -xf "/tmp/zola-v${ZOLA_VERSION}-${ZOLA_ARCH}.tar.gz" -C /usr/local/bin zola; \
    rm /tmp/zola-v${ZOLA_VERSION}-${ZOLA_ARCH}.tar.gz*; \
    groupadd --gid "${USER_GID}" "${USERNAME}"; \
    useradd --uid "${USER_UID}" --gid "${USER_GID}" -m "${USERNAME}"; \
    echo "${USERNAME} ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/99${USERNAME}; \
    chmod 0440 /etc/sudoers.d/99${USERNAME}

WORKDIR /workspace
