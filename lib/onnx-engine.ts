"use client";

// ============================================================================
// PURSTECH LOCAL ONNX RUNTIME WEB + INDEXEDDB ENGINE
// Reverse-engineered & enhanced from yossdotpro/removerized:
// - Dynamic CDN loader for onnxruntime-web@1.24.3 (zero Next.js bundler bloat)
// - IndexedDB streaming model cache (PursTechOnnxModelDB) with 30s stall guard
// - 9 Segmentation Models (ORMBG, ISNet, BiRefNet v2 Lite, RMBG 1.4, MODNet)
//   with stretch/letterbox/shortestEdge pre-processing & bilinear alpha upsampling
// - 2 Swin2SR x4 Super-Resolution Models with Tiled Overlapping Patch Engine
// - 2 DeOldify Artistic Colorizer Models with Luminance-Preserving Chroma Fusion
// ============================================================================

export type ActiveAiTool = "remover" | "upscaler" | "colorizer";

export type OnnxModelKey =
  | "ormbg_quantized"
  | "ormbg_fp16"
  | "isnet_quantized"
  | "isnet_fp16"
  | "birefnet_lite"
  | "birefnet_lite_fp16"
  | "rmbg_1_4_quantized"
  | "rmbg_1_4_fp16"
  | "modnet_quantized"
  | "swin2sr_quantized"
  | "swin2sr_fp16"
  | "deoldify_artistic_quantized"
  | "deoldify_artistic_fp16";

export type UpscalerPatchMode = "performance" | "balanced" | "quality";
export type ResizeMode = "letterbox" | "stretch" | "shortestEdge";
export type MaskOutputType = "probabilities" | "logits" | "minmax";

export interface SegmentationConfig {
  size: number;
  multipleOf?: number;
  mean: [number, number, number];
  std: [number, number, number];
  resize: ResizeMode;
  output: MaskOutputType;
}

export interface OnnxModelMeta {
  tool: ActiveAiTool;
  url: string;
  hfUrl: string;
  cacheKey: string;
  label: string;
  title: string;
  description: string;
  size: string;
  author: string;
  license: string;
  inputType: string;
  segmentation?: SegmentationConfig;
}

const IMAGENET_MEAN: [number, number, number] = [0.485, 0.456, 0.406];
const IMAGENET_STD: [number, number, number] = [0.229, 0.224, 0.225];

