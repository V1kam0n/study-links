// Load saved links or empty array
let links = JSON.parse(localStorage.getItem("links")) || [];

// On page load
window.onload = function() {
    fillFilters();
    displayLinks();
};

// Add new link
function addLink() {
    const title = document.getElementById("title").value;
    const url = document.getElementById("url").value;
    const subject = document.getElementById("subject").value;
    const subtopic = document.getElementById("subtopic").value;

    if (!title || !url || !subject || !subtopic) {
        alert("Please fill all fields");
        return;
    }

    links.push({ title, url, subject, subtopic });
    localStorage.setItem("links", JSON.stringify(links));

    // Clear inputs
    document.getElementById("title").value = "";
    document.getElementById("url").value = "";
    document.getElementById("subject").value = "";
    document.getElementById("subtopic").value = "";

    fillFilters();
    displayLinks();
}

// Fill filter dropdowns
function fillFilters() {
    const subjectFilter = document.getElementById("subjectFilter");
    const subtopicFilter = document.getElementById("subtopicFilter");

    // Clear except "all"
    subjectFilter.innerHTML = '<option value="all">All Subjects</option>';
    subtopicFilter.innerHTML = '<option value="all">All Subtopics</option>';

    const subjects = new Set();
    const subtopics = new Set();

    links.forEach(link => {
        subjects.add(link.subject);
        subtopics.add(link.subtopic);
    });

    subjects.forEach(s => {
        const option = document.createElement("option");
        option.value = s;
        option.textContent = s;
        subjectFilter.appendChild(option);
    });

    subtopics.forEach(s => {
        const option = document.createElement("option");
        option.value = s;
        option.textContent = s;
        subtopicFilter.appendChild(option);
    });
}

// Display links with nested if–else filters
function displayLinks() {
    const list = document.getElementById("list");
    const subjectSelected = document.getElementById("subjectFilter").value;
    const subtopicSelected = document.getElementById("subtopicFilter").value;

    list.innerHTML = "";

    links.forEach((link, index) => {
        // Nested if–else
        if (subjectSelected === "all") {
            if (subtopicSelected === "all") {
                createLink(link, index);
            } else {
                if (link.subtopic === subtopicSelected) {
                    createLink(link, index);
                }
            }
        } else {
            if (link.subject === subjectSelected) {
                if (subtopicSelected === "all") {
                    createLink(link, index);
                } else {
                    if (link.subtopic === subtopicSelected) {
                        createLink(link, index);
                    }
                }
            }
        }
    });
}

// Create a link element
function createLink(link, index) {
    const li = document.createElement("li");

    const a = document.createElement("a");
    a.href = link.url;
    a.target = "_blank";
    a.textContent = `${link.title} (${link.subject} - ${link.subtopic})`;

    const delBtn = document.createElement("button");
    delBtn.textContent = "❌";
    delBtn.onclick = function() {
        links.splice(index, 1);
        localStorage.setItem("links", JSON.stringify(links));
        fillFilters();
        displayLinks();
    };

    li.appendChild(a);
    li.appendChild(delBtn);
    list.appendChild(li);
}
