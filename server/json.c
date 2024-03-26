#include "json.h"

// Функция для преобразования QueryResult в cJSON объект
cJSON* queryResultToJSON(QueryResult* result) {
    if (!result) {
        return NULL;
    }

    cJSON* root = cJSON_CreateObject();
    if (!root) {
        return NULL;
    }

    // Добавляем количество строк (ntuples) и количество полей (nfields) в объект JSON
    cJSON_AddNumberToObject(root, "ntuples", result->ntuples);
    cJSON_AddNumberToObject(root, "nfields", result->nfields);

    // Создаем массив объектов, каждый из которых представляет собой строку результата
    cJSON* rows = cJSON_AddArrayToObject(root, "rows");
    if (!rows) {
        cJSON_Delete(root);
        return NULL;
    }

    // Проходим по каждой строке и добавляем ее в массив rows
    for (int i = 0; i < result->ntuples; ++i) {
        cJSON* row = cJSON_CreateObject();
        if (!row) {
            cJSON_Delete(root);
            return NULL;
        }
        // Проходим по каждому полю строки и добавляем его в массив row
        for (int j = 0; j < result->nfields; ++j) {
            cJSON* field = cJSON_CreateString(result->values[i][j]);
            if (!field) {
                cJSON_Delete(root);
                return NULL;
            }
            cJSON_AddItemToObject(row, result->column_names[j], field);
        }
        cJSON_AddItemToArray(rows, row);
    }

    return root;
}