export const ONNX_MODELS: Record<OnnxModelKey, OnnxModelMeta> = {
  ormbg_quantized: {
    tool: "remover",
    url: "https://huggingface.co/onnx-community/ormbg-ONNX/resolve/main/onnx/model_quantized.onnx",
    hfUrl: "https://huggingface.co/onnx-community/ormbg-ONNX",
    cacheKey: "ormbg_quantized_v1",
    label: "ORMBG (Quantized — Fast Default)",
    title: "ORMBG — Object Removal from Background",
    description: "Balanced for web performance, hair edges, and speed (~44 MB)",
    size: "~44 MB",
    author: "ONNX Community",
    license: "Apache-2.0",
    inputType: "pixel_values",
    segmentation: { size: 1024, mean: [0, 0, 0], std: [1, 1, 1], resize: "stretch", output: "probabilities" },
  },
  ormbg_fp16: {
    tool: "remover",
    url: "https://huggingface.co/onnx-community/ormbg-ONNX/resolve/main/onnx/model_fp16.onnx",
    hfUrl: "https://huggingface.co/onnx-community/ormbg-ONNX",
    cacheKey: "ormbg_fp16_v1",
    label: "ORMBG (FP16 High Precision)",
    title: "ORMBG — Object Removal from Background",
    description: "Higher 16-bit floating point precision for complex edges (~88 MB)",
    size: "~88 MB",
    author: "ONNX Community",
    license: "Apache-2.0",
    inputType: "pixel_values",
    segmentation: { size: 1024, mean: [0, 0, 0], std: [1, 1, 1], resize: "stretch", output: "probabilities" },
  },
  isnet_quantized: {
    tool: "remover",
    url: "https://huggingface.co/onnx-community/ISNet-ONNX/resolve/main/onnx/model_quantized.onnx",
    hfUrl: "https://huggingface.co/onnx-community/ISNet-ONNX",
    cacheKey: "isnet_quantized_v1",
    label: "ISNet (Quantized)",
    title: "ISNet — Dichotomous Image Segmentation",
    description: "Sharp silhouette definition for products, logos & objects (~44 MB)",
    size: "~44 MB",
    author: "ONNX Community",
    license: "AGPL-3.0",
    inputType: "input",
    segmentation: { size: 1024, mean: [0.5, 0.5, 0.5], std: [1, 1, 1], resize: "stretch", output: "probabilities" },
  },
  isnet_fp16: {
    tool: "remover",
    url: "https://huggingface.co/onnx-community/ISNet-ONNX/resolve/main/onnx/model_fp16.onnx",
    hfUrl: "https://huggingface.co/onnx-community/ISNet-ONNX",
    cacheKey: "isnet_fp16_v1",
    label: "ISNet (FP16)",
    title: "ISNet — Dichotomous Image Segmentation",
    description: "High-precision silhouette segmentation without edge halos (~88 MB)",
    size: "~88 MB",
    author: "ONNX Community",
    license: "AGPL-3.0",
    inputType: "input",
    segmentation: { size: 1024, mean: [0.5, 0.5, 0.5], std: [1, 1, 1], resize: "stretch", output: "probabilities" },
  },
  birefnet_lite_fp16: {
    tool: "remover",
    url: "https://huggingface.co/onnx-community/BiRefNet_lite-ONNX/resolve/main/onnx/model_fp16.onnx",
    hfUrl: "https://huggingface.co/onnx-community/BiRefNet_lite-ONNX",
    cacheKey: "birefnet_lite_fp16_v2",
    label: "BiRefNet v2 Lite (FP16)",
    title: "BiRefNet Lite — Bilateral Reference Segmentation",
    description: "State-of-the-art bilateral reference matting for fine hair & fur (~115 MB)",
    size: "~115 MB",
    author: "ONNX Community",
    license: "MIT",
    inputType: "input_image",
    segmentation: { size: 1024, mean: IMAGENET_MEAN, std: IMAGENET_STD, resize: "stretch", output: "logits" },
  },
  birefnet_lite: {
    tool: "remover",
    url: "https://huggingface.co/onnx-community/BiRefNet_lite-ONNX/resolve/main/onnx/model.onnx",
    hfUrl: "https://huggingface.co/onnx-community/BiRefNet_lite-ONNX",
    cacheKey: "birefnet_lite_v1",
    label: "BiRefNet v2 Lite (FP32 Studio)",
    title: "BiRefNet v2 Lite — Full FP32 Precision",
    description: "Uncompressed 32-bit studio precision when edge accuracy is paramount (224 MB)",
    size: "224 MB",
    author: "ONNX Community",
    license: "MIT",
    inputType: "input_image",
    segmentation: { size: 1024, mean: IMAGENET_MEAN, std: IMAGENET_STD, resize: "stretch", output: "logits" },
  },
  rmbg_1_4_quantized: {
    tool: "remover",
    url: "https://huggingface.co/Xenova/bria-rmbg-1.4/resolve/main/onnx/model_quantized.onnx",
    hfUrl: "https://huggingface.co/Xenova/bria-rmbg-1.4",
    cacheKey: "rmbg_1_4_quantized_v1",
    label: "BRIA RMBG 1.4 (Quantized)",
    title: "BRIA RMBG 1.4 — Commercial-Grade Background Removal",
    description: "General-purpose e-commerce & portrait subject isolation (~44 MB)",
    size: "~44 MB",
    author: "Xenova / BRIA AI",
    license: "Non-Commercial",
    inputType: "pixel_values",
    segmentation: { size: 1024, mean: [0.5, 0.5, 0.5], std: [1, 1, 1], resize: "stretch", output: "minmax" },
  },
  rmbg_1_4_fp16: {
    tool: "remover",
    url: "https://huggingface.co/Xenova/bria-rmbg-1.4/resolve/main/onnx/model_fp16.onnx",
    hfUrl: "https://huggingface.co/Xenova/bria-rmbg-1.4",
    cacheKey: "rmbg_1_4_fp16_v1",
    label: "BRIA RMBG 1.4 (FP16)",
    title: "BRIA RMBG 1.4 — FP16 Precision",
    description: "Superior handling of semi-transparent objects and glass (~88 MB)",
    size: "~88 MB",
    author: "Xenova / BRIA AI",
    license: "Non-Commercial",
    inputType: "pixel_values",
    segmentation: { size: 1024, mean: [0.5, 0.5, 0.5], std: [1, 1, 1], resize: "stretch", output: "minmax" },
  },
  modnet_quantized: {
    tool: "remover",
    url: "https://huggingface.co/Xenova/modnet/resolve/main/onnx/model_quantized.onnx",
    hfUrl: "https://huggingface.co/Xenova/modnet",
    cacheKey: "modnet_quantized_v1",
    label: "MODNet (Ultra-Light Portrait ~25 MB)",
    title: "MODNet — Trimap-Free Portrait Matting",
    description: "Fastest & lightest model (~25 MB), optimized for human portraits & mobile",
    size: "~25 MB",
    author: "Xenova / ZHKKKe",
    license: "Apache-2.0",
    inputType: "pixel_values",
    segmentation: {
      size: 512,
      multipleOf: 32,
      mean: [0.5, 0.5, 0.5],
      std: [0.5, 0.5, 0.5],
      resize: "shortestEdge",
      output: "probabilities",
    },
  },
  swin2sr_quantized: {
    tool: "upscaler",
    url: "https://huggingface.co/onnx-community/swin2SR-realworld-sr-x4-64-bsrgan-psnr-ONNX/resolve/main/onnx/model_quantized.onnx",
    hfUrl: "https://huggingface.co/onnx-community/swin2SR-realworld-sr-x4-64-bsrgan-psnr-ONNX",
    cacheKey: "swin2sr_quantized_v1",
    label: "Swin2SR x4 (Quantized ~18 MB)",
    title: "Swin2SR — Swin Transformer 4× Real-World Super-Resolution",
    description: "Fast 4× neural super-resolution trained on BSRGAN real-world degradations (~18 MB)",
    size: "~18 MB",
    author: "ONNX Community",
    license: "Apache-2.0",
    inputType: "pixel_values",
  },
  swin2sr_fp16: {
    tool: "upscaler",
    url: "https://huggingface.co/onnx-community/swin2SR-realworld-sr-x4-64-bsrgan-psnr-ONNX/resolve/main/onnx/model_fp16.onnx",
    hfUrl: "https://huggingface.co/onnx-community/swin2SR-realworld-sr-x4-64-bsrgan-psnr-ONNX",
    cacheKey: "swin2sr_fp16_v1",
    label: "Swin2SR x4 (FP16 Precision ~36 MB)",
    title: "Swin2SR — Maximum Precision 4× Super-Resolution",
    description: "16-bit floating point Swin2SR transformer for maximum texture recovery (~36 MB)",
    size: "~36 MB",
    author: "ONNX Community",
    license: "Apache-2.0",
    inputType: "pixel_values",
  },
  deoldify_artistic_quantized: {
    tool: "colorizer",
    url: "https://huggingface.co/thookham/DeOldify-on-Browser/resolve/main/deoldify-quant.onnx",
    hfUrl: "https://huggingface.co/thookham/DeOldify-on-Browser",
    cacheKey: "deoldify_artistic_quantized_v2",
    label: "DeOldify Artistic (Quantized ~61 MB)",
    title: "DeOldify — NoGAN Deep Learning Photo Colorization",
    description: "Vibrant artistic color restoration for vintage B&W photos (~61 MB)",
    size: "~61 MB",
    author: "Jason Antic / Travis Hookham",
    license: "MIT",
    inputType: "input",
  },
  deoldify_artistic_fp16: {
    tool: "colorizer",
    url: "https://huggingface.co/thookham/DeOldify-on-Browser/resolve/main/deoldify-art.onnx",
    hfUrl: "https://huggingface.co/thookham/DeOldify-on-Browser",
    cacheKey: "deoldify_artistic_fp16_v2",
    label: "DeOldify Artistic (Full Precision ~243 MB)",
    title: "DeOldify — Studio Archival Photo Colorization",
    description: "Uncompressed artistic DeOldify weights for maximum tonal richness (~243 MB)",
    size: "~243 MB",
    author: "Jason Antic / Travis Hookham",
    license: "MIT",
    inputType: "input",
  },
};

