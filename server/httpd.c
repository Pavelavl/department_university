#include "httpd.h"

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