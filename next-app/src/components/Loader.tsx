import { createContext, useContext, useState } from "react";
import { InfinitySpin } from "react-loader-spinner";

export const LoaderContext = createContext<{
    loading: boolean;
    setLoading: (val: boolean) => void;
}>({
    loading: true,
    setLoading: (val: boolean)=> {} 
})

export const LoaderProvider =({children})=>{
    const [loading, setLoading] = useState(false);

    return(
    <LoaderContext.Provider value={{
        loading,
        setLoading
    }}>
        {children}
    </LoaderContext.Provider>)
}

export function Loader(){
    const loader = useContext(LoaderContext)
    if(loader.loading)
        return (<div className="loader-wrapper">
        <div>
        <InfinitySpin
            width='200'
            color="#3C0064"
        />
        </div>
    </div>)
    return null
}