import { useMutation } from "@tanstack/react-query"
import { updateUserDetails } from "./fetch"

export const useUpdateUserDetails=()=>{
    return useMutation({
        mutationFn:(user_data)=> updateUserDetails(user_data)
    })
}