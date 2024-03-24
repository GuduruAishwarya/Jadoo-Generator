import { isPlainObject } from "./isPalinObject";

function _jsonToJsonSchema(obj :Record<string, any> ={}, output: Record<string,any> ={}){
    for(const key in obj){
        const value = obj[key]
        const value_type = typeof value
        if(value_type == "object"){
            if(Array.isArray(value)){
                output[key] = {
                    type: "array",
                    itmes:{}
                }
                

            }else{
                output[key] = {
                    type: 'object',
                    properties: {}
                }
                _jsonToJsonSchema(value, output[key].properties)
            }
        }else if( ['string', "number", "boolean"].includes(value_type)){
            output[key]={
                type: value_type
            }
        }
    }
    return output
}

export function jsonToJsonSchema(obj={}){
    if(!isPlainObject(obj)){
        throw Error("schema object must be plain object")
    }
    const output = {
        "definitions":{
            "schema":{
                
            }
        }
    }
    return _jsonToJsonSchema(obj, output.definitions.schema);
}