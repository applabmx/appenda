export interface EvetnDetailResponseModel{
    id:string
    name: string
    slug:string
    description: string
    is_free: boolean
    price: number
    duration: number
    images: Images[]
    consumption_occasions: ConsumptionOccasions[]
    place: Place
}
interface Images{
    uuid: string
    url: string
}

interface ConsumptionOccasions{
    name: string
}

interface Place{
    name: string
    description: string
}