export const UPSCALER_TILE_PRESETS: Record<
  UpscalerPatchMode,
  { label: string; description: string; patchSize: number; padding: number; detail: string }
> = {
  performance: {
    label: "Performance (Fastest)",
    description: "Fastest tile processing, lowest RAM footprint",
    patchSize: 32,
    padding: 1,
    detail: "patch 32 · pad 1",
  },
  balanced: {
    label: "Balanced (Recommended)",
    description: "Best speed and seam-free quality tradeoff",
    patchSize: 64,
    padding: 2,
    detail: "patch 64 · pad 2",
  },
  quality: {
    label: "Studio Quality (Max Detail)",
    description: "Largest receptive field per tile for finest micro-textures",
    patchSize: 128,
    padding: 4,
    detail: "patch 128 · pad 4",
  },
};

const IDB_NAME = "PursTechOnnxModelDB";
const IDB_STORE = "models";
const IDB_VERSION = 1;
const MODEL_FETCH_TIMEOUT_MS = 10 * 60 * 1000;
const MODEL_STALL_TIMEOUT_MS = 30 * 1000;

export const openModelDB = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB unavailable"));
      return;
    }
    const req = indexedDB.open(IDB_NAME, IDB_VERSION);
    req.onupgradeneeded = () => req.result.createObjectStore(IDB_STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

export const getFromIDB = (db: IDBDatabase, key: string): Promise<ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const req = db.transaction(IDB_STORE, "readonly").objectStore(IDB_STORE).get(key);
    req.onsuccess = () => resolve((req.result as ArrayBuffer) ?? null);
    req.onerror = () => reject(req.error);
  });

