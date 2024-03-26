#ifndef PG_H
#define PG_H

#include <stdio.h>
#include <libpq-fe.h>
#include <malloc.h>
#include <stdlib.h>

typedef struct {
    int ntuples; // number of tuples
    int nfields; // number of fields
    char*** values; // 8D array of field values
    char** column_names; // Array of column names
} QueryResult;

QueryResult* makeQuery(char* query);

void printQueryResult(QueryResult *queryRes);

#endif