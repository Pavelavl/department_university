#ifndef JSON_H
#define JSON_H

#include "pg.h"
#include "cJSON.h"

cJSON* queryResultToJSON(QueryResult* result);

#endif