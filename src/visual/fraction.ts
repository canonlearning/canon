// Exact arithmetic on fractions, so a visual shows 9/1000 and not 0.009.

export type Fraction = { top: number; bottom: number };

// Reads a fraction written as "9/10".
export function fractionFrom(written: string): Fraction {
  const [top, bottom] = written.split("/").map(Number);
  if (!Number.isInteger(top) || !Number.isInteger(bottom) || bottom === 0) {
    throw new Error(`"${written}" is not a fraction such as 9/10.`);
  }
  return reduce({ top, bottom });
}

export function reduce(fraction: Fraction): Fraction {
  const divisor = greatestCommonDivisor(fraction.top, fraction.bottom);
  return { top: fraction.top / divisor, bottom: fraction.bottom / divisor };
}

function greatestCommonDivisor(a: number, b: number): number {
  return b === 0 ? a : greatestCommonDivisor(b, a % b);
}

export function times(a: Fraction, b: Fraction): Fraction {
  return reduce({ top: a.top * b.top, bottom: a.bottom * b.bottom });
}

export function plus(a: Fraction, b: Fraction): Fraction {
  return reduce({ top: a.top * b.bottom + b.top * a.bottom, bottom: a.bottom * b.bottom });
}

export function dividedBy(a: Fraction, b: Fraction): Fraction {
  return reduce({ top: a.top * b.bottom, bottom: a.bottom * b.top });
}

export function oneMinus(fraction: Fraction): Fraction {
  return reduce({ top: fraction.bottom - fraction.top, bottom: fraction.bottom });
}

// The fraction as a decimal number, e.g. for a length in a drawing.
export function toNumber(fraction: Fraction): number {
  return fraction.top / fraction.bottom;
}

export function fractionText(fraction: Fraction): string {
  return fraction.bottom === 1 ? String(fraction.top) : `${fraction.top}/${fraction.bottom}`;
}

// The sum of two fractions as text. When both have the same bottom, the
// sum keeps it, so 9/1000 + 99/1000 reads 108/1000 and not 27/250.
export function sumText(a: Fraction, b: Fraction): string {
  if (a.bottom === b.bottom) return `${a.top + b.top}/${a.bottom}`;
  return fractionText(plus(a, b));
}
