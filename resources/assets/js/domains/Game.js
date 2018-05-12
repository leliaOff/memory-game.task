export default class Game
{
    constructor(cardsCollection)
    {
        this.cardsCollection = cardsCollection;
    }

    getCards()
    {
        return this.cardsCollection.getAll();
    }

    selectCard(card)
    {
        
        if(card.isOpened()) {
            return;
        }

        let opened = this.cardsCollection.getOpened();
        if(opened.length == 2) {
            this.cardsCollection.closeAll();
        }

        card.open();

        return this.cardsCollection.round();

    }

    isFinish()
    {
        let closed = this.cardsCollection.getClosed();
        return (closed.length === 0);
    }


}