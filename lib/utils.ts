import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function formatCEFRLevel(level: string): string {
  return level.toUpperCase();
}

export function formatFormality(formality: string): string {
  return formality.charAt(0).toUpperCase() + formality.slice(1);
}

export function formatConnectorType(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1).replace(/-/g, ' ');
}
