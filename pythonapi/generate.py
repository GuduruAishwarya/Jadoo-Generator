
import random
import traceback
from faker import Faker
from fastapi import  Response, status
import json
from pythonapi.methodsMapping import methodsMapping
from re import sub

fake = Faker()

typewiseMethods = {}
allkeys = []

for key in methodsMapping:
    typewiseMethods[methodsMapping[key]["datatype"]] = typewiseMethods.get(methodsMapping[key]["datatype"], {})
    typewiseMethods[methodsMapping[key]["datatype"]][key] = methodsMapping[key]
    allkeys.append(key)
    allkeys = allkeys + [key] + methodsMapping[key].get("keys", [])


def fakerMethod(format: str, prop_type, prop: str, prop_value, *args):
    prop = prop.lower()
    method_value = None
    if "method_value" in prop_value:
        method_value = prop_value["method_value"]
    else:
        if format:
            options = methodsMapping.get(format.lower(), None)
            if options and options["datatype"] == prop_type:
                method_value = options
                # ars: list = options["args"] if "args" in options else []
                # ars.extend(args)
                # return getattr(fake, str(options["method"]))(*ars)
        elif prop_type in typewiseMethods:
            prop = sub(r'[^a-zA-Z]', '', prop)
            prop_type_methods = typewiseMethods[prop_type]
            if prop_type_methods.get(prop, None):
                method_value = prop_type_methods[prop]
            for method_name in prop_type_methods:
                keys = prop_type_methods[method_name].get("keys", [])
                if prop in keys:
                    method_value = prop_type_methods[method_name]
                    break
        elif prop_type in allkeys: # to support js-doc type annotation in comment
            method_value = methodsMapping.get(prop_type, None)
            if not method_value:
                for method_name in methodsMapping:
                    keys = methodsMapping[method_name].get("keys", [])
                    if prop_type in allkeys:
                        method_value = methodsMapping[method_name]
    prop_value["method_value"] = method_value # cache method value to reduce method resolution
    if method_value:
        # prop("method_value", method_value)
        final_args = method_value.get("args", [])
        return getattr(fake, method_value["method"])(*final_args)
    return None


def is_simple_type(type_in_string: str):
    if type_in_string in ["string", "number", "boolean", "integer", "float",
                          "double"] + allkeys: # allkeys to support js-doc type annotation
        return True
    return False


def generate_simple_type(prop_value, prop):
    prop_type = prop_value["type"]
    # if prop_type == "string":
    # if prop_value.get("format", None):
    val = fakerMethod(prop_value.get("format", None), sub(r'[^a-zA-Z]', '', prop_type), prop, prop_value)
    if val != None:
        return val
    if prop_type in ["integer", "float", "double"]:
        min_value = prop_value.get("minimum", -1 * (1 << 8))
        max_value = prop_value.get("maximum", (1 << 8))
        if prop_type == "integer":
            return random.randint(min_value, max_value)
        return round(random.uniform(min_value, max_value), 2)
    if prop_type == "string":
        return fake.word()
    if prop_type == "number":
        return fake.pyint()
    if prop_type == "boolean":
        return fake.pybool()


def generate(object_definition: dict, output: dict):
    properties = object_definition.get("properties", {})
    for prop in properties:
        prop_value = properties[prop]
        prop_type = prop_value['type']
        if prop_type == "object":
            output[prop] = {}
            generate(prop_value, output[prop]) 
        elif prop_type == "array":
            items = prop_value["items"]
            output[prop] = []
            items_values = output[prop]
            if isinstance(items, list):
                for item in items:
                    item_type = item["type"]
                    if is_simple_type(item_type):
                        items_values.append(generate_simple_type(item, prop))
                    elif item_type == "object":
                        val = {}
                        generate(item, val)
                        items_values.append(val)
                    # if item_type == "string":
                    #     items_values.append("stirng")
                    # elif item["type"] == "number":
                    #     items_values.append(5)
                    # elif item["type"] == "boolean":
                    #     items_values.append(True)
            elif isinstance(items, dict):
                if is_simple_type(items["type"]):
                    times = 1
                    while times > 0 or random.random() > 0.7:
                        items_values.append(generate_simple_type(items))
                        times = times - 1
        else:
            if is_simple_type(prop_type):
                output[prop] = generate_simple_type(prop_value, prop)
            # if prop_type == "string":
            #     if prop_value.get("format", None):
            #         output[prop] = fakerMethod(prop_value["format"])
            #     if not output.get(prop, None):
            #         output[prop] = fake.sentence()
            # if prop_type == "number":
            #     output[prop] = 10
            # if prop_type == "boolean":
            #     output[prop] = True
            # if prop_type == "integer":
            #     min_value = prop_value.get("minimum", None)
            #     max_value = prop_value.get("maximum", None)
            #     val = 0
            #     if min_value and max_value:
            #         val = random.randint(min_value, max_value)
            #     # elif min_value:
            #     #     val = random.randrange()
            #     # if min_value and max_value:
            #     output[prop] = val
            # # if prop_type == ""
    additional_properties = object_definition.get("additionalProperties", None)
    if additional_properties:
        times = 2
        while times > 0 or random.random() < 0.4:
            key = fake.word()
            if is_simple_type(additional_properties["type"]):
                output[key] = generate_simple_type(additional_properties, key)
            else:
                output[key] = {}
                generate(additional_properties, output[key])
            times = times - 1