export const saveToIDB = (db: IDBDatabase, key: string, buf: ArrayBuffer): Promise<void> =>
  new Promise((resolve, reject) => {
    const req = db.transaction(IDB_STORE, "readwrite").objectStore(IDB_STORE).put(buf, key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });

export const isModelCached = async (modelKey: OnnxModelKey): Promise<boolean> => {
  try {
    const db = await openModelDB();
    const buf = await getFromIDB(db, ONNX_MODELS[modelKey].cacheKey);
    return buf !== null;
  } catch {
    return false;
  }
};

export const checkAndDownloadModel = async (
  modelKey: OnnxModelKey,
  onProgress: (pct: number, text: string) => void
): Promise<ArrayBuffer> => {
  const { url, cacheKey, label } = ONNX_MODELS[modelKey];
  const db = await openModelDB();

  const cached = await getFromIDB(db, cacheKey);
  if (cached) {
    onProgress(100, `Loaded ${label} from local IndexedDB cache`);
    return cached;
  }

  const controller = new AbortController();
  const fetchTimeoutId = setTimeout(() => controller.abort(), MODEL_FETCH_TIMEOUT_MS);

  try {
    onProgress(2, `Connecting to HuggingFace CDN for ${label}…`);
    const res = await fetch(url, {
      headers: { Accept: "*/*" },
      signal: controller.signal,
    });

    if (!res.ok) throw new Error(`Model download failed: ${res.status} ${res.statusText}`);

    if (!res.body) {
      const arrayBuffer = await res.arrayBuffer();
      await saveToIDB(db, cacheKey, arrayBuffer);
      onProgress(100, "Cached model in IndexedDB");
      return arrayBuffer;
    }

    const total = parseInt(res.headers.get("Content-Length") ?? "0", 10);
    const reader = res.body.getReader();
    const chunks: Uint8Array[] = [];
    let received = 0;

    const readWithTimeout = async () => {
      let timeoutId: ReturnType<typeof setTimeout> | undefined;
      try {
        return await Promise.race([
          reader.read(),
          new Promise<never>((_, reject) => {
            timeoutId = setTimeout(
              () => reject(new Error("Model download stalled for 30s. Check your connection.")),
              MODEL_STALL_TIMEOUT_MS
            );
          }),
        ]);
      } finally {
        if (timeoutId) clearTimeout(timeoutId);
      }
    };

    while (true) {
      const { done, value } = await readWithTimeout();
      if (done) break;
      chunks.push(value);
      received += value.length;
      if (total > 0) {
        const pct = Math.min(99, Math.round((received / total) * 100));
        const mbDone = (received / (1024 * 1024)).toFixed(1);
        const mbTotal = (total / (1024 * 1024)).toFixed(1);
        onProgress(pct, `Downloading ${label}… ${pct}% (${mbDone} / ${mbTotal} MB)`);
      } else {
        const pseudo = Math.min(95, Math.round(chunks.length * 1.5));
        onProgress(pseudo, `Downloading ${label}…`);
      }
    }

    const merged = new Uint8Array(chunks.reduce((n, c) => n + c.length, 0));
    let offset = 0;
    for (const chunk of chunks) {
      merged.set(chunk, offset);
      offset += chunk.length;
    }

    const arrayBuffer = merged.buffer;
    await saveToIDB(db, cacheKey, arrayBuffer);
    onProgress(100, `Cached ${label} in IndexedDB for instant offline reuse`);
    return arrayBuffer;
  } finally {
    clearTimeout(fetchTimeoutId);
  }
};

// Dynamic CDN loader for ONNX Runtime Web (avoids bundling .wasm files in Next.js build)
let ortPromise: Promise<any> | null = null;
const sessionMap: Partial<Record<OnnxModelKey, any>> = {};

export const loadOrtRuntime = (): Promise<any> => {
  if (typeof window === "undefined") return Promise.reject(new Error("Browser required"));
  if ((window as any).ort) return Promise.resolve((window as any).ort);
  if (ortPromise) return ortPromise;

  ortPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.24.3/dist/ort.min.js";
    script.async = true;
    script.onload = () => {
      const ort = (window as any).ort;
      if (!ort) {
        reject(new Error("ONNX Runtime Web failed to initialize on window.ort"));
        return;
      }
      ort.env.wasm.wasmPaths = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.24.3/dist/";
      ort.env.wasm.numThreads = 1;
      resolve(ort);
    };
    script.onerror = () => {
      ortPromise = null;
      reject(new Error("Could not load ONNX Runtime Web from jsDelivr CDN."));
    };
    document.head.appendChild(script);
  });

  return ortPromise;
};

