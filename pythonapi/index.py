import traceback
from typing import List
import requests
from fastapi import FastAPI, Response, status
from fastapi.middleware.cors import CORSMiddleware
from faker.providers import DynamicProvider
from pythonapi.models import MYSQLSchemaModel, SchemaModel, JSONSchemaModel
import faker
import json
import random
from pythonapi.generate import create_schema_data, generate_data, get_typescript_data
from pythonapi.sqldata import generate_mysql_data, get_mysql_data
# from types import
from typing import Union
app = FastAPI(docs_url="/api/docs", openapi_url="/api/openapi.json")
# router = APIRouter(prefix="/workspace", tags=["workspace"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
fake= faker.Faker()

title_provider = DynamicProvider(
     provider_name="title",
     elements=["Mr", "Ms", "Mrs"],
)
continent_provider=DynamicProvider(
     provider_name="continent",
     elements=["Asia", "Africa", "Europe","Australia","North America","South America","Antarctica"],
)
gender_provider=DynamicProvider(
     provider_name="gender",
     elements=["Male", "Female"],
)
custom_providers=[title_provider,continent_provider, gender_provider]

for i in custom_providers:
    fake.add_provider(i)


@app.get("/api/healthchecker")
def healthchecker():
    return {"status": "success", "message": "Integrate FastAPI Framework with Next.js"}
tempStore={}

@app.post("/api/GenerateApi")
def generateApiData(
     model: Union[SchemaModel, JSONSchemaModel, MYSQLSchemaModel], 
):
    randomId= random.randint(1, 100)
    url="http://localhost:8000/api/StreamingApi?key="+str(randomId)+"&limit="+str(model.records)
    type_name = ''
    if isinstance(model, SchemaModel):
        type_name = "form"
    elif isinstance(model, JSONSchemaModel):
        type_name = "typescript"
    elif isinstance(model, MYSQLSchemaModel):
        type_name = "mysql"
    tempStore[str(randomId)] = {
        "type": type_name,
        "schema": model.dict()
    }
    return url

@app.get("/api/StreamingApi")
def StreamingApi(key, limit):
    data = tempStore[str(key)]
    type_name = data["type"]
    val = data["schema"] 
    val["records"] = int(limit)
    if type_name == "form":
        return create_schema_data(val).get("data")
    if type_name == "typescript":
        return get_typescript_data(val).get("data")
    if type_name == "mysql":
        return get_mysql_data(val).get("data")
        

@app.post("/api/createSchema")
def createSchemaData(
    model: SchemaModel
):
    return create_schema_data(model.dict())

@app.post("/api/json")
def jsonSchemaData(
    model: JSONSchemaModel
):
    return get_typescript_data(model.dict())

@app.post("/api/mysql")
def mySqlDate(
    model: MYSQLSchemaModel
):
    try:
        return get_mysql_data(model.dict())
    except Exception as e:
        traceback.print_exc()
        return {
            "message": "failed"
        }
    