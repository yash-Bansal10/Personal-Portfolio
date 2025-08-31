
import React from 'react';

/**
 * Defines the data structure for a single project item.
 * This interface is used to ensure type safety for project data across the application.
 */
export interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  // URL for the live demo, not used if a specialButton or modalType is present.
  liveUrl?: string;
  // URL for the source code, not used if a specialButton is present.
  codeUrl?: string;
  // Optional property to specify which modal should be opened for this project's "Live Demo".
  modalType?: 'ecosystem' | 'calculator' | 'meals';
  // Optional property to render a single, special-purpose button.
  specialButton?: {
    text: string;
    url: string;
  };
}

/**
 * Defines the data structure for a single skill item.
 * It includes the skill's name and its corresponding SVG icon component.
 */
export interface Skill {
    name: string;
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}