export const getOrCreateOnnxSession = async (
  modelKey: OnnxModelKey,
  onProgress: (pct: number, text: string) => void
): Promise<{ ort: any; session: any }> => {
  const ort = await loadOrtRuntime();
  if (sessionMap[modelKey]) {
    return { ort, session: sessionMap[modelKey] };
  }
  const buffer = await checkAndDownloadModel(modelKey, onProgress);
  onProgress(99, `Compiling ${ONNX_MODELS[modelKey].label} WebAssembly session…`);
  const session = await ort.InferenceSession.create(buffer, {
    executionProviders: ["wasm"],
    graphOptimizationLevel: "all",
  });
  sessionMap[modelKey] = session;
  return { ort, session };
};

// ── Segmentation Pre/Post Processing (from removerized onnx-pipeline.ts) ────
export interface MaskRegion {
  x: number;
  y: number;
  width: number;
  height: number;
  inputWidth: number;
  inputHeight: number;
}

const roundToMultiple = (val: number, mult: number) => Math.max(mult, Math.round(val / mult) * mult);

export const getMaskRegion = (ow: number, oh: number, config: SegmentationConfig): MaskRegion => {
  const { size, resize } = config;
  const multiple = config.multipleOf ?? 1;
  if (resize === "shortestEdge") {
    const scale = size / Math.min(ow, oh);
    const width = roundToMultiple(ow * scale, multiple);
    const height = roundToMultiple(oh * scale, multiple);
    return { x: 0, y: 0, width, height, inputWidth: width, inputHeight: height };
  }
  if (resize === "letterbox") {
    const ratio = Math.min(size / ow, size / oh);
    const width = Math.max(1, Math.round(ow * ratio));
    const height = Math.max(1, Math.round(oh * ratio));
    return {
      x: Math.floor((size - width) / 2),
      y: Math.floor((size - height) / 2),
      width,
      height,
      inputWidth: size,
      inputHeight: size,
    };
  }
  return { x: 0, y: 0, width: size, height: size, inputWidth: size, inputHeight: size };
};

