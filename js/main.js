function navExpand() {
    var iframe = window.parent.document.getElementById("container-navbar");
    iframe.style.height = "20vw";
}

function navReset() {
    var iframe = window.parent.document.getElementById("container-navbar");
    iframe.style.height = "9vw";
}

class Console {
    constructor(id, autoScroll) {
        this.name = id;
        this.box = document.getElementById(id);
        this.autoScroll = autoScroll;
    }

    print(msg) {
        console.log(this.name+":",msg);
        this.box.value += msg;
        this.box.value += "\n";
        if (this.autoScroll) {
            this.scrollTop();
        }
    }

    scrollTop() {
        this.box.scrollTop = this.box.scrollHeight;
    }
}