
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * A live, interactive demonstration of the user's original calculator project.
 * The logic from the original vanilla JS `Calculator` class has been faithfully
 * recreated here using React hooks for state management.
 */
const LiveCalculator: React.FC = () => {
    // State to manage the calculator's display and memory.
    const [currentOperand, setCurrentOperand] = useState('');
    const [previousOperand, setPreviousOperand] = useState('');
    const [operation, setOperation] = useState<string | undefined>(undefined);

    // Formats a number for display, adding commas for thousands.
    const getDisplayNumber = (number: string) => {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    };

    // Appends a digit or decimal to the current operand.
    const appendNumber = (number: string) => {
        if (number === '.' && currentOperand.includes('.')) return;
        setCurrentOperand(prev => prev.toString() + number.toString());
    };

    // Sets the mathematical operation to be performed.
    const chooseOperation = (op: string) => {
        if (currentOperand === '') return;
        if (previousOperand !== '') {
            compute();
        }
        setOperation(op);
        setPreviousOperand(currentOperand);
        setCurrentOperand('');
    };

    // Performs the calculation.
    const compute = () => {
        let computation: number;
        const prev = parseFloat(previousOperand);
        const current = parseFloat(currentOperand);
        if (isNaN(prev) || isNaN(current)) return;
        switch (operation) {
            case '+': computation = prev + current; break;
            case '-': computation = prev - current; break;
            case '*': computation = prev * current; break;
            case '÷': computation = prev / current; break;
            default: return;
        }
        setCurrentOperand(computation.toString());
        setOperation(undefined);
        setPreviousOperand('');
    };

    // Resets the calculator state.
    const clear = () => {
        setCurrentOperand('');
        setPreviousOperand('');
        setOperation(undefined);
    };

    // Deletes the last character from the current operand.
    const del = () => {
        setCurrentOperand(prev => prev.toString().slice(0, -1));
    };

    return (
        <div className="live-demo-container p-4 rounded-lg">
            {/* The JSX structure mirrors the original project's HTML. */}
            <div className="live-demo-calculator-grid">
                <div className="live-demo-output">
                    <div className="live-demo-previous-operand">{getDisplayNumber(previousOperand)} {operation || ''}</div>
                    <div className="live-demo-current-operand">{getDisplayNumber(currentOperand) || '0'}</div>
                </div>
                <button onClick={clear} className="live-demo-span-two">AC</button>
                <button onClick={del}>DEL</button>
                <button onClick={() => chooseOperation('÷')}>÷</button>
                <button onClick={() => appendNumber('1')}>1</button>
                <button onClick={() => appendNumber('2')}>2</button>
                <button onClick={() => appendNumber('3')}>3</button>
                <button onClick={() => chooseOperation('*')}>*</button>
                <button onClick={() => appendNumber('4')}>4</button>
                <button onClick={() => appendNumber('5')}>5</button>
                <button onClick={() => appendNumber('6')}>6</button>
                <button onClick={() => chooseOperation('+')}>+</button>
                <button onClick={() => appendNumber('7')}>7</button>
                <button onClick={() => appendNumber('8')}>8</button>
                <button onClick={() => appendNumber('9')}>9</button>
                <button onClick={() => chooseOperation('-')}>-</button>
                <button onClick={() => appendNumber('.')}>.</button>
                <button onClick={() => appendNumber('0')}>0</button>
                <button onClick={compute} className="live-demo-span-two">=</button>
            </div>
        </div>
    );
};

/**
 * A modal component that provides an interactive explainer for the Calculator project.
 */
const CalculatorExplainerModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    // State to manage which code snippet is currently displayed.
    const [activeSnippet, setActiveSnippet] = useState<string | null>(null);
    const jsSnippets = {
        class: `// The class acts as a blueprint for our calculator.\n// It holds all the state and logic.\nclass Calculator { \n  constructor(...) { ... } \n}`,
        append: `// Adds a number or decimal to the display.\n// Prevents adding multiple decimal points.\nappendNumber(number) { ... }`,
        operation: `// Sets the chosen operation (+, -, *, ÷).\n// If an operation already exists, it computes first.\nchooseOperation(operation) { ... }`,
        compute: `// Performs the calculation based on the stored numbers\n// and operation, then updates the display.\ncompute() { ... }`,
    };

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
                        className="bg-[#f0f2f5] text-[#333] rounded-2xl shadow-2xl w-[95vw] h-[90vh] overflow-y-auto relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black z-50 text-2xl">&times;</button>
                        <main className="container mx-auto px-6 py-12">
                             {/* Injected CSS to style the live calculator demo, matching the original project's styles. */}
                            <style>{`
                                .live-demo-container {
                                    padding: 0;
                                    margin: 0;
                                    background: linear-gradient(to right, #00AAFF, #00FF6C);
                                }
                                .live-demo-calculator-grid { 
                                    display: grid;
                                    justify-content: center;
                                    align-content: center;
                                    grid-template-columns: repeat(4, 80px);
                                    grid-template-rows: minmax(100px, auto) repeat(5, 80px);
                                }
                                .live-demo-calculator-grid > button {
                                    cursor: pointer;
                                    font-size: 1.8rem;
                                    border: 1px solid white;
                                    outline: none;
                                    background-color: rgba(255, 255, 255, .75);
                                }
                                .live-demo-calculator-grid > button:hover {
                                    background-color: rgba(255, 255, 255, .9);
                                }
                                .live-demo-span-two {
                                    grid-column: span 2;
                                }
                                .live-demo-output {
                                    grid-column: 1 / -1;
                                    background-color: rgba(0, 0, 0, .75);
                                    display: flex;
                                    align-items: flex-end;
                                    justify-content: space-around;
                                    flex-direction: column;
                                    padding: 10px;
                                    word-wrap: break-word;
                                    word-break: break-all;
                                }
                                .live-demo-output .live-demo-previous-operand {
                                    color: rgba(255, 255, 255, .75);
                                    font-size: 1.2rem;
                                }
                                .live-demo-output .live-demo-current-operand {
                                    color: white;
                                    font-size: 2.2rem;
                                }
                                .code-block { background-color: #2d2d2d; color: #f4f1eb; font-family: 'Courier New', Courier, monospace; white-space: pre-wrap; }
                                .diagram-step { transition: all 0.3s ease; cursor: pointer; }
                                .diagram-step:hover { transform: scale(1.05); background-color: #4A90E2; color: white; }
                            `}</style>
                            <section className="mb-24">
                                <div className="text-center mb-12">
                                    <h2 className="text-4xl font-bold mb-4 text-gray-800">Calculator Explainer</h2>
                                    <p className="max-w-3xl mx-auto text-lg text-gray-600">
                                        This is a fully functional, interactive demo of the calculator project. Below, you can use the calculator and explore how it's constructed.
                                    </p>
                                </div>
                                <div className="flex justify-center mb-12">
                                    <LiveCalculator />
                                </div>
                            </section>
                            <section>
                                <div className="text-center mb-16">
                                    <h2 className="text-5xl font-bold mb-4 text-gray-800">Deconstructing the Code</h2>
                                </div>
                                <article className="mb-20">
                                    <h3 className="text-3xl font-bold mb-6 text-gray-700">The Blueprint: HTML & CSS</h3>
                                    <p className="mb-8 text-gray-600">The calculator's layout is achieved with **CSS Grid**. A main container (`.calculator-grid`) holds all the buttons and the output screen. The `grid-template-columns` and `grid-template-rows` properties define the responsive grid structure, making it easy to position elements like the double-width "AC" button.</p>
                                </article>
                                <article>
                                    <h3 className="text-3xl font-bold mb-6 text-gray-700">The Engine: The JavaScript Logic</h3>
                                    <p className="mb-8 text-gray-600">The original project's logic is encapsulated in a `Calculator` class. This class holds the state (like `currentOperand`) and methods that perform the calculator's actions. In this explainer, the same logic is implemented using React's `useState` hook. Hover over the key methods below to learn more.</p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                        <div onMouseEnter={() => setActiveSnippet('class')} onMouseLeave={() => setActiveSnippet(null)} className="diagram-step p-4 rounded-lg shadow-md bg-white"><strong>Constructor</strong></div>
                                        <div onMouseEnter={() => setActiveSnippet('append')} onMouseLeave={() => setActiveSnippet(null)} className="diagram-step p-4 rounded-lg shadow-md bg-white"><strong>appendNumber()</strong></div>
                                        <div onMouseEnter={() => setActiveSnippet('operation')} onMouseLeave={() => setActiveSnippet(null)} className="diagram-step p-4 rounded-lg shadow-md bg-white"><strong>chooseOperation()</strong></div>
                                        <div onMouseEnter={() => setActiveSnippet('compute')} onMouseLeave={() => setActiveSnippet(null)} className="diagram-step p-4 rounded-lg shadow-md bg-white"><strong>compute()</strong></div>
                                    </div>
                                    <div className="mt-8 code-block p-4 rounded-lg text-sm min-h-[120px] transition-opacity duration-300 flex items-center">
                                        <pre>{activeSnippet ? jsSnippets[activeSnippet as keyof typeof jsSnippets] : 'Hover over a method above to see its purpose.'}</pre>
                                    </div>
                                </article>
                            </section>
                        </main>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CalculatorExplainerModal;
