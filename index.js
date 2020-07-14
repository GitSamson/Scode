console.log('bravo');
class Hi {
    constructor(b) {
        this.content = b;
    }
    yo() {
        return " " + this.content;
    }
}
let a = new Hi('if this is success! hello??');
document.body.innerHTML = a.yo() + "bitch";
//# sourceMappingURL=index.js.map