import apiClient from "./config";

export const loginApiMethod = async({email,password}:{email:string;password:string})=>{
    const {data} = await apiClient.post("/login", {email,password});
    return data;
}