// =====================
// Neo4j Connection Utility
// =====================
import neo4j, { Driver, Session } from "neo4j-driver";

const URI = process.env.NEO4J_URI || "neo4j://localhost";
const USER = process.env.NEO4J_USER || "neo4j";
const PASSWORD = process.env.NEO4J_PASSWORD || "00000000";
const DATABASE = process.env.NEO4J_DATABASE || "cortyx-dev";

let driver: Driver | null = null;

/**
 * Get or create Neo4j driver instance (singleton pattern)
 */
export function getDriver(): Driver {
  if (!driver) {
    driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD), {
      maxConnectionPoolSize: 50,
      connectionAcquisitionTimeout: 60000,
    });
  }
  return driver;
}

/**
 * Get a new Neo4j session
 */
export function getSession(): Session {
  return getDriver().session({ database: DATABASE });
}

/**
 * Close the driver connection (call on app shutdown)
 */
export async function closeDriver() {
  if (driver) {
    await driver.close();
    driver = null;
  }
}

/**
 * Execute a read query
 */
export async function executeQuery<T = any>(
  query: string,
  parameters: Record<string, any> = {}
): Promise<T[]> {
  const session = getSession();
  try {
    const result = await session.executeRead((tx) =>
      tx.run(query, parameters)
    );
    return result.records.map((record) => record.toObject() as T);
  } finally {
    await session.close();
  }
}

/**
 * Execute a write query
 */
export async function executeWriteQuery<T = any>(
  query: string,
  parameters: Record<string, any> = {}
): Promise<T[]> {
  const session = getSession();
  try {
    const result = await session.executeWrite((tx) =>
      tx.run(query, parameters)
    );
    return result.records.map((record) => record.toObject() as T);
  } finally {
    await session.close();
  }
}

/**
 * Test database connection
 */
export async function testConnection(): Promise<boolean> {
  const session = getSession();
  try {
    await session.run("RETURN 1");
    return true;
  } catch (error) {
    console.error("Neo4j connection failed:", error);
    return false;
  } finally {
    await session.close();
  }
}