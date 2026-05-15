import { addOrder, getOrderById } from "./fetch"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useAddOrder= ()=>{
    return useMutation({
        mutationFn: (orderData)=>{
            return addOrder(orderData)
        }
    })
}

export const useGetOrderById= (orderId)=>{
    return useQuery({
        queryKey:["order",orderId],
        queryFn: ()=>getOrderById(orderId)
    })
}