function getJSON(url) { // From http://youmightnotneedjquery.com/
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            data = JSON.parse(request.responseText);
            body = data["body"];
            console.log("Data:",data);
            console.log("Body",body);
            next();
        } else { // We reached our target server, but it returned an error
            console.log("\n\nERROR: Wrong status code\n\n")
        }
    };

    request.onerror = function () {
        // There was a connection error of some sort
        console.log("\n\nERROR: Connection Error\n\n");
    };

    request.send();
}