
import React from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Project } from '../types';

interface ProjectCardProps {
    project: Project;
    // An optional callback to handle opening a modal instead of navigating to a URL.
    onOpen?: () => void;
}

// Framer Motion variants for the card's enter animation.
const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

/**
 * A card component to display a single project.
 * It features a 3D tilt effect on mouse hover.
 */
const ProjectCard: React.FC<ProjectCardProps> = ({ project, onOpen }) => {
    // `useMotionValue` creates a motion value to track the mouse position.
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // `useSpring` creates a spring animation that smoothly follows the motion value.
    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    // `useTransform` maps the mouse position to a rotation value.
    // As the mouse moves across the card, the rotation angle changes.
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7.5deg', '-7.5deg']);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7.5deg', '7.5deg']);

    // Event handler to update the mouse position motion values.
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        // Normalize mouse position to a range of -0.5 to 0.5.
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    // Event handler to reset the rotation when the mouse leaves the card.
    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };
    
    // Conditionally renders either a button (to open a modal) or a link for the "Live Demo".
    const LiveDemoButton = () => {
        if (onOpen) {
            // If an `onOpen` handler is provided, render a button that triggers it.
            return (
                <button onClick={onOpen} className="flex-1 text-center py-2 px-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors w-full">
                    Live Demo
                </button>
            );
        }
        // Otherwise, render a standard anchor tag that opens a new tab.
        return (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2 px-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                Live Demo
            </a>
        );
    };

    return (
        <motion.div
            variants={itemVariants}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d', // Necessary for 3D transformations.
            }}
            className="w-full"
        >
            <div
                style={{
                    transform: 'translateZ(75px)', // Pushes the content forward for a more pronounced 3D effect.
                    transformStyle: 'preserve-3d',
                }}
                className="bg-gray-900/30 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl transition-all duration-300 hover:border-cyan-400/50 flex flex-col h-full"
            >
                <img src={project.imageUrl} alt={project.title} className="rounded-lg mb-4 w-full h-48 object-cover" style={{transform: 'translateZ(50px)'}}/>
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-400 mb-4 text-sm flex-grow">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                        <span key={tag} className="bg-cyan-400/10 text-cyan-300 text-xs font-medium px-2.5 py-1 rounded-full">
                            {tag}
                        </span>
                    ))}
                </div>
                <div className="mt-auto pt-4">
                    {/* Conditionally render the button layout */}
                    {project.specialButton ? (
                        // If a specialButton is defined, render a single, prominent button.
                        <a 
                            href={project.specialButton.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="w-full block text-center py-3 px-4 bg-cyan-500/80 rounded-lg hover:bg-cyan-500 transition-colors font-semibold transform hover:scale-105"
                        >
                            {project.specialButton.text}
                        </a>
                    ) : (
                        // Otherwise, render the default two-button layout.
                        <div className="flex gap-4">
                            <LiveDemoButton />
                            <a href={project.codeUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2 px-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                                View Code
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ProjectCard;