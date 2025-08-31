
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Declare Chart.js as a global variable to satisfy TypeScript since it's loaded from a CDN.
declare const Chart: any;

interface ExplainerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * A modal component that provides an interactive, in-depth explanation of the Ecosystem Simulator project.
 * It encapsulates the original project's vanilla JavaScript logic within a React component.
 */
const ExplainerModal: React.FC<ExplainerModalProps> = ({ isOpen, onClose }) => {
    // Refs to connect React to the DOM elements needed for the vanilla JS logic.
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<HTMLCanvasElement>(null);
    const dnaCanvasRef = useRef<HTMLCanvasElement>(null);
    
    const startStopBtnRef = useRef<HTMLButtonElement>(null);
    const resetBtnRef = useRef<HTMLButtonElement>(null);
    const foodRateSliderRef = useRef<HTMLInputElement>(null);
    const mutationRateSliderRef = useRef<HTMLInputElement>(null);
    const dnaSpeedSliderRef = useRef<HTMLInputElement>(null);
    const dnaSizeSliderRef = useRef<HTMLInputElement>(null);

    const timeValRef = useRef<HTMLSpanElement>(null);
    const creatureCountRef = useRef<HTMLSpanElement>(null);
    const foodCountRef = useRef<HTMLSpanElement>(null);
    const avgSpeedRef = useRef<HTMLSpanElement>(null);
    const avgSizeRef = useRef<HTMLSpanElement>(null);
    const dnaSpeedValRef = useRef<HTMLSpanElement>(null);
    const dnaSizeValRef = useRef<HTMLSpanElement>(null);
    const codeDisplayRef = useRef<HTMLDivElement>(null);
    
    // A ref to hold all the mutable state of the simulation.
    // This is crucial because it prevents the state from being reset on React re-renders.
    const simulationState = useRef({
        creatures: [] as any[],
        food: [] as any[],
        simulationRunning: false,
        frameCount: 0,
        animationFrameId: null as number | null,
        history: [] as any[],
        chartInstance: null as any | null,
    });
    
    // The main `useEffect` hook that contains the entire vanilla JavaScript logic for the simulation.
    // It runs only when the modal is opened (`isOpen` becomes true).
    useEffect(() => {
        if (!isOpen) return;

        // --- DOM ELEMENT INITIALIZATION ---
        // Grab all necessary DOM elements from their refs.
        const canvas = canvasRef.current!;
        const chartCanvas = chartRef.current!;
        const dnaCanvas = dnaCanvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        const dnaCtx = dnaCanvas.getContext('2d')!;

        const startStopBtn = startStopBtnRef.current!;
        const resetBtn = resetBtnRef.current!;
        const foodRateSlider = foodRateSliderRef.current!;
        const mutationRateSlider = mutationRateSliderRef.current!;
        const timeVal = timeValRef.current!;
        const creatureCount = creatureCountRef.current!;
        const foodCount = foodCountRef.current!;
        const avgSpeed = avgSpeedRef.current!;
        const avgSize = avgSizeRef.current!;
        const dnaSpeedSlider = dnaSpeedSliderRef.current!;
        const dnaSizeSlider = dnaSizeSliderRef.current!;
        const dnaSpeedVal = dnaSpeedValRef.current!;
        const dnaSizeVal = dnaSizeValRef.current!;
        const codeDisplay = codeDisplayRef.current!;

        // --- CANVAS AND UTILITY SETUP ---
        function resizeCanvas() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const rand = (min: number, max: number) => Math.random() * (max - min) + min;
        const randColor = () => `hsl(${rand(0, 360)}, 70%, 60%)`;

        // --- SIMULATION CLASSES (Creature, Food) ---
        class Creature {
            x: number; y: number; energy: number; age: number; genome: any;
            color: any; speed: any; size: any; sense: any; maxAge: any; reproduceEnergy: any;
            constructor(x: number, y: number, parentGenome: any = null) {
                this.x = x; this.y = y; this.energy = 100; this.age = 0;
                if (parentGenome) {
                    this.genome = this.mutate(parentGenome);
                } else {
                    this.genome = {
                        color: randColor(), speed: rand(0.5, 2.5), size: rand(4, 10),
                        sense: rand(50, 150), maxAge: rand(800, 1500), reproduceEnergy: rand(120, 180),
                    };
                }
                this.applyGenome();
            }
            applyGenome() { for (let key in this.genome) { (this as any)[key] = this.genome[key]; } }
            mutate(parentGenome: any) {
                const newGenome = JSON.parse(JSON.stringify(parentGenome));
                const mutationRate = parseFloat(mutationRateSlider.value);
                if (Math.random() < mutationRate) newGenome.speed = Math.max(0.2, newGenome.speed + rand(-0.2, 0.2));
                if (Math.random() < mutationRate) newGenome.size = Math.max(2, newGenome.size + rand(-0.5, 0.5));
                if (Math.random() < mutationRate) newGenome.sense = Math.max(20, newGenome.sense + rand(-10, 10));
                if (Math.random() < mutationRate * 2) newGenome.color = randColor();
                return newGenome;
            }
            draw() {
                ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color; ctx.fill();
            }
            update() {
                const closestFood = this.findClosest(simulationState.current.food);
                if (closestFood) {
                    const angle = Math.atan2(closestFood.y - this.y, closestFood.x - this.x);
                    this.x += Math.cos(angle) * this.speed; this.y += Math.sin(angle) * this.speed;
                } else {
                    this.x += rand(-1, 1) * this.speed * 0.5; this.y += rand(-1, 1) * this.speed * 0.5;
                }
                this.energy -= 0.1 + (this.speed * 0.05) + (this.size * 0.02);
                this.age++;
                this.x = Math.max(this.size, Math.min(canvas.width - this.size, this.x));
                this.y = Math.max(this.size, Math.min(canvas.height - this.size, this.y));
                if (this.energy > this.reproduceEnergy) {
                    this.energy /= 2;
                    simulationState.current.creatures.push(new Creature(this.x, this.y, this.genome));
                }
            }
            findClosest(arr: any[]) {
                let closest = null, closestDist = this.sense;
                for (const item of arr) {
                    const dist = Math.hypot(this.x - item.x, this.y - item.y);
                    if (dist < closestDist) { closestDist = dist; closest = item; }
                }
                return closest;
            }
        }

        class Food {
            x: number; y: number; size: number;
            constructor(x: number, y: number) { this.x = x; this.y = y; this.size = 3; }
            draw() {
                ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = '#6ab04c'; ctx.fill();
            }
        }

        // --- CORE SIMULATION LOGIC ---
        const gameLoop = () => {
            if (!simulationState.current.simulationRunning) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (simulationState.current.frameCount % (25 - parseInt(foodRateSlider.value)) === 0) {
                simulationState.current.food.push(new Food(rand(0, canvas.width), rand(0, canvas.height)));
            }
            simulationState.current.food.forEach(f => f.draw());
            simulationState.current.creatures.forEach((creature, i) => {
                creature.update(); creature.draw();
                simulationState.current.food.forEach((f, j) => {
                    if (Math.hypot(creature.x - f.x, creature.y - f.y) < creature.size) {
                        creature.energy += 50; simulationState.current.food.splice(j, 1);
                    }
                });
                if (creature.energy <= 0 || creature.age > creature.maxAge) {
                    simulationState.current.creatures.splice(i, 1);
                }
            });
            updateStats();
            simulationState.current.frameCount++;
            simulationState.current.animationFrameId = requestAnimationFrame(gameLoop);
        }

        const updateStats = () => {
            const time = Math.floor(simulationState.current.frameCount / 60);
            timeVal.textContent = String(time);
            creatureCount.textContent = String(simulationState.current.creatures.length);
            foodCount.textContent = String(simulationState.current.food.length);
            if (simulationState.current.creatures.length > 0) {
                const totalSpeed = simulationState.current.creatures.reduce((sum, c) => sum + c.speed, 0);
                const totalSize = simulationState.current.creatures.reduce((sum, c) => sum + c.size, 0);
                const currentAvgSpeed = totalSpeed / simulationState.current.creatures.length;
                const currentAvgSize = totalSize / simulationState.current.creatures.length;
                avgSpeed.textContent = currentAvgSpeed.toFixed(2);
                avgSize.textContent = currentAvgSize.toFixed(2);

                if (time > 0 && simulationState.current.frameCount % 60 === 0) {
                    simulationState.current.history.push({
                        time: time,
                        population: simulationState.current.creatures.length,
                        avgSpeed: currentAvgSpeed,
                        avgSize: currentAvgSize
                    });
                    updateChart();
                }
            } else {
                avgSpeed.textContent = '0.00'; avgSize.textContent = '0.00';
            }
        }

        // --- EVENT HANDLERS ---
        const handleStartStop = () => {
            simulationState.current.simulationRunning = !simulationState.current.simulationRunning;
            startStopBtn.textContent = simulationState.current.simulationRunning ? 'Stop' : 'Start';
            startStopBtn.style.backgroundColor = simulationState.current.simulationRunning ? '#d69153' : '#e6a264';
            if (simulationState.current.simulationRunning) gameLoop(); else cancelAnimationFrame(simulationState.current.animationFrameId!);
        };

        const handleReset = () => {
            simulationState.current.simulationRunning = false;
            startStopBtn.textContent = 'Start';
            startStopBtn.style.backgroundColor = '#e6a264';
            if(simulationState.current.animationFrameId) cancelAnimationFrame(simulationState.current.animationFrameId);
            simulationState.current.creatures = []; simulationState.current.food = []; simulationState.current.frameCount = 0; simulationState.current.history = [];
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            updateStats();
            resetChart();
        };

        const handleCanvasClick = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left; const y = e.clientY - rect.top;
            for (let i = 0; i < 5; i++) {
                simulationState.current.creatures.push(new Creature(x + rand(-10, 10), y + rand(-10, 10)));
            }
            if (!simulationState.current.simulationRunning) {
                updateStats();
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                simulationState.current.creatures.forEach(c => c.draw());
            }
        };

        startStopBtn.addEventListener('click', handleStartStop);
        resetBtn.addEventListener('click', handleReset);
        canvas.addEventListener('click', handleCanvasClick);

        // --- CHART.JS LOGIC ---
        simulationState.current.chartInstance = new Chart(chartCanvas.getContext('2d')!, {
            type: 'line',
            data: { labels: [], datasets: [
                { label: 'Population', data: [], borderColor: '#e6a264', tension: 0.1, yAxisID: 'y' },
                { label: 'Avg Speed', data: [], borderColor: '#3498db', tension: 0.1, yAxisID: 'y1', hidden: true },
                { label: 'Avg Size', data: [], borderColor: '#9b59b6', tension: 0.1, yAxisID: 'y1', hidden: true }
            ]},
            options: { responsive: true, maintainAspectRatio: false, scales: {
                y: { type: 'linear', display: true, position: 'left', title: { display: true, text: 'Population' } },
                y1: { type: 'linear', display: true, position: 'right', title: { display: true, text: 'Trait Value' }, grid: { drawOnChartArea: false } }
            }}
        });
        
        function updateChart() {
            const lastData = simulationState.current.history[simulationState.current.history.length - 1];
            if (!lastData || !simulationState.current.chartInstance) return;
            simulationState.current.chartInstance.data.labels.push(lastData.time);
            simulationState.current.chartInstance.data.datasets[0].data.push(lastData.population);
            simulationState.current.chartInstance.data.datasets[1].data.push(lastData.avgSpeed);
            simulationState.current.chartInstance.data.datasets[2].data.push(lastData.avgSize);
            simulationState.current.chartInstance.update();
        }

        function resetChart() {
            if (!simulationState.current.chartInstance) return;
            simulationState.current.chartInstance.data.labels = [];
            simulationState.current.chartInstance.data.datasets.forEach((dataset:any) => { dataset.data = []; });
            simulationState.current.chartInstance.update();
        }

        // --- INTERACTIVE DNA CANVAS LOGIC ---
        function drawDnaCreature() {
            const size = parseFloat(dnaSizeSlider.value);
            const speed = parseFloat(dnaSpeedSlider.value);
            const colorVal = 180 + (speed - 1.5) * 50;
            dnaCtx.clearRect(0, 0, 150, 150);
            dnaCtx.beginPath();
            dnaCtx.arc(75, 75, size * 3, 0, Math.PI * 2);
            dnaCtx.fillStyle = `hsl(${colorVal}, 70%, 60%)`;
            dnaCtx.fill();
            dnaSpeedVal.textContent = speed.toFixed(1);
            dnaSizeVal.textContent = size.toFixed(0);
        }
        dnaSpeedSlider.addEventListener('input', drawDnaCreature);
        dnaSizeSlider.addEventListener('input', drawDnaCreature);
        drawDnaCreature();

        // --- INTERACTIVE GAMELOOP DIAGRAM LOGIC ---
        const codeSnippets = {
            step1: `// Erase everything from the last frame\nctx.clearRect(0, 0, canvas.width, canvas.height);`,
            step2: `// Loop through every creature and food item\n// - Update positions\n// - Check for collisions (eating)\n// - Handle reproduction and death\ncreatures.forEach(c => c.update());`,
            step3: `// After all updates, draw everything\n// in its new position for this frame\ncreatures.forEach(c => c.draw());\nfood.forEach(f => f.draw());`,
            step4: `// Tell the browser to run this loop\n// again for the next frame\nrequestAnimationFrame(gameLoop);`
        };
        const diagramSteps = document.querySelectorAll('.diagram-step');
        const handleStepEnter = (e: Event) => {
            const target = e.currentTarget as HTMLDivElement;
            codeDisplay.style.opacity = '1';
            (codeDisplay.querySelector('pre')! as HTMLElement).textContent = codeSnippets[target.id as keyof typeof codeSnippets];
        };
        const handleStepLeave = () => {
            codeDisplay.style.opacity = '0.25';
            (codeDisplay.querySelector('pre')! as HTMLElement).textContent = 'Hover over a step above to see the code concept.';
        };
        diagramSteps.forEach(step => {
            step.addEventListener('mouseenter', handleStepEnter);
            step.addEventListener('mouseleave', handleStepLeave);
        });

        // --- CLEANUP FUNCTION ---
        // This function runs when the component unmounts (or when `isOpen` changes).
        // It's crucial for preventing memory leaks by removing event listeners and stopping animations.
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (simulationState.current.animationFrameId) cancelAnimationFrame(simulationState.current.animationFrameId);
            if (simulationState.current.chartInstance) {
                simulationState.current.chartInstance.destroy();
                simulationState.current.chartInstance = null;
            }
            
            // Reset the simulation state to its initial values.
            simulationState.current.simulationRunning = false;
            simulationState.current.creatures = [];
            simulationState.current.food = [];
            simulationState.current.frameCount = 0;
            simulationState.current.history = [];

            diagramSteps.forEach(step => {
                step.removeEventListener('mouseenter', handleStepEnter);
                step.removeEventListener('mouseleave', handleStepLeave);
            });
        };
    }, [isOpen]);
    
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
                        className="bg-[#f4f1eb] text-[#4a4a4a] rounded-2xl shadow-2xl w-[95vw] h-[90vh] overflow-y-auto relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black z-50 text-2xl">&times;</button>
                        <main className="container mx-auto px-6 py-12">
                            {/* Injected styles for this specific modal's content */}
                            <style>{`
                                .glass-panel { background-color: rgba(255, 255, 255, 0.6); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); }
                                .code-block { background-color: #2d2d2d; color: #f4f1eb; font-family: 'Courier New', Courier, monospace; white-space: pre-wrap; }
                                .diagram-step { transition: all 0.3s ease; } .diagram-step:hover { transform: scale(1.05); background-color: #e6a264; color: white; }
                                .chart-container { position: relative; width: 100%; max-width: 600px; margin-left: auto; margin-right: auto; height: 300px; max-height: 400px; }
                                @media (min-width: 768px) { .chart-container { height: 350px; } }
                            `}</style>
                            <section id="simulation" className="mb-24">
                                <div className="text-center mb-12">
                                    <h2 className="text-4xl font-bold mb-4 text-gray-800">Ecosystem Explainer</h2>
                                    <p className="max-w-3xl mx-auto text-lg text-gray-600">
                                        This is a dynamic simulation of a simple ecosystem. Click on the dark canvas to spawn creatures. Watch them seek food, reproduce, and evolve over time as their traits mutate, mimicking natural selection.
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2 rounded-xl shadow-2xl overflow-hidden">
                                        <canvas ref={canvasRef} className="w-full h-[60vh] bg-gray-800 cursor-crosshair"></canvas>
                                    </div>
                                    <div className="glass-panel p-6 rounded-xl shadow-lg">
                                        <h3 className="text-2xl font-bold mb-4 text-gray-800">Controls & Stats</h3>
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <button ref={startStopBtnRef} className="bg-[#e6a264] hover:bg-[#d69153] text-white font-bold py-2 px-4 rounded-lg transition-all duration-300">Start</button>
                                            <button ref={resetBtnRef} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300">Reset</button>
                                        </div>
                                        <div className="space-y-4 mb-6">
                                            <div>
                                                <label htmlFor="foodRate" className="block mb-1 text-sm font-medium">Food Spawn Rate</label>
                                                <input ref={foodRateSliderRef} type="range" id="foodRate" min="1" max="20" defaultValue="10" className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer" />
                                            </div>
                                            <div>
                                                <label htmlFor="mutationRate" className="block mb-1 text-sm font-medium">Mutation Rate</label>
                                                <input ref={mutationRateSliderRef} type="range" id="mutationRate" min="0" max="0.2" step="0.01" defaultValue="0.05" className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer" />
                                            </div>
                                        </div>
                                        <div className="text-md space-y-2 p-4 bg-white/50 rounded-lg">
                                            <p>Time: <span ref={timeValRef} className="font-semibold">0</span></p>
                                            <p>Creatures: <span ref={creatureCountRef} className="font-semibold">0</span></p>
                                            <p>Food: <span ref={foodCountRef} className="font-semibold">0</span></p>
                                            <p>Avg. Speed: <span ref={avgSpeedRef} className="font-semibold">0.00</span></p>
                                            <p>Avg. Size: <span ref={avgSizeRef} className="font-semibold">0.00</span></p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-12">
                                    <h3 className="text-3xl font-bold text-center mb-6 text-gray-800">Visualizing Evolution</h3>
                                    <p className="text-center max-w-2xl mx-auto text-gray-600 mb-8">This chart tracks the total population and the average traits of the creatures over time. A rising population often indicates successful adaptations.</p>
                                    <div className="glass-panel p-6 rounded-xl shadow-lg">
                                        <div className="chart-container">
                                            <canvas ref={chartRef}></canvas>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <section id="deconstruction">
                                <div className="text-center mb-16">
                                    <h2 className="text-5xl font-bold mb-4 text-gray-800">Deconstructing the Code</h2>
                                </div>
                                <article className="mb-20">
                                    <h3 className="text-3xl font-bold mb-6 text-gray-700">The DNA: The `Creature` Class</h3>
                                    <p className="mb-8 text-gray-600">The heart of each creature is a JavaScript `class`. Its most important property is the **genome**, an object holding its genetic traits. Adjust the sliders below to see how changing genome values affects the creature's appearance.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                        <div className="glass-panel p-6 rounded-xl">
                                            <h4 className="font-semibold text-lg mb-4">Interactive Genome</h4>
                                            <div className="flex items-center gap-8">
                                                <canvas ref={dnaCanvasRef} width="150" height="150" className="bg-gray-800 rounded-full"></canvas>
                                                <div className="flex-grow space-y-4">
                                                    <div>
                                                        <label htmlFor="dnaSpeed">Speed: <span ref={dnaSpeedValRef}>1.5</span></label>
                                                        <input ref={dnaSpeedSliderRef} type="range" id="dnaSpeed" min="0.5" max="3" step="0.1" defaultValue="1.5" className="w-full" />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="dnaSize">Size: <span ref={dnaSizeValRef}>7</span></label>
                                                        <input ref={dnaSizeSliderRef} type="range" id="dnaSize" min="3" max="15" step="1" defaultValue="7" className="w-full" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="code-block p-4 rounded-lg text-sm">
                                            <pre>{`class Creature {
    constructor(x, y, parentGenome = null) {
        this.x = x;
        this.y = y;
        this.energy = 100;
        
        if (parentGenome) {
            this.genome = this.mutate(parentGenome);
        } else {
            // Create a new random genome
            this.genome = {
                color: randColor(),
                speed: rand(0.5, 2.5),
                size: rand(4, 10),
            };
        }
    }
}`}</pre>
                                        </div>
                                    </div>
                                </article>
                                <article>
                                    <h3 className="text-3xl font-bold mb-6 text-gray-700">The Engine: The `gameLoop()`</h3>
                                    <p className="mb-8 text-gray-600">Animation is created by a function that runs repeatedly. This "game loop" clears the old frame, updates all element positions, draws them in their new spots, and then requests the browser to do it all over again. Hover over the steps to see the code concept.</p>
                                    <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-center">
                                        <div id="step1" className="diagram-step p-6 rounded-lg shadow-md bg-white w-48 h-32 flex items-center justify-center"><strong>1. Clear Canvas</strong></div>
                                        <div className="text-2xl font-bold text-gray-400">&rarr;</div>
                                        <div id="step2" className="diagram-step p-6 rounded-lg shadow-md bg-white w-48 h-32 flex items-center justify-center"><strong>2. Update All Creatures</strong></div>
                                        <div className="text-2xl font-bold text-gray-400">&rarr;</div>
                                        <div id="step3" className="diagram-step p-6 rounded-lg shadow-md bg-white w-48 h-32 flex items-center justify-center"><strong>3. Draw Everything</strong></div>
                                        <div className="text-2xl font-bold text-gray-400">&rarr;</div>
                                        <div id="step4" className="diagram-step p-6 rounded-lg shadow-md bg-white w-48 h-32 flex items-center justify-center"><strong>4. Repeat!</strong></div>
                                    </div>
                                    <div ref={codeDisplayRef} className="mt-8 code-block p-4 rounded-lg text-sm min-h-[100px] transition-opacity duration-300 opacity-25">
                                        <pre>Hover over a step above to see the code concept.</pre>
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

export default ExplainerModal;
