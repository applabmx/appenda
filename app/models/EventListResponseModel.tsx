import { string } from "mobx-state-tree/dist/internal";

export interface EventListResponseModel{
    events: Events[]
}
export interface Events{
    id: string,
    name: string,
    slug: string,
    description: string,
    is_free: boolean,
    price: number;
    images: Images[]
    categories: Categories[]
    place: Place
    price_range: PriceRange
    duration: number
    consumption_occasions: ConsumptionOccasions[]
}
interface Images{
    url:string;
}
export interface Categories{
    uuid:string,
    name:string,
    parent: null|string;
}
interface Place{
    name: string
}
interface PriceRange{
    min: number
    max: number;
}
interface ConsumptionOccasions{
    name: string
}

