
import React from 'react';
import { motion } from 'framer-motion';
import { Skill } from '../types';

interface SkillPillProps {
    skill: Skill;
}

/**
 * A component that displays a skill icon.
 * On hover, it reveals the skill's name in a tooltip.
 */
const SkillPill: React.FC<SkillPillProps> = ({ skill }) => {
    return (
        <motion.div
            // The `group` class allows us to style child elements based on the parent's hover state.
            className="relative group flex items-center justify-center p-4 bg-white/5 border border-white/10 rounded-lg aspect-square"
            whileHover={{ scale: 1.1, y: -5, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            transition={{ type: 'spring', stiffness: 300 }}
        >
            {/* The skill's SVG icon */}
            <skill.Icon className="h-10 w-10 text-gray-300 group-hover:text-cyan-400 transition-colors" />
            
            {/* The tooltip element */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                {skill.name}
                {/* A small SVG triangle to create the tooltip's arrow */}
                <svg className="absolute text-gray-800 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255">
                    <polygon className="fill-current" points="0,0 127.5,127.5 255,0"/>
                </svg>
            </div>
        </motion.div>
    );
};

export default SkillPill;
