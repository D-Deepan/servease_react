import { createContext, useState } from "react";

export const Authcontext = createContext({});

export const Authprovider = ({children}) =>{
    const[ auth ,setauth ] = useState({});
    
    return (
        <Authcontext.Provider value= {{auth, setauth}}>
             {children}
        </Authcontext.Provider>
        )}
export default Authcontext ;