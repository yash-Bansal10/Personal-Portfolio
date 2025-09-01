
import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Skill } from '../types';
import SkillPill from './SkillPill';
import { JavascriptIcon, ReactIcon, NodeIcon, TypescriptIcon, FigmaIcon, TailwindIcon, JupyterIcon } from './icons/SkillIcons';

// An array of skill objects, each containing a name and an icon component.
const skills: Skill[] = [
    { name: 'JavaScript', Icon: JavascriptIcon },
    { name: 'TypeScript', Icon: TypescriptIcon },
    { name: 'React', Icon: ReactIcon },
    { name: 'Node.js', Icon: NodeIcon },
    { name: 'Tailwind CSS', Icon: TailwindIcon },
    { name: 'Figma', Icon: FigmaIcon },
    { name: 'Jupyter Notebook', Icon: JupyterIcon },
];

// Framer Motion variants for the container element, enabling staggered animations for children.
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1, // Each child will animate 0.1s after the previous one.
        },
    },
};

// Framer Motion variants for individual items within the container.
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/**
 * The "About Me" section, featuring a biography and a grid of skills.
 * Animations are triggered when the section scrolls into view.
 */
const About: React.FC = () => {
    const controls = useAnimation();
    // `useInView` is a hook from `react-intersection-observer` that detects when the component is in the viewport.
    const [ref, inView] = useInView({
        triggerOnce: true, // The animation will only trigger once.
        threshold: 0.2,    // Trigger when 20% of the component is visible.
    });

    // Effect to start the animation when `inView` becomes true.
    useEffect(() => {
        if (inView) {
            controls.start('visible');
        }
    }, [controls, inView]);

    return (
        <motion.section
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={containerVariants}
            className="py-16"
        >
            <motion.h2 variants={itemVariants} className="text-4xl font-bold text-center mb-12">About Me</motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                {/* Left column for the biography */}
                <motion.div variants={itemVariants}>
                    <p className="text-gray-300 leading-relaxed text-lg">
                        Hello! I'm Yash Bansal, an AI and ML Explorer and a CSE AI student at KIET, Ghaziabad. I am passionate about building intelligent applications and exploring the frontiers of technology.
                        <br /><br />
                        My journey is driven by a curiosity for how machines learn and a desire to create impactful, data-driven solutions to complex problems. I specialize in full-stack development,exploring AI & ML, learning DSA but I'm always eager to dive into new technologies and expand my skillset.
                        <br /><br />
                        Alongside my technical journey, I'm proud to have secured AIR-714 in the NDA 2 2024 Examination, reflecting my Leadership, Discipline, Problem Solving, Resilience, Team Collaboration and Effective Communication skills.
                    </p>
                </motion.div>
                {/* Right column for the skills grid */}
                <motion.div variants={itemVariants} className="grid grid-cols-3 lg:grid-cols-4 gap-4">
                    {skills.map((skill) => (
                        <SkillPill key={skill.name} skill={skill} />
                    ))}
                </motion.div>
            </div>
        </motion.section>
    );
};

export default About;
