import { ProductId } from "./ProductInfo"
import { debugLog } from "../tools/Debug"

const fetch = window.fetch;
const MAX_ENTRY_AGE = 60 * 60;

export type RecallInfo = {
    isRecalled: boolean,
    recallDetailsUrl?: string
}

type CacheEntry = {
    recallInfo: RecallInfo,
    genTime: number
}

const recallInfoCache = new Map<ProductId, CacheEntry>();

function getCurrentTimeInSeconds() {
    return Math.floor(Date.now() / 1000);
}

function isStale(entry: CacheEntry) {
    const currentTime = getCurrentTimeInSeconds();
    return (currentTime - entry.genTime) >= MAX_ENTRY_AGE;
}

function createCacheEntry(recallInfo: RecallInfo) {
    return {
        recallInfo,
        genTime: getCurrentTimeInSeconds()
    };
}

function buildRappelConsoUrl(ean: ProductId) {
  const baseUrl = "https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/rappelconso-v2-gtin-trie/exports/json/";
  
  const params = new URLSearchParams({
    lang: "fr",
    timezone: "Europe/Paris",
    where: `((\`gtin\` = ${ean}))`
  });

  return `${baseUrl}?${params.toString()}`;
}

async function fetchRecallInfo(ean: ProductId): Promise<RecallInfo> {
    const url = buildRappelConsoUrl(ean);
    debugLog("url for " + ean + " is " + url);
    const response = await fetch(url);
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
        return {
            isRecalled: true,
            recallDetailsUrl: data[0].lien_vers_la_fiche_rappel as string
        };
    } else {
        return {
            isRecalled: false,
            recallDetailsUrl: undefined
        };
    }
}

export async function getRecallInfo(ean: ProductId): Promise<RecallInfo> {
    if (recallInfoCache.has(ean)) {
        const cacheEntry = recallInfoCache.get(ean);
        if (!isStale(cacheEntry!)) {
            return cacheEntry!.recallInfo;
        }
    }
    const recallInfo = await fetchRecallInfo(ean);
    recallInfoCache.set(ean, createCacheEntry(recallInfo));
    return recallInfo;
}