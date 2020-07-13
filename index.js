console.log(1);
var Hi = /** @class */ (function () {
    function Hi(b) {
        this.content = b;
    }
    Hi.prototype.yo = function () {
        return " " + this.content;
    };
    return Hi;
}());
var a = new Hi('assssd');
document.body.innerHTML = a.yo();
//# sourceMappingURL=index.js.map