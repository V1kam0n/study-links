let isAdmin = false;
let links = [];

// LOGIN (TEMP – DEMO ONLY)
function loginAdmin() {
    const pass = document.getElementById("adminPassword").value;

    if (pass === "1234") {
        isAdmin = true;
        document.getElementById("loginCard").style.display = "none";
        document.querySelector(".add-section").style.display = "block";
        alert("Admin mode enabled");
    } else {
        alert("Wrong password");
    }
}

// ADD LINK
function addLink() {
    if (!isAdmin) return;

    const title = document.getElementById("title").value;
    const url = document.getElementById("url").value;
    const subject = document.getElementById("subject").value;
    const subtopic = document.getElementById("subtopic").value;

    if (!title || !url) return;

    db.collection("links").add({
        title,
        url,
        subject,
        subtopic,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    clearInputs();
}

// REALTIME LOAD
db.collection("links").orderBy("createdAt", "desc")
  .onSnapshot(snapshot => {
      links = [];
      snapshot.forEach(doc => {
          links.push({ id: doc.id, ...doc.data() });
      });
      displayLinks();
  });

// DISPLAY
function displayLinks(filtered = links) {
    const list = document.getElementById("list");
    list.innerHTML = "";

    filtered.forEach(link => {
        const li = document.createElement("li");

        const a = document.createElement("a");
        a.href = link.url;
        a.target = "_blank";
        a.textContent = `${link.title} (${link.subject} - ${link.subtopic})`;

        li.appendChild(a);

        if (isAdmin) {
            const del = document.createElement("button");
            del.textContent = "❌";
            del.onclick = () => {
                db.collection("links").doc(link.id).delete();
            };
            li.appendChild(del);
        }

        list.appendChild(li);
    });

    updateFilters();
}

// FILTER
function filterLinks() {
    let result = links;
    if (subjectFilter.value !== "all") {
        result = result.filter(l => l.subject === subjectFilter.value);
    }
    if (subtopicFilter.value !== "all") {
        result = result.filter(l => l.subtopic === subtopicFilter.value);
    }
    displayLinks(result);
}

// FILTER OPTIONS
function updateFilters() {
    subjectFilter.innerHTML = `<option value="all">All Subjects</option>`;
    subtopicFilter.innerHTML = `<option value="all">All Subtopics</option>`;

    [...new Set(links.map(l => l.subject))].forEach(s =>
        subjectFilter.innerHTML += `<option value="${s}">${s}</option>`
    );

    [...new Set(links.map(l => l.subtopic))].forEach(s =>
        subtopicFilter.innerHTML += `<option value="${s}">${s}</option>`
    );
}

function clearInputs() {
    title.value = "";
    url.value = "";
    subject.value = "";
    subtopic.value = "";
}
