FROM debian:trixie-slim

ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=$USER_UID
ARG ZOLA_VERSION=0.21.0
ARG ZOLA_ARCH=

RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        git \
        sudo \
        tar; \
    rm -rf /var/lib/apt/lists/*; \
    release_arch="${ZOLA_ARCH:-}"; \
    if [ -z "${release_arch}" ]; then \
        host_arch="$(dpkg --print-architecture)"; \
        case "${host_arch}" in \
            amd64) release_arch="x86_64-unknown-linux-musl" ;; \
            arm64) release_arch="aarch64-unknown-linux-musl" ;; \
            *) echo "Unsupported architecture: ${host_arch}" >&2; exit 1 ;; \
        esac; \
    fi; \
    zola_filename="zola-v${ZOLA_VERSION}-${release_arch}.tar.gz"; \
    zola_archive="/tmp/${zola_filename}"; \
    zola_url="https://github.com/getzola/zola/releases/download/v${ZOLA_VERSION}/${zola_filename}"; \
    curl -fsSL "${zola_url}" -o "${zola_archive}"; \
    tar -xf "${zola_archive}" -C /usr/local/bin zola; \
    rm "${zola_archive}"; \
    rm -rf /var/lib/apt/lists/*; \
    groupadd --gid "${USER_GID}" "${USERNAME}"; \
    useradd --uid "${USER_UID}" --gid "${USER_GID}" -m "${USERNAME}"; \
    echo "${USERNAME} ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/99${USERNAME}; \
    chmod 0440 /etc/sudoers.d/99${USERNAME}

WORKDIR /workspace
