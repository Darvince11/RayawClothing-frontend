import { useQuery } from "@tanstack/react-query"
import { getPaymentHistoryByUserId } from "./fetch"

export const useGetPaymentHistoryByUserId = (user_id) => {
    return useQuery({
        queryKey: ['paymentHistory', user_id],
        queryFn: () => getPaymentHistoryByUserId(user_id)
    })
}