import { type ClassValue, clsx } from 'clsx';
import { v4 as uuidv4 } from 'uuid';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: number): string {
  return `S/ ${price.toFixed(2)}`;
}

/**
 * Genera un ID único para pedidos usando UUID v4
 * UUID garantiza unicidad incluso en alta concurrencia
 */
export function generateOrderId(): string {
  return `ORD-${uuidv4()}`.toUpperCase();
}