export const runSegmentationModel = async (
  imgEl: HTMLImageElement,
  modelKey: OnnxModelKey,
  onProgress: (pct: number, text: string) => void
): Promise<ImageData> => {
  const meta = ONNX_MODELS[modelKey];
  if (!meta.segmentation) throw new Error(`${modelKey} is not a segmentation model`);
  const { ort, session } = await getOrCreateOnnxSession(modelKey, onProgress);

  onProgress(85, "Pre-processing CHW tensor…");
  const config = meta.segmentation;
  const region = getMaskRegion(imgEl.naturalWidth, imgEl.naturalHeight, config);
  const W = region.inputWidth;
  const H = region.inputHeight;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, W, H);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(imgEl, region.x, region.y, region.width, region.height);

  const { data } = ctx.getImageData(0, 0, W, H);
  const { mean, std } = config;
  const plane = W * H;
  const float32 = new Float32Array(3 * plane);
  for (let i = 0; i < plane; i++) {
    float32[i] = (data[i * 4] / 255 - mean[0]) / std[0];
    float32[plane + i] = (data[i * 4 + 1] / 255 - mean[1]) / std[1];
    float32[plane * 2 + i] = (data[i * 4 + 2] / 255 - mean[2]) / std[2];
  }

  const inputTensor = new ort.Tensor("float32", float32, [1, 3, H, W]);
  onProgress(92, `Running ${meta.label} neural segmentation…`);
  const results = await session.run({ [meta.inputType]: inputTensor });
  const maskTensor = results[session.outputNames[0]];

  onProgress(97, "Bilinearly upsampling alpha mask to full resolution…");
  const ow = imgEl.naturalWidth;
  const oh = imgEl.naturalHeight;
  const dims = maskTensor.dims as number[];
  const mH = Number(dims[dims.length - 2]);
  const mW = Number(dims[dims.length - 1]);
  const raw = maskTensor.data as Float32Array;
  const mask = new Float32Array(raw.length);

  if (config.output === "logits") {
    for (let i = 0; i < raw.length; i++) mask[i] = 1 / (1 + Math.exp(-raw[i]));
  } else if (config.output === "minmax") {
    let min = Infinity, max = -Infinity;
    for (let i = 0; i < raw.length; i++) {
      if (raw[i] < min) min = raw[i];
      if (raw[i] > max) max = raw[i];
    }
    const range = max - min || 1;
    for (let i = 0; i < raw.length; i++) mask[i] = (raw[i] - min) / range;
  } else {
    for (let i = 0; i < raw.length; i++) mask[i] = Math.min(1, Math.max(0, raw[i]));
  }

  const bilinearAxis = (outSize: number, start: number, span: number, maskSize: number) => {
    const i0 = new Int32Array(outSize);
    const i1 = new Int32Array(outSize);
    const frac = new Float32Array(outSize);
    const scale = span / outSize;
    for (let i = 0; i < outSize; i++) {
      const pos = Math.min(maskSize - 1, Math.max(0, start + (i + 0.5) * scale - 0.5));
      const lo = Math.floor(pos);
      i0[i] = lo;
      i1[i] = Math.min(maskSize - 1, lo + 1);
      frac[i] = pos - lo;
    }
    return { i0, i1, frac };
  };

  const sx = mW / region.inputWidth;
  const sy = mH / region.inputHeight;
  const cols = bilinearAxis(ow, region.x * sx, region.width * sx, mW);
  const rows = bilinearAxis(oh, region.y * sy, region.height * sy, mH);

  const origCanvas = document.createElement("canvas");
  origCanvas.width = ow;
  origCanvas.height = oh;
  const origCtx = origCanvas.getContext("2d")!;
  origCtx.drawImage(imgEl, 0, 0);
  const origPx = origCtx.getImageData(0, 0, ow, oh);

  for (let y = 0; y < oh; y++) {
    const top = rows.i0[y] * mW;
    const bottom = rows.i1[y] * mW;
    const fy = rows.frac[y];
    for (let x = 0; x < ow; x++) {
      const x0 = cols.i0[x];
      const x1 = cols.i1[x];
      const fx = cols.frac[x];
      const upper = mask[top + x0] + (mask[top + x1] - mask[top + x0]) * fx;
      const lower = mask[bottom + x0] + (mask[bottom + x1] - mask[bottom + x0]) * fx;
      const val = upper + (lower - upper) * fy;
      const idx = (y * ow + x) * 4 + 3;
      origPx.data[idx] = Math.round(val * origPx.data[idx]);
    }
  }

  return origPx;
};

