import { getNewGuid } from '@/util/utils';

export interface IObservablArrayItem{
    itemKey: string;
}


export default class ObservableArray{
    constructor(array: IObservablArrayItem[]){
        this.items = [];
        this.items.push(...array);
        this.items.forEach(item=>item.itemKey = getNewGuid());
    }
    items: IObservablArrayItem[];
}