/**
 * Node.js polyfills for browser environment
 * This file must be loaded before any other modules that depend on Node.js APIs
 */

// Import polyfills
import { Buffer } from "buffer";
import * as process from "process";

// Make Buffer available globally
if (typeof window !== "undefined") {
  (window as any).Buffer = Buffer;
  (window as any).process = process;
  (window as any).global = window;
}

// Also set up globalThis for Node.js compatibility
if (typeof globalThis !== "undefined") {
  (globalThis as any).Buffer = Buffer;
  (globalThis as any).process = process;
  (globalThis as any).global = globalThis;
}

// Set up global variables that some modules expect
if (typeof global !== "undefined") {
  (global as any).Buffer = Buffer;
  (global as any).process = process;
}

console.log("✅ Node.js polyfills loaded successfully");
