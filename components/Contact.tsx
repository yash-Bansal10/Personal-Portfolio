
import React, { useState, FormEvent, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence, Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Defines the possible states of the form submission process.
type FormState = 'idle' | 'loading' | 'success' | 'error';

// SVG icon components for displaying feedback.
const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const ErrorIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

/**
 * The Contact form component.
 * Handles user input, validation, and submission to a backend API with visual feedback.
 */
const Contact: React.FC = () => {
    // State for each form field.
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    // State to hold validation error messages.
    const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
    // State to track the form's submission status.
    const [formState, setFormState] = useState<FormState>('idle');

    const controls = useAnimation();
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

    useEffect(() => {
        if (inView) {
            controls.start('visible');
        }
    }, [controls, inView]);

    // Effect to automatically reset the form state from success/error back to idle after a delay.
    useEffect(() => {
        if (formState === 'success' || formState === 'error') {
            const timer = setTimeout(() => {
                setFormState('idle');
            }, 5000); // Reset after 5 seconds.

            // Cleanup the timer if the component unmounts or the state changes again.
            return () => clearTimeout(timer);
        }
    }, [formState]);


    // Simple client-side validation logic.
    const validate = () => {
        const newErrors: { name?: string; email?: string; message?: string } = {};
        if (!name.trim()) newErrors.name = 'Name is required';
        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!message.trim()) newErrors.message = 'Message is required';
        setErrors(newErrors);
        // Returns true if there are no errors.
        return Object.keys(newErrors).length === 0;
    };

    // Handles the form submission event.
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setFormState('loading');

        try {
            // Make a real POST request to the serverless backend API endpoint.
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, message }),
            });

            // Check if the request was successful.
            if (response.ok) {
                setFormState('success');
                // Reset form fields on success.
                setName('');
                setEmail('');
                setMessage('');
                setErrors({});
            } else {
                // If the server returns an error, set the form state to 'error'.
                setFormState('error');
            }
        } catch (error) {
            // If the fetch call itself fails (e.g., network error), set to 'error'.
            console.error('Submission error:', error);
            setFormState('error');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
    };

    return (
        <>
            <motion.section
                ref={ref}
                initial="hidden"
                animate={controls}
                variants={containerVariants}
                className="py-16 max-w-2xl mx-auto"
            >
                <motion.h2 variants={itemVariants} className="text-4xl font-bold text-center mb-4">Get In Touch</motion.h2>
                <motion.p variants={itemVariants} className="text-center text-gray-400 mb-12">
                    Have a project in mind or just want to say hi? Feel free to reach out.
                </motion.p>
                <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-8" noValidate>
                    {/* Improved form field with a pure CSS floating label using Tailwind's 'peer' utility. */}
                    <div className="relative">
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={`peer w-full p-4 bg-white/5 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 placeholder-transparent ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-white/20 focus:ring-cyan-400'}`}
                            placeholder="Name"
                            aria-invalid={errors.name ? 'true' : 'false'}
                            aria-describedby={errors.name ? 'name-error' : undefined}
                        />
                        <label 
                            htmlFor="name" 
                            className="absolute left-4 -top-2.5 text-sm text-gray-400 transition-all 
                                       peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4
                                       peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-cyan-400">
                            Name
                        </label>
                        {errors.name && <p id="name-error" className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div className="relative">
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`peer w-full p-4 bg-white/5 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 placeholder-transparent ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-white/20 focus:ring-cyan-400'}`}
                            placeholder="Email"
                            aria-invalid={errors.email ? 'true' : 'false'}
                            aria-describedby={errors.email ? 'email-error' : undefined}
                        />
                        <label 
                            htmlFor="email" 
                            className="absolute left-4 -top-2.5 text-sm text-gray-400 transition-all
                                       peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4
                                       peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-cyan-400">
                            Email
                        </label>
                        {errors.email && <p id="email-error" className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div className="relative">
                        <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={5}
                            className={`peer w-full p-4 bg-white/5 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 resize-none placeholder-transparent ${errors.message ? 'border-red-500 focus:ring-red-500' : 'border-white/20 focus:ring-cyan-400'}`}
                            placeholder="Message"
                            aria-invalid={errors.message ? 'true' : 'false'}
                            aria-describedby={errors.message ? 'message-error' : undefined}
                        />
                        <label 
                            htmlFor="message" 
                            className="absolute left-4 -top-2.5 text-sm text-gray-400 transition-all
                                       peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4
                                       peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-cyan-400">
                            Message
                        </label>
                        {errors.message && <p id="message-error" className="text-red-500 text-sm mt-1">{errors.message}</p>}
                    </div>
                    <button
                        type="submit"
                        disabled={formState === 'loading'}
                        className="w-full py-4 font-bold text-white bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {/* Conditionally render button content based on form state */}
                        {formState === 'loading' && <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>}
                        {formState !== 'loading' && 'Send Message'}
                    </button>
                </motion.form>
            </motion.section>

            {/* Prominent Toast Notification */}
            <AnimatePresence>
                {(formState === 'success' || formState === 'error') && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[101] w-full max-w-sm px-4"
                    >
                        <div
                            className={`flex items-center gap-4 rounded-lg border p-4 shadow-lg ${
                                formState === 'success'
                                ? 'bg-green-900/50 border-green-500 text-green-200'
                                : 'bg-red-900/50 border-red-500 text-red-200'
                            }`}
                            style={{ backdropFilter: 'blur(10px)' }}
                            >
                            {formState === 'success' ? <CheckIcon className="w-6 h-6 text-green-400 flex-shrink-0" /> : <ErrorIcon className="w-6 h-6 text-red-400 flex-shrink-0" />}
                            <div>
                                <h3 className="font-bold">{formState === 'success' ? 'Message Sent!' : 'Submission Failed!'}</h3>
                                <p className="text-sm">{formState === 'success' ? 'Thanks for reaching out. I will get back to you soon.' : 'Something went wrong. Please try again.'}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Contact;
