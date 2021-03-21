export type Context =
  | Record<string, unknown>
  | (() => Record<string, unknown>)
  | (() => Promise<Record<string, unknown>>);

export async function resolveContext(
  context: Context | undefined
): Promise<Record<string, unknown> | undefined> {
  if (typeof context === 'undefined') {
    return context;
  }

  if (typeof context === 'function') {
    return resolveContext(await context());
  }

  const output: Record<string, unknown> = {};

  for (const key of Object.keys(context)) {
    const value = context[key];

    if (typeof value === 'function') {
      output[key] = await value();
    } else {
      output[key] = context[key];
    }
  }

  return output;
}