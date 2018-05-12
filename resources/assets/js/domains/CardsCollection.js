import Card from './Card';

export default class CardsCollection
{
    constructor(cards)
    {
        this.cards = [];
        for(let i in cards) {
            this.cards.push(new Card(cards[i].id, cards[i].state, cards[i].value));
        }
    }

    getAll()
    {
        return this.cards;
    }

    getOpened()
    {
        let cards = this.cards.filter(card => card.isOpened());
        return cards;
    }

    closeAll()
    {
        this.cards.filter(card => card.isOpened()).forEach(card => card.close());
    }

    round()
    {
        let opened = this.getOpened();

        if(opened.length == 1) {
            return 0;
        }

        for(let i = 1; i < opened.length; i++) {
            if(!opened[i].match(opened[0])) {
                return 1;
            }
        }

        this.cards.filter(card => card.isOpened()).forEach(card => card.remove());
        return 1;
        
    }

    getClosed()
    {
        let cards = this.cards.filter(card => card.isClosed());
        return cards;
    }

}