// ── Swin2SR 4x Tiled Super-Resolution Pipeline (from removerized upscaleTiled) ─
export const runSwin2SrTiledUpscale = async (
  imgEl: HTMLImageElement,
  modelKey: "swin2sr_quantized" | "swin2sr_fp16",
  patchMode: UpscalerPatchMode,
  onProgress: (pct: number, text: string) => void
): Promise<ImageData> => {
  const { ort, session } = await getOrCreateOnnxSession(modelKey, onProgress);
  const meta = ONNX_MODELS[modelKey];
  const { patchSize, padding } = UPSCALER_TILE_PRESETS[patchMode];

  const W = imgEl.naturalWidth;
  const H = imgEl.naturalHeight;
  const srcCanvas = document.createElement("canvas");
  srcCanvas.width = W;
  srcCanvas.height = H;
  const srcCtx = srcCanvas.getContext("2d")!;
  srcCtx.drawImage(imgEl, 0, 0);
  const pixels = srcCtx.getImageData(0, 0, W, H).data;

  const TILE_MULTIPLE = 8;
  const T = Math.ceil((patchSize + padding * 2) / TILE_MULTIPLE) * TILE_MULTIPLE;
  const cols = Math.ceil(W / patchSize);
  const rows = Math.ceil(H / patchSize);
  const total = cols * rows;

  let scale = 4;
  let OW = W * 4;
  let OH = H * 4;
  let out: Uint8ClampedArray | null = null;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const coreX = col * patchSize;
      const coreY = row * patchSize;
      const coreW = Math.min(patchSize, W - coreX);
      const coreH = Math.min(patchSize, H - coreY);
      const originX = coreX - padding;
      const originY = coreY - padding;

      const plane = T * T;
      const input = new Float32Array(3 * plane);
      for (let ty = 0; ty < T; ty++) {
        const sy = Math.min(H - 1, Math.max(0, originY + ty));
        for (let tx = 0; tx < T; tx++) {
          const sx = Math.min(W - 1, Math.max(0, originX + tx));
          const src = (sy * W + sx) * 4;
          const dst = ty * T + tx;
          input[dst] = pixels[src] / 255;
          input[plane + dst] = pixels[src + 1] / 255;
          input[plane * 2 + dst] = pixels[src + 2] / 255;
        }
      }

      const results = await session.run({
        [meta.inputType]: new ort.Tensor("float32", input, [1, 3, T, T]),
      });
      const output = results[session.outputNames[0]];
      const outDims = output.dims as number[];
      const outT = Number(outDims[outDims.length - 1]);
      const outPlane = outT * Number(outDims[outDims.length - 2]);
      const data = output.data as Float32Array;

      if (!out) {
        scale = Math.round(outT / T);
        OW = W * scale;
        OH = H * scale;
        if (OW * OH > 8192 * 8192) {
          throw new Error(`Upscaled dimensions (${OW}×${OH}) exceed 8192×8192 browser canvas ceiling.`);
        }
        out = new Uint8ClampedArray(OW * OH * 4);
      }

      const offset = padding * scale;
      for (let oy = 0; oy < coreH * scale; oy++) {
        const srcRow = (offset + oy) * outT + offset;
        const dstRow = ((coreY * scale + oy) * OW + coreX * scale) * 4;
        for (let ox = 0; ox < coreW * scale; ox++) {
          const src = srcRow + ox;
          const dst = dstRow + ox * 4;
          out[dst] = Math.max(0, Math.min(255, Math.round(data[src] * 255)));
          out[dst + 1] = Math.max(0, Math.min(255, Math.round(data[outPlane + src] * 255)));
          out[dst + 2] = Math.max(0, Math.min(255, Math.round(data[outPlane * 2 + src] * 255)));
          out[dst + 3] = 255;
        }
      }

      const done = row * cols + col + 1;
      const pct = Math.floor((done / total) * 100);
      onProgress(pct, `Swin2SR upscaling tile ${done} of ${total} (${pct}%)…`);
      await new Promise((r) => setTimeout(r, 0));
    }
  }

  // Preserve original alpha transparency if present
  let hasAlpha = false;
  for (let i = 3; i < pixels.length; i += 4) {
    if (pixels[i] < 255) {
      hasAlpha = true;
      break;
    }
  }
  if (hasAlpha && out) {
    const alphaCanvas = document.createElement("canvas");
    alphaCanvas.width = OW;
    alphaCanvas.height = OH;
    const aCtx = alphaCanvas.getContext("2d")!;
    aCtx.imageSmoothingEnabled = true;
    aCtx.imageSmoothingQuality = "high";
    aCtx.drawImage(imgEl, 0, 0, OW, OH);
    const alphaPx = aCtx.getImageData(0, 0, OW, OH).data;
    for (let i = 3; i < out.length; i += 4) out[i] = alphaPx[i];
  }

  return new ImageData(out! as Uint8ClampedArray<ArrayBuffer>, OW, OH);
};

