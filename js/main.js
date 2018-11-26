function navExpand() {
    var iframe = window.parent.document.getElementById("container-navbar");
    iframe.style.height = "20vw";
}

function navReset() {
    var iframe = window.parent.document.getElementById("container-navbar");
    iframe.style.height = "9vw";
}

function showTrinket() {
    let trinkets = document.getElementsByClassName("trinket-python");
    let loadings = document.getElementsByClassName("loading");
    for (i = 0; i < trinkets.length; i++) {
        trinkets[i].style.display = "block";
        loadings[i].style.display = "none";
    }
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