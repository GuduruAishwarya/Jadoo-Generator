
// const { writeFileSync } = require("fs")
// const {isPlainObject} = require("./util/isPalinObject")

import { writeFileSync } from "fs"
import { isPlainObject } from "./isPalinObject"
import * as TJS from "typescript-json-schema";
import { resolve } from "path";

const warningsMap={
    "function type will be ingnored": 1
}

const warningMapReverse= Object.entries(warningsMap).reduce((acc, warning)=>{
    acc[warning[1]]= warning[0]
    return acc
}, {})

function _isValidTypescriptJsonSChema(data: any={}, warnings: Set<number>, tempData: any,isFirstLevel=false){
    if(!isPlainObject(data)){
        console.log("data", data)
        throw new Error("data should be plain object")
    }

    let levelEntities = []
    if(isFirstLevel){
        for(const key in data){
            if(data[key]['type'] == "object" && isPlainObject(data[key]['properties']))
                levelEntities.push(key)
        }
    }else{
        levelEntities = Object.keys(data)
    }

    const removedEntityIndexs: number[] = []
    let k = -1

    for(const entity of levelEntities){
        k++
        if(data[entity].type == "object"){
            let isFunctionType = true;
            if(isPlainObject(data[entity]['properties'])){
                _isValidTypescriptJsonSChema(data[entity]['properties'], warnings, tempData[entity]['properties']) // skiping retrun 
                isFunctionType = false
            }
            if(isPlainObject(data[entity]['additionalProperties'])){
                _isValidTypescriptJsonSChema(data[entity]['additionalProperties'], warnings, tempData[entity]['additionalProperties']) // skiping retrun
                isFunctionType = false
            }
            if(isFunctionType){
                delete tempData[entity]
                removedEntityIndexs.push(k)
                warnings.add(warningsMap["function type will be ingnored"])
            }else{
                // if(tempData[entity].)
                console.log("tempData[entity]", tempData[entity])
                // if(tempData[entity].type == "object" && Object.keys(tempData[entity].properties || {}).length == 0 && Object.keys(tempData[entity].additionalProperties || {}).length == 0 ){
                //     delete tempData[entity]
                //     removedEntityIndexs.push(k)
                // }
            }
        }if(data[entity].type == "array"){
            if(Array.isArray(data[entity]['items'])){
                console.log("items", data[entity]['items'])
                data[entity]['items'].forEach((item, i)=>{
                    _isValidTypescriptJsonSChema(item, warnings, tempData[entity]['items'][i]) // skiping retrun 
                })
            }else
                _isValidTypescriptJsonSChema(data[entity]['items'], warnings, tempData[entity]['items']) // skiping retrun 
        }
        else{
            if(data[entity].type == undefined && data[entity]['$ref'])
            console.log("no type", data[entity])
        }
    }

    return {
        topLevelEntities: levelEntities.filter((_, i)=> !removedEntityIndexs.includes(i))
    }

}

export function isValidTypescriptJsonSChema(data: any={}){
    if(!isPlainObject(data)){
        throw new Error("data should be plain object")
    }
    if(!data['definitions']){
        throw new Error("data must has definitions")
    }
    try{
        const tempData= JSON.parse(JSON.stringify(data))
        const warnings=new Set<number>()
        const res= _isValidTypescriptJsonSChema(data.definitions, warnings, tempData.definitions, true)
        const tempDataString = JSON.stringify(tempData)
        // writeFileSync("./finaltemp.json", tempDataString)
        return {
            ...res,
            warnings:  [...warnings.values()].map((key)=> warningMapReverse[key]),
            data: tempDataString
        }
    }catch(err){
        console.log('err', err)
        return {
            topLevelEntities: [],
            warnings: [],
            data: ""
        }
    }
}


export async function getTsToJsonSchema(tscode: string){
    // const compilerOptions = {
    //     target: "ES5",
    //     module: "CommonJS"
    //   }

    const tempDir = process.env.tempDir

    const fileName = 'temp2.ts'
    writeFileSync(resolve(tempDir!, fileName), tscode)
    const settings: TJS.PartialArgs = {
        required: true,
        ref: false,
        constAsEnum: true,
    };    
    const compilerOptions: TJS.CompilerOptions = {
        strictNullChecks: true,
    };
    
    const program = TJS.getProgramFromFiles(
      [resolve(tempDir!, fileName)],
      compilerOptions,
    );

    const schema = TJS.generateSchema(program, "*", settings);
    return schema
}