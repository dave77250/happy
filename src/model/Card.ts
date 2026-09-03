export type CardId = string;

export type Card = {
    id: CardId,
    name: string,
    fullName: string,
    color: string,
    image: string,
    // infos pour identifier les cartes dans les import dreamborn ink
    setCode: string,
    number: number
}

export async function loadCards(): Promise<Card[]> {
    const response = await fetch('./allCards.json');
    const rawData = await response.json();
    const cards: any[] = rawData?.cards;
    return cards.map(card => {
        return {
            id: card?.id,
            name: card?.name,
            fullName: card?.fullName,
            color: card?.color,
            image: card?.images?.thumbnail,
            setCode: card?.setCode,
            number: card?.number
        }
    });
}