// ── DeOldify Luminance-Preserving Chroma Colorizer (from removerized) ────────
export const runDeOldifyColorizer = async (
  imgEl: HTMLImageElement,
  modelKey: "deoldify_artistic_quantized" | "deoldify_artistic_fp16",
  saturationBoost: number,
  onProgress: (pct: number, text: string) => void
): Promise<ImageData> => {
  const { ort, session } = await getOrCreateOnnxSession(modelKey, onProgress);
  const meta = ONNX_MODELS[modelKey];

  onProgress(82, "Preparing 256×256 aspect-preserved luminance tensor…");
  const size = 256;
  const ow = imgEl.naturalWidth;
  const oh = imgEl.naturalHeight;
  const ratio = Math.min(size / ow, size / oh);
  const drawW = Math.max(1, Math.round(ow * ratio));
  const drawH = Math.max(1, Math.round(oh * ratio));
  const offX = Math.round((size - drawW) / 2);
  const offY = Math.round((size - drawH) / 2);

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, size, size);
  ctx.drawImage(imgEl, offX, offY, drawW, drawH);

  const { data } = ctx.getImageData(0, 0, size, size);
  const float32 = new Float32Array(3 * size * size);
  for (let i = 0; i < size * size; i++) {
    const gray = 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2];
    float32[i] = gray;
    float32[size * size + i] = gray;
    float32[size * size * 2 + i] = gray;
  }

  onProgress(90, `Running ${meta.label} neural chroma synthesis…`);
  const results = await session.run({
    [meta.inputType]: new ort.Tensor("float32", float32, [1, 3, size, size]),
  });
  const tensor = results[session.outputNames[0]];

  onProgress(96, "Fusing predicted chroma onto original full-resolution luminance…");
  const tH = Number(tensor.dims[2]) || size;
  const tW = Number(tensor.dims[3]) || size;
  const colorCanvas = document.createElement("canvas");
  colorCanvas.width = tW;
  colorCanvas.height = tH;
  const colorCtx = colorCanvas.getContext("2d")!;
  const colorImageData = colorCtx.createImageData(tW, tH);
  const outData = tensor.data as Float32Array;
  const plane = tW * tH;

  for (let i = 0; i < plane; i++) {
    colorImageData.data[i * 4] = Math.max(0, Math.min(255, outData[i]));
    colorImageData.data[i * 4 + 1] = Math.max(0, Math.min(255, outData[plane + i]));
    colorImageData.data[i * 4 + 2] = Math.max(0, Math.min(255, outData[plane * 2 + i]));
    colorImageData.data[i * 4 + 3] = 255;
  }
  colorCtx.putImageData(colorImageData, 0, 0);

  const rRatio = Math.min(tW / ow, tH / oh);
  const contentW = Math.max(1, Math.round(ow * rRatio));
  const contentH = Math.max(1, Math.round(oh * rRatio));
  const cropX = Math.max(0, Math.round((tW - contentW) / 2));
  const cropY = Math.max(0, Math.round((tH - contentH) / 2));

  const resizedColorCanvas = document.createElement("canvas");
  resizedColorCanvas.width = ow;
  resizedColorCanvas.height = oh;
  const rCtx = resizedColorCanvas.getContext("2d")!;
  rCtx.imageSmoothingEnabled = true;
  rCtx.imageSmoothingQuality = "high";
  rCtx.drawImage(colorCanvas, cropX, cropY, contentW, contentH, 0, 0, ow, oh);

  const blurredColorCanvas = document.createElement("canvas");
  blurredColorCanvas.width = ow;
  blurredColorCanvas.height = oh;
  const bCtx = blurredColorCanvas.getContext("2d")!;
  bCtx.filter = `blur(1.25px) saturate(${saturationBoost}%)`;
  bCtx.drawImage(resizedColorCanvas, 0, 0);

  const outCanvas = document.createElement("canvas");
  outCanvas.width = ow;
  outCanvas.height = oh;
  const outCtx = outCanvas.getContext("2d")!;
  outCtx.drawImage(imgEl, 0, 0, ow, oh);
  outCtx.globalCompositeOperation = "color";
  outCtx.drawImage(blurredColorCanvas, 0, 0, ow, oh);
  outCtx.globalCompositeOperation = "source-over";

  return outCtx.getImageData(0, 0, ow, oh);
};
