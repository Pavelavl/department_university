#ifndef HTTPD_H
#define HTTPD_H

#include <string.h>
#include <unistd.h>
#include "pg.h"
#include "json.h"

int handle_index(int fd);

int handle_js(int fd);

int handle_css(int fd);

int handle_post(int fd, char* body);

int handle_not_found(int fd);

#endif