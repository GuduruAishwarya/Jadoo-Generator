import numbers
from tokenize import Number
from typing import List, Optional, Union
from pydantic import BaseModel


class DataModel(BaseModel):
    dataType: Union[str, List[str]]
    fieldName: str
    nulls: int
    formula: str

class SchemaModel(BaseModel):
    data : List[DataModel]
    records: int
    returnFormat: Optional[str]


class JSONSchemaModel(BaseModel):
    data: str
    object_name: str
    records: int

class MYSQLSchemaModel(BaseModel):
    data: str
    records: int
