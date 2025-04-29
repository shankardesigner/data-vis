import { Attribute } from "../types";

export function parseAttributes(csvText: string): Record<number, Attribute> {
  const lines = csvText.trim().split('\n').slice(1);
  const attributes: Record<number, Attribute> = {};

  lines.forEach(line => {
    const [id, ...rest] = line.split(',');
    attributes[+id] = {
      id: +id,
      ...Object.fromEntries(rest.map((v, i) => [`attr${i}`, v])),
    };
  });

  return attributes;
}
