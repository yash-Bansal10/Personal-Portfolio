
import React from 'react';
import { motion } from 'framer-motion';

/**
 * A component that creates a subtle, animated "aurora" style background.
 * It uses blurred, colored divs that slowly move and transform over time.
 */
const AuroraBackground: React.FC = () => {
    return (
        <div className="absolute inset-0 overflow-hidden z-0">
            {/* First colored blob */}
            <motion.div
                className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/30 rounded-full filter blur-3xl"
                animate={{
                    // An array of values to cycle through for the x and y coordinates, scale, and rotation.
                    x: [0, 100, 0, -50, 0],
                    y: [0, 50, 100, 50, 0],
                    scale: [1, 1.2, 1, 1.1, 1],
                    rotate: [0, 0, 90, 0, 0],
                }}
                transition={{
                    // A long duration and infinite repeat create a slow, continuous animation.
                    duration: 25,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "mirror", // The animation will play forwards, then backwards.
                }}
            />
            {/* Second colored blob */}
            <motion.div
                className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/30 rounded-full filter blur-3xl"
                animate={{
                    x: [0, -100, 0, 50, 0],
                    y: [0, -50, -100, -50, 0],
                    scale: [1, 1.1, 1.2, 1, 1],
                    rotate: [0, 90, 0, 90, 0],
                }}
                transition={{
                    duration: 20,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "mirror",
                }}
            />
        </div>
    );
};

export default AuroraBackground;
