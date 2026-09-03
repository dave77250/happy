import { CardId } from "./Card";

export type DeckCard = {
    id: CardId,
    owned: number,
    isUsable: boolean,
    excluded: number,
    selected: number,
    isAutoPicked: boolean
}

export function createDeckCardFrom(id: CardId, owned: number): DeckCard {
    return {
        id,
        owned,
        isUsable: true,
        excluded: 0,
        selected: 0,
        isAutoPicked: false
    };
}

export function pick(card: DeckCard, picked: number, isAutoPicked = false): DeckCard {
    return {
        ...card,
        selected: picked,
        isAutoPicked
    };
}

export function exclude(card: DeckCard, excluded: number): DeckCard {
    return {
        ...card,
        excluded
    };
}

export function setUsable(card: DeckCard, isUsable: boolean): DeckCard {
    return {
        ...card,
        isUsable
    };
}

export function getAvailable(card?: DeckCard): number {
    return card?.isUsable ? card.owned - card.excluded - card.selected: 0;
}
