import { CheckCircle2 } from 'lucide-react'
import React from 'react'
import { useState } from 'react'

function OrderProgressBar({initialStage}) {
    const [currentStage, setCurrentStage]=useState(initialStage)
    const stages=[
        "pending",
        "paid",
        "processing",
        "shipping",
        "delivered"
    ]
  return (
    <div className='flex w-full px-0 md:px-10'>
        {stages.map((stage,index)=>(
            <div key={index} className='flex w-full flex-col gap-4 justify-center items-center'>
                <div
                className={`${stages.indexOf(currentStage)>=index?"bg-[#EAB308]":"bg-white/10"} w-full  h-[3px]`}
                />
                <CheckCircle2 fill={`${stages.indexOf(currentStage)>=index?'#EAB308':"white/10"}`} />
                <p className='capitalize text-xs md:text-sm px-1 '>{stage}</p>
            </div>
        ))}
    </div>
  )
}

export default OrderProgressBar