export {};

// 1. Import for user-scoped extensions
import '../../../../public/global';
// 2. Import for server-scoped extensions
import '../../../../global';

// Define additional types if needed...
declare module '*.html' {
  const content: string;
  export default content;
}

declare module '*.css' {}

declare global {
  // Add global type declarations here
}
