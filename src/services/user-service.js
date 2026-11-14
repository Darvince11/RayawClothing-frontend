import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getCurrentUserAPI, updateUserDetails } from "./fetch"

export const CURRENT_USER_KEY = ['currentUser']

// The logged-in user's details, fetched from the database (GET /auth/user)
export const useCurrentUser = (enabled) => {
    return useQuery({
        queryKey: CURRENT_USER_KEY,
        queryFn: getCurrentUserAPI,
        enabled,
        staleTime: 1000 * 60 * 5,
        retry: false,
    })
}

export const useUpdateUserDetails=()=>{
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:(user_data)=> updateUserDetails(user_data),
        // Re-read the profile from the database so the UI shows what was saved
        onSuccess: () => queryClient.invalidateQueries({ queryKey: CURRENT_USER_KEY }),
    })
}
