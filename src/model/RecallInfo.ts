import { ProductId } from "./ProductInfo"
import { debugLog } from "../tools/Debug"

const fetch = window.fetch;

export type RecallInfo = {
    isRecalled: boolean,
    recallDetailsUrl?: string
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

export async function getRecallInfo(ean: ProductId): Promise<RecallInfo> {
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