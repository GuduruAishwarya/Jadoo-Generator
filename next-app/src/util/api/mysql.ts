import { Parser } from "sql-ddl-to-json-schema";

export function getMysqlRequestData(schemaText: string, records: number){
    const mysqlParser = new Parser('mysql')
    const compactJsonTablesArray = mysqlParser.feed(schemaText).toCompactJson(mysqlParser.results);

    const data = {
        records,
        data: JSON.stringify(compactJsonTablesArray)
    }
    return data
}