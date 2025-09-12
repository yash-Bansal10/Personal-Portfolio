import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Project } from '../types';
import ProjectCard from './ProjectCard';

interface ProjectsProps {
    // A callback function passed from the App component to open a specific modal.
    onOpenModal: (modalType: 'ecosystem' | 'calculator' | 'meals') => void;
}

// An array of project data objects. This serves as the "database" for the projects section.
const projectsData: Project[] = [
    {
        id: 1,
        title: 'Ecosystem Evolution Simulator',
        description: 'A simulation where digital creatures evolve. Click to spawn creatures and watch them compete for food, reproduce, and adapt over time through mutation. The live demo is an interactive explainer.',
        imageUrl: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        tags: ['JavaScript', 'HTML', 'CSS', 'Canvas API', 'Chart.js'],
        liveUrl: '#',
        codeUrl: 'https://github.com/yash-Bansal10/Ecosystem-Evolution-Simulator',
        modalType: 'ecosystem', // Specifies that this project's demo opens the 'ecosystem' modal.
    },
    {
        id: 2,
        title: 'Calculator',
        description: 'A functional and stylish calculator. The live demo opens an interactive explainer detailing its construction with HTML, CSS, and JavaScript logic.',
        imageUrl: 'https://images.pexels.com/photos/7176319/pexels-photo-7176319.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        tags: ['JavaScript', 'HTML', 'CSS'],
        liveUrl: '#',
        codeUrl: 'https://github.com/yash-Bansal10/My-Calculator',
        modalType: 'calculator',
    },
    {
        id: 3,
        title: 'Meals4All - Food Donation Platform',
        description: 'A comprehensive multi-page website concept for a food donation initiative. The live demo opens an interactive explainer showcasing the platform\'s design and features.',
        imageUrl: 'https://images.pexels.com/photos/6995202/pexels-photo-6995202.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        tags: ['HTML', 'CSS'],
        liveUrl: '#',
        codeUrl: 'https://github.com/yash-Bansal10/Meals4All_Food_Donation_Website',
        modalType: 'meals',
    },
     {
        id: 4,
        title: 'My all AI & ML Projects',
        description: 'A collection of my projects exploring Artificial Intelligence and Machine Learning. Click below to see my work in this exciting field on GitHub.',
        imageUrl: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        tags: ['Python', 'TensorFlow', 'Random Forest Algorithm', 'Scikit-learn','Reinforcement Learning'],
        specialButton: {
            text: 'View My AI & ML Projects',
            url: 'https://github.com/yash-Bansal10'
        },
    },
];

// Framer Motion variants for staggering the animation of project cards.
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
};

/**
 * The "My Projects" section, which displays a grid of project cards.
 * It uses `react-intersection-observer` to trigger animations on scroll.
 */
const Projects: React.FC<ProjectsProps> = ({ onOpenModal }) => {
    const controls = useAnimation();
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    // Start animations when the section comes into view.
    useEffect(() => {
        if (inView) {
            controls.start('visible');
        }
    }, [controls, inView]);

    return (
        <section className="py-16">
            <motion.h2 
              initial={{opacity: 0, y: 20}} 
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true, amount: 0.5}}
              transition={{duration: 0.5}}
              className="text-4xl font-bold text-center mb-12">
              My Projects
            </motion.h2>
            <motion.div 
                ref={ref}
                initial="hidden"
                animate={controls}
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
                {/* Map over the project data to render a ProjectCard for each project. */}
                {projectsData.map((project) => (
                    <ProjectCard 
                        key={project.id} 
                        project={project} 
                        // If the project has a modalType, pass a function to the `onOpen` prop
                        // that calls the `onOpenModal` handler with the correct type.
                        onOpen={project.modalType ? () => onOpenModal(project.modalType!) : undefined}
                    />
                ))}
            </motion.div>
        </section>
    );
};

export default Projects;