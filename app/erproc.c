#include "erproc.h"

int Socket(int domain, int type, int protocol) {
    int res = socket(domain, type, protocol);
    if (res == -1) {
        perror("Socket failed\n");
        return -1;
    }
    return res;
}

int Bind(int fd, const struct sockaddr *addr, socklen_t addrLen) {
    int res = bind(fd, addr, addrLen);
    if (res == -1) {
        perror("Bind failed\n");
        return -1;
    }
}

int Listen(int fd, int backlog) {
    int res = listen(fd, backlog);
    if (res == -1) {
        perror("Listen failed\n");
        return -1;
    }
    return res;
}

int Accept(int fd, struct sockaddr *addr, socklen_t *addrLen) {
    int res = accept(fd, addr, addrLen);
    if (res == -1) {
        perror("Accept failed\n");
        return -1;
    }
    return res;
}

int Read(int fd, void *buf, size_t nbytes) {
    int res = read(fd, buf, nbytes);
    if (res == -1) {
        perror("Read failed\n");
        return -1;
    }
    return res;
}
