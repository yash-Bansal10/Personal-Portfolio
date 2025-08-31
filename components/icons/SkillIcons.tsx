
import React from 'react';

// This file contains a collection of SVG icon components used to represent different skills in the "About Me" section.

export const JavascriptIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg fill="currentColor" viewBox="0 0 16 16" {...props}>
        <path d="M10.464 12.012c.339.408.823.633 1.353.633.518 0 .99-.203 1.341-.579.352-.377.566-.88.566-1.424s-.214-1.047-.566-1.423c-.351-.375-.823-.58-1.341-.58-.53 0-1.014.225-1.353.633l-1.439-1.246c.642-1.054 1.7-1.745 2.924-1.745 2.026 0 3.491 1.54 3.491 3.528 0 1.987-1.465 3.527-3.491 3.527-1.224 0-2.282-.69-2.924-1.745l1.44-1.246zM4.93 12.012c.34.408.823.633 1.354.633.518 0 .99-.203 1.34-.579.353-.377.567-.88.567-1.424s-.214-1.047-.567-1.423c-.35-.375-.822-.58-1.34-.58-.53 0-1.014.225-1.354.633l-1.439-1.246c.642-1.054 1.701-1.745 2.924-1.745 2.026 0 3.491 1.54 3.491 3.528 0 1.987-1.465 3.527-3.491 3.527-1.223 0-2.282-.69-2.924-1.745l1.44-1.246z"/>
    </svg>
);

export const ReactIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="-11.5 -10.23174 23 20.46348" {...props}>
        <circle cx="0" cy="0" r="2.05" fill="currentColor"></circle>
        <g stroke="currentColor" strokeWidth="1" fill="none">
            <ellipse rx="11" ry="4.2"></ellipse>
            <ellipse rx="11" ry="4.2" transform="rotate(60)"></ellipse>
            <ellipse rx="11" ry="4.2" transform="rotate(120)"></ellipse>
        </g>
    </svg>
);

export const NodeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M22.2,9.3c-2.4-0.8-3.7-2.7-3.7-5.1V3.9C18.5,2.9,17.6,2,16.6,2h-1c-1.1,0-1.9,0.9-1.9,1.9v0.3c0,2.4-1.3,4.3-3.7,5.1 C7.6,10.1,6.3,12,6.3,14.4v0.3c0,1.1-0.9,1.9-1.9,1.9h-1c-1.1,0-1.9-0.9-1.9-1.9v-0.3C1.5,9.2,5.7,4,11.5,4c0.5,0,1,0,1.5,0.1 c-0.1-0.4-0.2-0.8-0.2-1.2V2.6c0-0.7,0.5-1.2,1.2-1.2h0.2c0.7,0,1.2,0.5,1.2,1.2v0.3c0,0.4-0.1,0.8-0.2,1.2 c0.5-0.1,1-0.1,1.5-0.1c5.8,0,10,5.2,10,10.4c0,0.4,0,0.7-0.1,1.1c0.4-0.1,0.8-0.2,1.2-0.2h0.3c0.7,0,1.2-0.5,1.2-1.2v-0.2 c0-0.7-0.5-1.2-1.2-1.2c-0.4,0-0.8,0.1-1.1,0.2C22.5,9.9,22.4,9.6,22.2,9.3z M12.5,20c-5.8,0-10-5.2-10-10.4c0-0.4,0-0.7,0.1-1.1 c-0.4,0.1-0.8,0.2-1.2,0.2h-0.3c-0.7,0-1.2,0.5-1.2,1.2v0.2c0,0.7,0.5,1.2,1.2,1.2c0.4,0,0.8-0.1,1.1-0.2c0.1,0.3,0.3,0.6,0.4,0.9 c2.4,0.8,3.7,2.7,3.7,5.1v0.3c0,1.1,0.9,1.9,1.9,1.9h1c1.1,0,1.9-0.9,1.9-1.9v-0.3c0-2.4,1.3-4.3,3.7-5.1 c0.8-0.2,1.5-0.6,2.1-1.1c-0.1,3.2-1.4,6.1-3.6,8.2C16.4,19.3,14.5,20,12.5,20z"/>
    </svg>
);

export const TypescriptIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 128 128" {...props}>
        <path fill="#007ACC" d="M0 0h128v128H0z"/>
        <path fill="#FFF" d="M23.33 91.26V36.74h12.82c5.96 0 10.45 1.13 13.48 3.39c3.03 2.26 4.54 5.56 4.54 9.9c0 4.96-1.89 8.61-5.68 10.95c-3.79 2.34-9.3 3.52-16.53 3.52h-1.89v26.76zm6.75-26.11h5.81c7.29 0 11.97-.9 14.05-2.71s3.12-4.63 3.12-8.47c0-3.6-1.04-6.23-3.12-7.88s-5.18-2.48-9.3-2.48h-7.31v21.54z"/>
        <path fill="#FFF" d="M68.53 92.2V63.99c0-5.74.4-10.04 1.19-12.92c.79-2.88 2.22-5.17 4.29-6.88c2.07-1.71 4.56-2.56 7.47-2.56c3.21 0 5.8.95 7.78 2.85c1.98 1.9 2.97 4.63 2.97 8.19V92.2H105V62.8c0-8.59-1.63-15.17-4.88-19.74c-3.25-4.57-7.98-6.86-14.19-6.86c-4.52 0-8.42 1.3-11.7 3.91c-3.28 2.61-5.46 6.07-6.53 10.4c-1.07 4.33-1.61 9.9-1.61 16.71V92.2z"/>
    </svg>
);

export const FigmaIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
        <path fillRule="evenodd" clipRule="evenodd" d="M7.5 22.5C5.29086 22.5 3.5 20.7091 3.5 18.5V14.5C3.5 12.2909 5.29086 10.5 7.5 10.5H11.5V14.5C11.5 16.7091 9.70914 18.5 7.5 18.5C5.29086 18.5 3.5 16.7091 3.5 14.5H7.5V22.5Z" fill="#F24E1E"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M3.5 9.5C3.5 7.29086 5.29086 5.5 7.5 5.5H11.5V9.5C11.5 11.7091 9.70914 13.5 7.5 13.5C5.29086 13.5 3.5 11.7091 3.5 9.5Z" fill="#FF7262"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M3.5 5.5C3.5 3.29086 5.29086 1.5 7.5 1.5C9.70914 1.5 11.5 3.29086 11.5 5.5V9.5H7.5C5.29086 9.5 3.5 7.70914 3.5 5.5Z" fill="#A259FF"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M11.5 1.5C13.7091 1.5 15.5 3.29086 15.5 5.5C15.5 7.70914 13.7091 9.5 11.5 9.5H7.5C9.70914 9.5 11.5 7.70914 11.5 5.5V1.5Z" fill="#1ABCFE"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M15.5 5.5C17.7091 5.5 19.5 7.29086 19.5 9.5C19.5 11.7091 17.7091 13.5 15.5 13.5C13.2909 13.5 11.5 11.7091 11.5 9.5C11.5 7.29086 13.2909 5.5 15.5 5.5Z" fill="#0ACF83"/>
    </svg>
);

export const TailwindIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const JupyterIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2Z" fill="#F37626"/>
        <circle cx="12" cy="12" r="5.5" fill="none" stroke="white" strokeWidth="1.5"/>
        <circle cx="5.5" cy="8.5" r="1.5" fill="white"/>
        <circle cx="18.5" cy="8.5" r="1.5" fill="white"/>
        <circle cx="12" cy="18.5" r="1.5" fill="white"/>
    </svg>
);
