#include <arpa/inet.h>
#include <errno.h>
#include "erproc.h"
#include "httpd.h"
#include "pg.h"

static int _stopFlag = 0;
const static int _listenCount = 5;

int main(int argc, char** argv) {
    if (argc < 2) {
        fprintf(stdout, "Please, write correct port argument.\n");
        return 1;
    }
    char buf[2048];
    int server;
    if ((server = Socket(AF_INET, SOCK_STREAM, 0)) == -1) {
        return -1;
    }
    struct sockaddr_in adr = {0};
    adr.sin_family = AF_INET;
    adr.sin_port = htons(atoi(argv[1]));
    if (Bind(server, (struct sockaddr *) &adr, sizeof adr) == -1) {
        return -1;
    }
    socklen_t addrLen = sizeof adr;

    if (Listen(server, 5) != 0) {
        return -1;
    }
    fprintf(stdout, "Listening on port: %s \n", argv[1]);

    while (!_stopFlag) {
        pid_t pid;
        int fd;
        ssize_t nRead;
        
        if ((fd = Accept(server, (struct sockaddr *) &adr, &addrLen)) < 0 && errno != EINTR) {
            fprintf(stderr, "Unable to accept client: %s\n", strerror(errno));
        } else if (!_stopFlag) {
            fprintf(stdout, "Accepted client from %s\n", inet_ntoa(adr.sin_addr));
            nRead = Read(fd, buf, sizeof(buf));
            if (nRead == -1) {
                close(fd);
            } else if (nRead == 0) {
                printf("End of file occurred\n");
            } else {
                buf[nRead] = '\0';

                char method[5];
                char url[128];
                sscanf(buf, "%4s %127s", method, url);
                char* body = strstr(buf, "\r\n\r\n");
                if (strncmp(method, "POST", 4) == 0 && body != NULL) {
                    body += 4;
                    int res;
                    if (strncmp(url, "/get_data", 9) == 0) {
                        res = handle_post(fd, body);
                    } else {
                        res = handle_not_found(fd);
                    }

                    if (res == -1) {
                        perror("Request failed\n");
                    }
                } else if (strncmp(method, "GET", 3) == 0) {
                    if (strncmp(url, "/main.js", 8) == 0) {
                        int res = handle_js(fd);
                        if (res == -1) {
                            perror("Request failed\n");
                        }
                    } else if (strncmp(url, "/styles.css", 11) == 0) {
                        int res = handle_css(fd);
                        if (res == -1) {
                            perror("Request failed\n");
                        }
                    } else if (strncmp(url, "/", 1) == 0) {
                        int res = handle_index(fd);
                        if (res == -1) {
                            perror("Request failed\n");
                        }
                    } else {
                        int res = handle_not_found(fd);
                        if (res == -1) {
                            perror("Request failed\n");
                        }
                    }
                } else {
                    write(fd, "HTTP/1.1 405 Method Not Allowed\r\n\r\n", 35);
                }
                fprintf(stdout, "Connection from %s ended\n", inet_ntoa(adr.sin_addr));
                close(fd);
            }
        }
    }

    sleep(1);

    close(server);

    printf("Socket closed\n");

    return 0;
}