const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error(
    'Missing required environment variable: NEXT_PUBLIC_API_URL\n' +
      'See apps/web/.env.example for reference.',
  );
}

if (!apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
  throw new Error(
    `Invalid NEXT_PUBLIC_API_URL: "${apiUrl}"\n` +
      'Must start with http:// or https://\n' +
      'See apps/web/.env.example for reference.',
  );
}

export const env = {
  NEXT_PUBLIC_API_URL: apiUrl,
} as const;
