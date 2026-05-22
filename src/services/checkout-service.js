import { addOrder, getOrderById, getOrderByUserId } from "./fetch"
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

export const useGetOrdersByUserId= (userId)=>{
    return useQuery({
        queryKey:["orders",userId],
        queryFn: ()=>getOrderByUserId(userId)
    })
}