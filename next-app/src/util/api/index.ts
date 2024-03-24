import axios from "axios";

export const axiosWraper={
    getPythonAPIInstance: function(){
        const pythonApi = process.env.pythonApi
        const instance = axios.create({
            baseURL: pythonApi,
            // timeout: 3000,
            headers: { "Content-Type": "application/json" },
          });
        return instance
    }
}