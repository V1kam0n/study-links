// Load saved links or create empty array
let links = JSON.parse(localStorage.getItem("links")) || [];

// Run when page loads
window.onload = function () {
    const list = document.getElementById("list");
    const filter = document.getElementById("filter");
    const subjects = new Set();

    list.innerHTML = "";

    links.forEach((link, index) => {
        subjects.add(link.subject);
        createLink(link.title, link.url, link.subject, index);
    });

    // Fill filter dropdown
    subjects.forEach(subject => {
        const option = document.createElement("option");
        option.value = subject;
        option.textContent = subject;
        filter.appendChild(option);
    });
};

// Add new link
function addLink() {
    const title = document.getElementById("title").value;
    const url = document.getElementById("url").value;
    const subject = document.getElementById("subject").value;

    if (title === "" || url === "" || subject === "") {
        alert("Please fill in all fields");
        return;
    }

    links.push({ title, url, subject });
    localStorage.setItem("links", JSON.stringify(links));

    location.reload(); // refresh UI
}

// Create link card
function createLink(title, url, subject, index) {
    const li = document.createElement("li");

    const a = document.createElement("a");
    a.textContent = `${title} (${subject})`;
    a.href = url;
    a.target = "_blank";

    const delBtn = document.createElement("button");
    delBtn.textContent = "❌";

    delBtn.onclick = function () {
        links.splice(index, 1);
        localStorage.setItem("links", JSON.stringify(links));
        location.reload();
    };

    li.appendChild(a);
    li.appendChild(delBtn);
    document.getElementById("list").appendChild(li);
}

// Filter by subject
function filterLinks() {
    const subjectSelected = document.getElementById("subjectFilter").value;
    const subtopicSelected = document.getElementById("subtopicFilter").value;
    const list = document.getElementById("list");

    list.innerHTML = "";

    links.forEach((link, index) => {

        //  FIRST FILTER: SUBJECT
        if (subjectSelected === "all") {

            //  SECOND FILTER: SUBTOPIC
            if (subtopicSelected === "all") {
                createLink(link.title, link.url, link.subject, index);

            } else {
                if (link.subtopic === subtopicSelected) {
                    createLink(link.title, link.url, link.subject, index);
                }
            }

        } else {

            if (link.subject === subjectSelected) {

                //  SECOND FILTER: SUBTOPIC
                if (subtopicSelected === "all") {
                    createLink(link.title, link.url, link.subject, index);

                } else {
                    if (link.subtopic === subtopicSelected) {
                        createLink(link.title, link.url, link.subject, index);
                    }
                }

            }
        }

    });
}
