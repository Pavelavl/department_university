gcc -o server server.c erproc.c httpd.c pg.c cJSON.c json.c -I /usr/include/postgresql -lpq -std=c99
