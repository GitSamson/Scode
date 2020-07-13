console.log(1);
class Hi {
    content : string
    constructor(b : string){
        this.content = b;
        
    }
    yo(){
        return " " + this.content;
    }
    
}

let a = new Hi('assssd');
document.body.innerHTML = a.yo();