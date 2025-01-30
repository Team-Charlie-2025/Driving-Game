class Button {
    constructor(label, x, y, action) {
        this.label = label;
        this.x = x;
        this.y = y;
        this.width = 200;
        this.height = 50;
        this.action = action;
    }

    display() {
        if (this.isMouseOver()) {
            fill(100, 200, 255);
        } else {
            fill(200);
        }
        rectMode(CENTER);
        rect(this.x, this.y, this.width, this.height, 10);

        fill(0);
        textSize(24);
        text(this.label, this.x, this.y);
    }

    isMouseOver() {
        return (
            mouseX > this.x - this.width / 2 &&
            mouseX < this.x + this.width / 2 &&
            mouseY > this.y - this.height / 2 &&
            mouseY < this.y + this.height / 2
        );
    }

    handleClick() {
        if (this.isMouseOver()) {
            this.action();
        }
    }
}

function mousePressed() {
    for (let button of buttons) {
        button.handleClick();
    }
}