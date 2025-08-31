
import React, { Suspense, useEffect, useState, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { motion, useAnimation } from 'framer-motion';

/**
 * A component that creates a "typewriter" effect, cycling through a list of roles.
 */
const Typewriter: React.FC<{ roles: string[] }> = ({ roles }) => {
    const [roleIndex, setRoleIndex] = useState(0); // Index of the current role in the array.
    const [displayedText, setDisplayedText] = useState(''); // The text currently visible on screen.
    const [isDeleting, setIsDeleting] = useState(false); // Whether the animation is deleting or typing.
    
    useEffect(() => {
        const handleTyping = () => {
            const currentRole = roles[roleIndex];
            // If deleting, remove characters until the string is empty.
            if (isDeleting) {
                if (displayedText.length > 0) {
                    setDisplayedText(prev => prev.substring(0, prev.length - 1));
                } else {
                    // Once empty, switch to typing the next role.
                    setIsDeleting(false);
                    setRoleIndex((prev) => (prev + 1) % roles.length);
                }
            } else {
                // If typing, add characters until the full role is displayed.
                if (displayedText.length < currentRole.length) {
                    setDisplayedText(prev => currentRole.substring(0, prev.length + 1));
                } else {
                    // Once complete, wait 2 seconds then start deleting.
                    setTimeout(() => setIsDeleting(true), 2000);
                }
            }
        };

        const typingSpeed = isDeleting ? 40 : 80;
        const timeout = setTimeout(handleTyping, typingSpeed);
        // Cleanup function to clear the timeout on component re-render.
        return () => clearTimeout(timeout);
    }, [displayedText, isDeleting, roleIndex, roles]);

    return (
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 min-h-[48px] md:min-h-[56px]">
            {displayedText}
            <span className="animate-pulse">|</span>
        </span>
    );
};

/**
 * Generates random 3D coordinates for points on the surface of a sphere.
 * @param count The number of points to generate.
 * @param radius The radius of the sphere.
 * @returns A Float32Array of positions [x1, y1, z1, x2, y2, z2, ...].
 */
const generateSpherePositions = (count: number, radius: number): Float32Array => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        // Use spherical coordinates to generate a random point on a sphere's surface.
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * 2 * Math.PI;

        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);
    }
    return positions;
};

/**
 * A Three.js component that renders an animated sphere of particles.
 */
const StarSphere: React.FC<any> = (props) => {
    const ref = useRef<any>(null);
    // `useMemo` ensures the sphere's positions are calculated only once.
    const spherePositions = useMemo(() => generateSpherePositions(1667, 1.2), []);

    // `useFrame` is a react-three-fiber hook that runs on every rendered frame.
    useFrame((state, delta) => {
        if(ref.current) {
            // Animate the rotation and position of the sphere for a subtle floating effect.
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
            ref.current.position.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
            ref.current.position.y = Math.cos(state.clock.elapsedTime * 0.2) * 0.2;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={spherePositions} stride={3} frustumCulled {...props}>
                <PointMaterial
                    transparent
                    color="#4dd0e1"
                    size={0.004}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
};

/**
 * The Hero section component, featuring the main heading, typewriter effect, and 3D background.
 */
const Hero: React.FC = () => {
    // Framer Motion animation controls.
    const controls = useAnimation();

    // Trigger the enter animation when the component mounts.
    useEffect(() => {
      controls.start(i => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
      }));
    }, [controls]);

    return (
        <section className="min-h-screen flex items-center justify-center relative">
            {/* The 3D particle sphere is rendered in the background. */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 1] }}>
                    <Suspense fallback={null}>
                        <StarSphere />
                    </Suspense>
                </Canvas>
            </div>
            {/* The text content is layered on top. */}
            <div className="text-center z-10 pt-20">
                <motion.h1 
                    custom={0}
                    initial={{ opacity: 0, y: 20 }}
                    animate={controls}
                    className="text-6xl md:text-8xl font-black tracking-tight text-white mb-4"
                >
                    Yash Bansal
                </motion.h1>
                <motion.h2 
                    custom={1}
                    initial={{ opacity: 0, y: 20 }}
                    animate={controls}
                    className="text-2xl md:text-4xl font-medium text-gray-300"
                >
                    <Typewriter roles={["AI and ML Explorer", "KIET Ghaziabad Student", "AIR 714 NDA 2 2024"]} />
                </motion.h2>
            </div>
        </section>
    );
};

export default Hero;