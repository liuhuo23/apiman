export async function invokeBridge<T>(command: string, _payload?: unknown): Promise<T> {
  throw new Error(`Bridge command is not implemented yet: ${command}`);
}
