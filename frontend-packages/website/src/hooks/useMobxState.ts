import useIsBrowser from "@docusaurus/useIsBrowser"
import { useRef } from "react";

type TStateInitFunction<T> = ()=>T

export const useMobxState = <T extends {}>(initFunc: TStateInitFunction<T>):T|undefined=>{
    const  isBrowser= useIsBrowser();
    const stateRef = useRef<T>()
    if(isBrowser && !stateRef.current){
        stateRef.current=initFunc();
    }
    return stateRef.current;
}