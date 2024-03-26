#ifndef ERPROC_H
#define ERPROC_H

#include <stdlib.h>
#include <sys/socket.h>
#include <stdio.h>
#include <unistd.h>

int Socket(int domain, int type, int protocol);

int Bind(int fd, const struct sockaddr *addr, socklen_t addrlen);

int Listen(int fd, int backlog);

int Accept(int fd, struct sockaddr *addr, socklen_t *addrLen);

int Read(int fd, void *buf, size_t nbytes);

#endif
