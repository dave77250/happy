import { RecallInfo } from "../model/RecallInfo";


export type RecallMessageStripProps = {
    recallInfo: RecallInfo | undefined
}

export function RecallInfoMessageStrip(props: RecallMessageStripProps) {
    if (recallInfo !== undefined) {
        return recallInfo.isRecalled
            ? <MessageStrip design="Critical" hideCloseButton={true}>Ce produit fait l'objet d'un rappel</MessageStrip>
            : <MessageStrip design="Positive" hideCloseButton={true}>Ce produit ne fait pas l'objet d'un rappel</MessageStrip>;
    } else {
        return <MessageStrip design="Information" hideCloseButton={true}>Chargement des informations de rappel en cours</MessageStrip>;
    }
}