import { describe, it, expect } from 'vitest';
import { formatNumberWord } from './useCakeLogic';

describe('formatNumberWord', () => {
    it('formats small numbers correctly', () => {
        expect(formatNumberWord(0)).toBe('0');
        expect(formatNumberWord(10)).toBe('10');
        expect(formatNumberWord(999)).toBe('999');
    });

    it('formats thousands', () => {
        expect(formatNumberWord(1000)).toBe('1 Thousand');
        expect(formatNumberWord(1500)).toBe('1.5 Thousand');
        expect(formatNumberWord(10000)).toBe('10 Thousand');
        expect(formatNumberWord(100000)).toBe('100 Thousand');
    });

    it('formats millions', () => {
        expect(formatNumberWord(1000000)).toBe('1 Million');
        expect(formatNumberWord(1500000)).toBe('1.5 Million');
        expect(formatNumberWord(1234000)).toBe('1.23 Million');
        expect(formatNumberWord(100000000)).toBe('100 Million');
    });

    it('formats billions', () => {
        expect(formatNumberWord(1000000000)).toBe('1 Billion');
        expect(formatNumberWord(67670000000)).toBe('67.67 Billion');
    });
});
