export default class Card
{
    constructor(id, state, value)
    {
        this.id = id;
        this.state = state;
        this.value = value;
    }

    open()
    {
        this.state = 1;
    }

    close()
    {
        this.state = 0;
    }

    remove()
    {
        this.state = -1;
    }

    isOpened()
    {
        return this.state === 1;
    }

    isClosed()
    {
        return this.state === 0;
    }

    isActive()
    {
        return this.state !== -1;
    }

    match(card)
    {
        return this.value === card.value;
    }
}