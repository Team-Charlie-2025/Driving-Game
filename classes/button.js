class Button {
    constructor(label, x, y, action) {
        this.label = label;
        this.x = x;
        this.y = y;
        //dynamic size for buttons on window resize
        this.width = windowWidth/10;
        this.height = windowHeight/20;
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
        //dynamic text size on window resize
        textSize(width/68);
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