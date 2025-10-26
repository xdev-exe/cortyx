import ort from "onnxruntime-node";
import { AutoTokenizer } from "@xenova/transformers";
import { QdrantClient } from "@qdrant/js-client-rest";

const QDRANT_URL = process.env.QDRANT_URL || "http://localhost:6333";
const QDRANT_COLLECTION_NAME = "erp_knowledge_graph";
const VECTOR_DIMENSION = 1024;
const ONNX_MODEL_PATH = process.env.ONNX_MODEL_PATH || "C:/Users/xdev/Documents/quran/onnx-bge-m3/model.onnx";
const TOKENIZER_PATH = "BAAI/bge-m3";

let session: ort.InferenceSession | null = null;
let tokenizer: any = null;
let qdrantClient: QdrantClient | null = null;

/**
 * Initialize the embedding model, tokenizer, and Qdrant client
 */
export async function initializeVectorSearch() {
  try {
    console.log("[Vector Search] Loading embedding model and tokenizer...");
    session = await ort.InferenceSession.create(ONNX_MODEL_PATH);
    tokenizer = await AutoTokenizer.from_pretrained(TOKENIZER_PATH);
    qdrantClient = new QdrantClient({ url: QDRANT_URL });
    console.log(`[Vector Search] Initialized successfully. Connected to Qdrant at ${QDRANT_URL}`);
  } catch (error) {
    console.error("[Vector Search] Failed to initialize:", error);
    throw error;
  }
}

/**
 * Generate a vector embedding for a given text using CLS pooling
 */
async function embedText(text: string): Promise<number[]> {
  if (!session || !tokenizer) {
    throw new Error("Vector search not initialized. Call initializeVectorSearch() first.");
  }

  const encoded = await tokenizer(text, { padding: true, truncation: true });
  const input_ids_tensor = new ort.Tensor(
    "int64",
    encoded.input_ids.data.map(BigInt),
    encoded.input_ids.dims
  );
  const attention_mask_tensor = new ort.Tensor(
    "int64",
    encoded.attention_mask.data.map(BigInt),
    encoded.attention_mask.dims
  );

  const feeds = {
    input_ids: input_ids_tensor,
    attention_mask: attention_mask_tensor,
  };

  const output = await session.run(feeds);
  const clsEmbedding = output.last_hidden_state.data.slice(0, VECTOR_DIMENSION);
  return Array.from(clsEmbedding);
}

/**
 * Search for relevant documents in Qdrant based on a query and optional module filter
 */
export async function searchKnowledge(
  query: string,
  module?: string,
  limit: number = 5
): Promise<any[]> {
  if (!qdrantClient) {
    throw new Error("Qdrant client not initialized. Call initializeVectorSearch() first.");
  }

  console.log(`[Vector Search] Query: "${query}", Module filter: ${module || "none"}, Limit: ${limit}`);

  try {
    // Generate embedding for the query
    const queryVector = await embedText(query);

    // Build filter for module if provided
    const filter = module
      ? {
          must: [
            {
              key: "module",
              match: { value: module },
            },
          ],
        }
      : undefined;

    // Search in Qdrant
    const searchResult = await qdrantClient.search(QDRANT_COLLECTION_NAME, {
      vector: queryVector,
      limit,
      filter,
      with_payload: true,
    });

    console.log(`[Vector Search] Found ${searchResult.length} results`);
    console.log("[Vector Search] Results:", JSON.stringify(searchResult, null, 2));

    return searchResult;
  } catch (error) {
    console.error("[Vector Search] Error during search:", error);
    throw error;
  }
}

