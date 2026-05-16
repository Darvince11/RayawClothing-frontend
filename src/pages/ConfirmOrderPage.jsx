import React from 'react'
import OrderImage from "../assets/order.svg"
import OrderProgressBar from '../components/ui/order-progress-bar'
import ReactTypingEffect from 'react-typing-effect'
import { useGetOrderById } from '../services/checkout-service'
import { useParams } from 'react-router-dom'
import { Skeleton } from '../components/ui/skeleton'

function ConfirmOrderPage() {
    const { id } = useParams();
    const {data,isLoading}= useGetOrderById(id)
    const date=new Date(data?.created_at)
    
    return (
    <div className='flex flex-col gap-10 px-6 mt-4 mx-auto max-w-7xl'>
        <div className="bg-[#EAB308] overflow-hidden relative flex justify-between py-8 px-6 md:px-20 lg:px-32 rounded-[30px] items-center">
            {/* cirlces */}
            <div 
            className='absolute z-0 rounded-full w-[53px] h-[53px] bg-[#CC8C00] left-[2.5%] top-[-2%]'
            />
            <div 
            className='absolute z-0 rounded-full w-[102px] h-[102px] bg-[#CC8C00] left-[-1.5%] top-[11%]'
            />
            <div 
            className='absolute z-0 rounded-full w-[169px] h-[169px] bg-[#CC8C00] left-[-4%] top-[35%]'
            />
            <div 
            className='absolute z-0 rounded-full w-[337px] h-[337px] bg-[#CC8C00] left-[-2%] top-[60%]'
            />
            <div className='relative z-10 flex flex-col gap-3 w-full max-w-[300px] leading-snug'>
                <ReactTypingEffect
                    text={["Order has been received"]}
                    cursor=' '
                    eraseDelay={2000}
                    typingDelay={500}
                    speed={70}
                    eraseSpeed={70}
                    displayTextRenderer={(text, i) => {
                    return (
                        <h1 className='text-[20px] md:text-[40px] font-bold texte-white'>
                            {text.split("").map((char,index)=>(
                                <span key={index} className={`${index>=9 && index<=13?"text-black":"text-white"}`}>
                                    {char}
                                </span>
                            ))}
                        </h1>
                    );
                    }}        
                />
                <p className='text-sm text-black'>Thanks for shopping with us—your items will be on their way soon.</p>
            </div>
            <div className='relative hidden md:block'>
                <div
                className='absolute left-[10%] rounded-full w-[282px] h-[282px] bg-[#CC8C00]'
                />
                <img
                className='w-[360px] h-[284px] relative z-10'
                src={OrderImage} alt="img" />
            </div>
        </div>
        <OrderProgressBar initialStage={data?.status} isLoading={isLoading}/>
        <div className="flex flex-col gap-4 bg-[#373737]/50 p-6 rounded-2xl border border-[#212121]">
           {isLoading &&(
            <>
                <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-[200px]" />
                    <Skeleton className="h-6 w-[100px]" />
                </div>
                <div className="flex flex-col gap-4">
                    {Array.from({ length: 4 }).map((item,index)=>(
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-end" key={index}>
                            <div className="flex gap-6 items-end">
                                <Skeleton className="w-[92px] h-[98px]" />
                                <div>
                                    <Skeleton className="w-[200px] h-6 mb-4"/>
                                    <div className="flex gap-4 text-sm text-white/50">
                                        <Skeleton className="w-7 h-4"/>
                                        <Skeleton className="w-7 h-4"/>
                                        <Skeleton className="w-7 h-4"/>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <Skeleton className="w-[100px] h-4 mb-4"/>
                                <Skeleton className="w-[100px] h-4"/>
                            </div>
                        </div>
                    ))}
                </div>
            </>
           )}
           {!isLoading && (
            <>
                 <div className="flex justify-between items-center">
                    <p className="text-[20px] md:text-[32px] font-bold text-white">
                        ORDER ID: <span className="text-white/50">OD-1U345E</span>
                    </p>
                    <p className="text-[16px] text-white/50">{date.toLocaleDateString()}</p>
                </div>
                <div className="flex flex-col gap-4">
                    {data?.order_items.map((item,index)=>(
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-end" key={index}>
                            <div className="flex gap-6 items-end">
                                <div className="w-[92px] h-[98px] bg-gray-100 flex-shrink-0">
                                    <img 
                                    src={item.image_url} 
                                    alt="img"
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 mix-blend-multiply"
                                    />
                                </div>
                                <div>
                                    <p className="text-white text-[16px] mb-[15px]">{item.name}</p>
                                    <div className="flex gap-4 text-sm text-white/50">
                                        <p>Color: {item.color}</p>
                                        <p>Size: {item.size}</p>
                                        <p>QTY: {item.quantity}</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p className="text-white text-sm mb-[15px]">Price: GHS {item.price.toFixed(2)}</p>
                                <p className="text-white text-sm">Total Price: GHS {item.price * item.quantity}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </>
           )}
        </div>
        
    </div>
  )
}

export default ConfirmOrderPage