import { photographySignUpRequest } from "../../interfaces/photographySignUpRequest";
import apiClient from "../apiClient";

export const photographySignUp = async({password, email, phoneNumber, photographyCompanyName}:photographySignUpRequest) => {
    await apiClient.post('/User/CreatePhotographyCompany',{ 
        username: email,
        password, 
        email, 
        phoneNumber, 
        photographyCompanyName
    })
}