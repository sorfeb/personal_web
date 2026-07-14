import { contacts, email, identity, websiteUrl } from '../data/card';

/**
 * Builds a vCard 3.0 string from the card data.
 * Deliberately omits TEL — email is the only contact channel.
 */
export function buildVCard(): string {
  const [firstName, ...rest] = identity.name.split(' ');
  const lastName = rest.join(' ');
  const linkedIn = contacts.find((c) => c.label === 'LinkedIn')?.href;
  const gitHub = contacts.find((c) => c.label === 'GitHub')?.href;

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${toTitleCase(lastName)};${toTitleCase(firstName)};;;`,
    `FN:${toTitleCase(identity.name)}`,
    `TITLE:${identity.title}`,
    `ORG:${identity.org}`,
    `EMAIL;TYPE=INTERNET:${email}`,
    `URL:${websiteUrl}`,
    ...(linkedIn ? [`URL:${linkedIn}`] : []),
    ...(gitHub ? [`URL:${gitHub}`] : []),
    `ADR;TYPE=WORK:;;;${identity.location.replace(', ', ';;;')}`,
    `NOTE:${identity.tagline}`,
    'END:VCARD',
  ];

  // vCard spec requires CRLF line endings
  return lines.join('\r\n');
}

function toTitleCase(value: string): string {
  return value
    .toLowerCase()
    .replace(/(^|\s)\S/g, (char) => char.toUpperCase());
}

/**
 * Triggers a client-side download of the vCard so the OS offers
 * "Add to Contacts" — no server round-trip, no dependency.
 */
export function downloadVCard(filename = 'soros-febriano.vcf'): void {
  const blob = new Blob([buildVCard()], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
