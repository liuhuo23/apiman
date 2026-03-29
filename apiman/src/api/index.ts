import Database from '@tauri-apps/plugin-sql';

let db: Database | null = null;

export async function getDb(): Promise<Database> {
  if (!db) {
    db = await Database.load('sqlite:apiman.db');
  }
  return db;
}

export async function query<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  const database = await getDb();
  return database.select<T[]>(sql, params);
}

export async function executeInsert(sql: string, params: unknown[] = []): Promise<number> {
  const database = await getDb();
  await database.execute(sql, params);
  const result = await database.select<{ id: number }[]>('SELECT last_insert_rowid() as id');
  return result[0]?.id ?? 0;
}

export async function execute(sql: string, params: unknown[] = []): Promise<void> {
  const database = await getDb();
  await database.execute(sql, params);
}
