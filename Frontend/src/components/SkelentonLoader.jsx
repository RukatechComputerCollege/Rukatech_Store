import React from 'react'

const SkelentonLoader = () => {
  return (
    <div className='w-full h-full bg-[#ffd8bddd] backdrop-blur-lg'>
        <div className='w-full h-full flex flex-col items-center justify-center'>
            <div class="w-32 h-32 relative flex items-center justify-center">
            <div
                class="absolute inset-0 rounded-xl bg-[#fa823256] blur-xl animate-pulse"
            ></div>

            <div class="w-full h-full relative flex items-center justify-center">
                <div
                class="absolute inset-0 rounded-xl bg-gradient-to-r from-[#2DA5F3] via-[#FA8232] to-[green] animate-spin blur-sm"
                ></div>

                <div
                class="absolute inset-1 bg-[#FFE7D6] rounded-lg flex items-center justify-center overflow-hidden"
                >
                <div class="flex gap-1 items-center">
                    <div
                    class="w-1.5 h-12 bg-[#2DB224] rounded-full animate-[bounce_1s_ease-in-out_infinite]"
                    ></div>
                    <div
                    class="w-1.5 h-12 bg-blue-500 rounded-full animate-[bounce_1s_ease-in-out_infinite_0.1s]"
                    ></div>
                    <div
                    class="w-1.5 h-12 bg-[#FA8232] rounded-full animate-[bounce_1s_ease-in-out_infinite_0.2s]"
                    ></div>
                    <div
                    class="w-1.5 h-12 bg-purple-500 rounded-full animate-[bounce_1s_ease-in-out_infinite_0.3s]"
                    ></div>
                </div>

                <div
                    class="absolute inset-0 bg-gradient-to-t from-transparent via-blue-500/10 to-transparent animate-pulse"
                ></div>
                </div>
            </div>

            <div
                class="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 rounded-full animate-ping"
            ></div>
            <div
                class="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full animate-ping delay-100"
            ></div>
            <div
                class="absolute -bottom-1 -left-1 w-2 h-2 bg-cyan-500 rounded-full animate-ping delay-200"
            ></div>
            <div
                class="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-ping delay-300"
            ></div>
            </div>
        </div>
    </div>
  )
}

export default SkelentonLoader