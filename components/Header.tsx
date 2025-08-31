
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface HeaderProps {
    // The ID of the section currently in the viewport, passed from the App component.
    activeSection: string;
}

// Data for the navigation links.
const navLinks = [
    { id: 'home', title: 'Home' },
    { id: 'about', title: 'About' },
    { id: 'projects', title: 'Projects' },
    { id: 'contact', title: 'Contact' },
];

/**
 * A sticky header component that provides navigation for the portfolio.
 * It features a glassmorphism effect that appears on scroll and highlights the active section.
 */
const Header: React.FC<HeaderProps> = ({ activeSection }) => {
    // State to track if the user has scrolled down from the top of the page.
    const [scrolled, setScrolled] = useState(false);

    // Effect to add and remove a scroll event listener.
    useEffect(() => {
        const handleScroll = () => {
            // Set `scrolled` to true if the user has scrolled more than 10 pixels down.
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        // Cleanup function to remove the event listener when the component unmounts.
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            // The header's vertical padding and background styling change based on the `scrolled` state.
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-4' : 'py-6'}`}
        >
            <div
                className="container mx-auto px-6 md:px-12 flex justify-between items-center rounded-full transition-all duration-300"
                style={{
                    // Apply glassmorphism styles only when the user has scrolled.
                    backgroundColor: scrolled ? 'rgba(17, 24, 39, 0.3)' : 'transparent',
                    backdropFilter: scrolled ? 'blur(10px)' : 'none',
                    border: scrolled ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid transparent',
                    boxShadow: scrolled ? '0 4px 30px rgba(0, 0, 0, 0.1)' : 'none',
                }}
            >
                <a href="#home" className="text-2xl font-bold tracking-wider">YB</a>
                <nav>
                    <ul className="flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <li key={link.id} className="relative">
                                <a
                                    href={`#${link.id}`}
                                    // The link's text color changes based on whether its section is active.
                                    className={`text-sm font-medium transition-colors hover:text-white ${activeSection === link.id ? 'text-white' : 'text-gray-400'}`}
                                >
                                    {link.title}
                                </a>
                                {/* If this link's section is active, render the animated dot indicator. */}
                                {activeSection === link.id && (
                                    <motion.div
                                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-1 w-1 bg-cyan-400 rounded-full"
                                        // `layoutId` allows Framer Motion to animate the dot's position smoothly between links.
                                        layoutId="active-link-dot"
                                        initial={false}
                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </motion.header>
    );
};

export default Header;
