'use client'
import { ReactLenis } from 'lenis/react';

const Anime = ({ children }) => {
    return (
        <ReactLenis
            root
            options={{
                lerp: 0.1,         // স্ক্রলিং কতটা স্মুথ হবে (0 to 1)
                duration: 1.5,     // স্ক্রল ডিউরেশন
                smoothWheel: true,
                autoRaf: true,     // এটি v1.3.x এর বড় সুবিধা, আলাদা requestAnimationFrame লাগে না
            }}
        >
            {children}
        </ReactLenis>
    )
}

export default Anime