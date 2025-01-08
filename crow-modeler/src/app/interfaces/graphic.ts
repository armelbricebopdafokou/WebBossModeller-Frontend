export interface Table{
    className:string;
    items:Column[];
    isWeak:boolean;

}

export class Column{

    name: string;
    type:string;
    isPrimary: boolean;
    iskey: boolean ;
    isForeignKey: boolean;

    

    constructor(name:string,type:string,isPrimary:boolean,iskey:boolean,isForeignKey:boolean){
        this.name=name;
        this.type=type;
        this.isPrimary=isPrimary;
        this.iskey=iskey;
        this.isForeignKey=isForeignKey;
    }

}