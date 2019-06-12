let count = 0;

let log_data = [];


function clicker(require_confirm = true, interval_time = 1000) {
    if (require_confirm) {
        if (!confirm("Click?")) {
            return false;
        }
    } else {
        document.onkeypress=function(e){
            console.log("Stopping");
            return false;
        }
    }    
    click();
    setTimeout(function() {clicker(require_confirm, interval_time);}, interval_time);
}

function click() {
    let data = document.getElementsByClassName("Flxs($flx1) Flw(w) Fz($xl) Fw($bold) Pend(8px)");
    let cur_name;
    let bio_class = document.getElementsByClassName("P(16px) profileCard__bio Ta(start) Us(t) C($c-secondary) BreakWord Whs(pl) Fz($ms)");
    let bio_text;
    if (bio_class.length > 1) {
        bio_text = bio_class[0]["innerText"];
    } else {
        bio_text = "[ No Bio ]";
    }
    if (data.length > 1) {
        cur_name = data[1]["innerHTML"];
    } else {
        cur_name = data[0]["innerHTML"];
    }
    log(cur_name, bio_text);
    document.querySelector('[aria-label="Nope"]').click();
}

function log(name, bio) {
    log_data.push({
        "name": name,
        "bio": bio,
    });
    console.log("Clicked on", name, "with bio", bio);
}

function print_log() {
    console.log("The log has", log_data.length, "people");
    console.log(log);
}

function getNames() {
    let data = document.getElementsByClassName("Flxs($flx1) Flw(w) Fz($xl) Fw($bold) Pend(8px)");
    for (let i = 0; i < data.length; i++) {
        console.log(data[i]["innerHTML"]);
    }
}
