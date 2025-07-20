/// <reference types="react" />

// Module declarations for alias paths
declare module '@/hooks/*';
declare module '@/components/*';
declare module '@/lib/*';

// React and JSX definitions
declare namespace JSX {
  interface IntrinsicElements {
    div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    header: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    h1: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
    h2: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
    h3: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
    p: React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
    span: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
    a: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
    button: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
    input: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
    // For other HTML elements, we use a generic definition
    [elemName: string]: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  }
}

// Framer Motion definitions
import { ReactNode } from 'react';

declare module 'framer-motion' {
  export interface MotionProps {
    initial?: any;
    animate?: any;
    exit?: any;
    transition?: any;
    variants?: any;
    style?: React.CSSProperties;
    className?: string;
    [key: string]: any;
  }

  export interface AnimatePresenceProps {
    children?: ReactNode;
    mode?: "sync" | "wait" | "popLayout";
    initial?: boolean;
    onExitComplete?: () => void;
    custom?: any;
    presenceAffectsLayout?: boolean;
  }

  interface MotionComponent<P = {}> {
    (props: P & MotionProps): React.ReactElement;
  }

  type HTMLMotionComponents = {
    [K in keyof JSX.IntrinsicElements]: MotionComponent<JSX.IntrinsicElements[K]>;
  };

  export interface Motion extends HTMLMotionComponents {
    custom: MotionComponent;
  }

  export const motion: Motion;
  export const AnimatePresence: React.FC<AnimatePresenceProps>;
}
