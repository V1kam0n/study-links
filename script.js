let links = JSON.parse(localStorage.getItem("links")) || [];

// Load saved links when page opens
window.onload = function () {
    links.forEach(link => createLink(link.title, link.url, link.subject));
};

function addLink() {
    const title = document.getElementById("title").value;
    const url = document.getElementById("url").value;
    const subject = document.getElementById("subject").value;

    if (title === "" || url === "") {
        alert("Please fill in title and URL");
        return;
    }

    const link = { title, url, subject };
    links.push(link);
    localStorage.setItem("links", JSON.stringify(links));

    createLink(title, url, subject);

    document.getElementById("title").value = "";
    document.getElementById("url").value = "";
    document.getElementById("subject").value = "";
}

function createLink(title, url, subject) {
    const li = document.createElement("li");
    const a = document.createElement("a");

    a.textContent = `${title} (${subject})`;
    a.href = url;
    a.target = "_blank";

    li.appendChild(a);
    document.getElementById("list").appendChild(li);
}
