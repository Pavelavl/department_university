#include "httpd.h"

int handle_index(int fd) {
    const char* response = "HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n";
    write(fd, response, strlen(response));

    FILE* fp = fopen("./static/index.html", "r");
    if (fp == NULL) {
        perror("Error opening index.html");
        return -1;
    }

    char buffer[65536];
    while (fgets(buffer, sizeof(buffer), fp) != NULL) {
        write(fd, buffer, strlen(buffer));
    }

    fclose(fp);

    return 0;
}

int handle_js(int fd) {
    const char* response = "HTTP/1.1 200 OK\r\nContent-Type: application/javascript\r\n\r\n";
    write(fd, response, strlen(response));

    FILE* fp = fopen("./static/main.js", "r");
    if (fp == NULL) {
        perror("Error opening index.html");
        return -1;
    }

    char buffer[65536];
    while (fgets(buffer, sizeof(buffer), fp) != NULL) {
        write(fd, buffer, strlen(buffer));
    }

    fclose(fp);

    return 0;
}

int handle_css(int fd) {
    const char* response = "HTTP/1.1 200 OK\r\nContent-Type: text/css\r\n\r\n";
    write(fd, response, strlen(response));

    FILE* fp = fopen("./static/styles.css", "r");
    if (fp == NULL) {
        perror("Error opening index.html");
        return -1;
    }

    char buffer[65536];
    while (fgets(buffer, sizeof(buffer), fp) != NULL) {
        write(fd, buffer, strlen(buffer));
    }

    fclose(fp);

    return 0;
}

int handle_post(int fd, char* body) {
    cJSON* parsedBody = cJSON_Parse(body);
    cJSON* query = cJSON_GetObjectItemCaseSensitive(parsedBody, "query");
    QueryResult *result;
    cJSON *jsonResponse;
    
    result = makeQuery(query->valuestring);
    if (result == NULL) {
        perror("Failed to make query\n");
        return -1;
    }
    jsonResponse = queryResultToJSON(result);

    // Отправка HTTP-заголовков
    const char *headers = "HTTP/1.1 200 OK\r\n"
                          "Content-Type: application/json\r\n\r\n";
    write(fd, headers, strlen(headers));

    // Отправка JSON-ответа
    char *jsonString = cJSON_Print(jsonResponse);
    size_t respSize = strlen(jsonString);
    const char *buf = jsonString;

    write(fd, buf, respSize);

    return 0;
}

int handle_not_found(int fd) {
    const char *response = "HTTP/1.1 404 Not Found\r\n\r\n";
    write(fd, response, strlen(response));

    return 0;
}