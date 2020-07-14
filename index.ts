console.log('bravo');
class Hi {
    content : string
    constructor(b : string){
        this.content = b;
        
    }
    yo(){
        return " " + this.content;
    }
    
}

let a = new Hi('if this is success! hello??');
document.body.innerHTML = a.yo()+"bitch!";