def generate_data(json_schema, base_name: str, no_records: int):
    object_definition = json_schema.get(base_name, None)
    if object_definition is None:
        raise Exception("Invalid base name")
    object_type = object_definition.get("type", None)
    if object_type is None or object_type != "object":
        raise Exception("not valid schema")
    data = []
    # print("object_definition", object_definition)
    try:
        while no_records > 0:
            output = {}
            generate(object_definition, output)
            data.append(output)
            no_records -= 1
    except Exception as genexp:
        traceback.print_exc()
    return data


def create_schema_fakerMethod(method, *args):
    return getattr(fake, method)(*args)


def get_method(method_name):
    method = methodsMapping.get(method_name, None)
    method_name = method_name.lower()
    if method is None:
        method = methodsMapping.get(method_name, None)
    if method:
        return method
    for m_name in methodsMapping:
            if method_name in methodsMapping[m_name].get("keys", []):
                return methodsMapping[m_name]
    return None
    

def create_schema_generate_data(datatype, generate):
    data=get_method(datatype)
    args=data.get("args")
    method=data.get("method")
    if(args):
        if(type(args) is list and len(args)>1):
            min,max=args
            return create_schema_fakerMethod(method,min,max) if generate else None
        else:
            return create_schema_fakerMethod(method,args[0]) if generate else None
    else:
        return create_schema_fakerMethod(method) if generate else None
    
class DummyVal(object):
    def __init__(self, prop, val, sch, index, datatype) -> None:
        self.val = val
        self.sch = sch
        self.prop = prop
        self.index = index
        self.datatype = datatype
        self.called_once = False

    def set_value(self):
        if(self.called_once):
            self.val[self.prop] = create_schema_generate_data(self.datatype, True)
            return self.val[self.prop]
        self.called_once = True
        self.val[self.prop] = eval(self.sch[self.index]["formula"], None,  self)
        return self.val[self.prop]
    
    def __getitem__(self, attr):
        self.val[attr] = self.val[attr].set_value() if isinstance(self.val[attr], DummyVal) else self.val[attr]
        return self.val[attr]


def create_schema_data(model, response=Response):
    try:
        res=[]
        for i in range(0, model["records"]):
            row={}
            j = -1
            for record in model["data"]:
                j = j+1
                count=len(record["dataType"])
                for datatype in record["dataType"]:
                    generate=random.random() <= (1-int(record["nulls"])/100)
                    field_name= record["fieldName"] if count==1 else record["fieldName"]+"."+str(datatype)
                    if (record["formula"] != ''):
                        row[field_name] = DummyVal(field_name, row,model["data"], j, datatype)
                    else:
                        row[field_name] = create_schema_generate_data(datatype, generate)
               
            for key in row:
                if isinstance(row[key], DummyVal):
                    row[key].set_value() 
            res.append(row)
        # print("RES:", res)
        response.status_code = status.HTTP_201_CREATED
        return {"success": True ,"data" :res }
    except Exception as e:
        print(model,"ERRRRRR:", e)
        traceback.print_exc()
        json_str = json.dumps({"success": False ,"error" : e}, indent=4, default=str)
        return Response(content=json_str,status_code=400, media_type="application/json")


def get_typescript_data(model):
    try:
        json_data = model["data"]
        data = json.loads(json_data)
        definitions = data["definitions"]
        output = generate_data(definitions, model["object_name"], model["records"])
        return {
            "message": 'done',
            "data": output
        }
    except Exception as e:
        print("ex", e)
        return {
            "message": "failed"
        }