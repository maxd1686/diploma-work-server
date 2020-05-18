
export function isPostDataPayloadValid(reqBody: Record<string, string>) {
  if (typeof reqBody === 'object') {
    return JSON.stringify(Object.keys(reqBody)) === JSON.stringify(['data']) && typeof reqBody.data === 'string';
  }

  return false;
}