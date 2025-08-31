
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Stable URLs for the images to prevent broken links.
const heroImageUrl = 'https://images.unsplash.com/photo-1593113589675-7732a6fb0d74?q=80&w=1200&auto=format&fit=crop';
const donationImageUrl = 'https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?q=80&w=800&auto=format&fit=crop';
const childrenImageUrl = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// A reusable card component for displaying information points.
const InfoCard: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
    <div className="bg-white/80 p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-xl font-bold text-orange-600 mb-3">{title}</h3>
        <p className="text-gray-700">{children}</p>
    </div>
);

/**
 * A modal component that provides an interactive explainer for the Meals4All food donation platform project.
 * It presents a polished, single-page summary of the platform's key features.
 */
const Meals4AllExplainerModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-[#fff8f0] text-[#333] rounded-2xl shadow-2xl w-[95vw] h-[90vh] overflow-y-auto relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-black z-50 text-3xl font-light">&times;</button>
                        
                        <header className="sticky top-0 bg-black text-white py-4 px-8 z-40 flex justify-between items-center shadow-md">
                            {/* Logo and tagline */}
                            <div className="flex items-center gap-2">
                                <div>
                                    <h2 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "'Georgia', serif" }}>Meals4All</h2>
                                    <p className="text-sm text-cyan-200 -mt-1 tracking-wide">A meal, A Moment of Hope</p>
                                </div>
                                <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M1 3h15v11h-3.5a2.5 2.5 0 0 1-5 0H1V3z" />
                                    <path d="M16 8h4l3 3v5h-3" />
                                    <circle cx="5.5" cy="18.5" r="2.5" fill="currentColor"/>
                                    <circle cx="16.5" cy="18.5" r="2.5" fill="currentColor"/>
                                    <path d="M16 3h-3" />
                                </svg>
                            </div>
                             {/* The "Donate Now" button links to the main page's contact section and closes the modal. */}
                            <a href="#contact" onClick={onClose} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-full transition-colors">
                                Donate Now
                            </a>
                        </header>

                        <main className="px-6 py-12 md:px-12">
                            {/* Hero Section */}
                            <section className="relative text-center mb-20 text-white rounded-xl overflow-hidden">
                                <img src={heroImageUrl} alt="A volunteer handing food to a person in need" className="w-full h-80 object-cover" />
                                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-8">
                                    <h1 className="text-5xl md:text-6xl font-extrabold mb-4">Bridging the Gap</h1>
                                    <p className="text-xl md:text-2xl max-w-3xl">From surplus food to those in need, we're creating a world where no one goes to bed hungry.</p>
                                </div>
                            </section>

                            {/* About Section */}
                            <section className="max-w-4xl mx-auto text-center mb-20">
                                <h2 className="text-4xl font-bold text-gray-800 mb-6">Who We Are</h2>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    We are a passionate team dedicated to transforming the way food is managed. Founded on principles of empathy and sustainability, we aim to ensure no meal goes to waste. Our platform creates a seamless connection between food surplus and those who need it most, simplifying the donation process for everyone involved.
                                </p>
                            </section>
                            
                            {/* How It Works Section */}
                            <section className="mb-20">
                                <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">How to Donate</h2>
                                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                                   <InfoCard title="1. Collection">
                                       Surplus food is gathered from our network of donors, including restaurants, grocery stores, and events.
                                   </InfoCard>
                                   <InfoCard title="2. Storage & Safety">
                                       All food is stored in hygienic conditions to ensure its quality and safety before being prepared for delivery.
                                   </InfoCard>
                                   <InfoCard title="3. Distribution">
                                        Meals are delivered directly to shelters, food banks, and individuals in need through our dedicated volunteers.
                                   </InfoCard>
                                </div>
                            </section>

                            {/* Gallery Section */}
                            <section className="mb-20">
                                <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">A Moment of Hope</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                                    <img src={donationImageUrl} alt="Donation box filled with food" className="rounded-lg shadow-lg object-cover w-full h-64"/>
                                    <img src={childrenImageUrl} alt="Happy children receiving aid" className="rounded-lg shadow-lg object-cover w-full h-64"/>
                                </div>
                            </section>

                        </main>
                        
                        <footer className="bg-gray-800 text-white text-center p-6 mt-12">
                            <p>&copy; 2024 Meals4All Initiative. All rights reserved.</p>
                        </footer>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Meals4AllExplainerModal;
