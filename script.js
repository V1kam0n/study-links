let isAdmin = false;
let links = [];

/* ---------- AUTH ---------- */

function loginAdmin() {
    firebase.auth()
        .signInWithEmailAndPassword(
            adminEmail.value,
            adminPassword.value
        )
        .catch(err => alert(err.message));
}

function logoutAdmin() {
    firebase.auth().signOut();
}

firebase.auth().onAuthStateChanged(user => {
    if (user && user.email === "admin@studylinks.com") {
        isAdmin = true;
        loginCard.style.display = "none";
        document.querySelector(".add-section").style.display = "block";
    } else {
        isAdmin = false;
        loginCard.style.display = "block";
        document.querySelector(".add-section").style.display = "none";
    }
});

/* ---------- DATABASE ---------- */

db.collection("links")
  .orderBy("createdAt", "desc")
  .onSnapshot(snapshot => {
      links = [];
      snapshot.forEach(doc => {
          links.push({ id: doc.id, ...doc.data() });
      });
      applyFilters();
  });

function addLink() {
    if (!isAdmin) return;

    if (!title.value || !url.value) return;

    db.collection("links").add({
        title: title.value,
        url: url.value,
        subject: subject.value,
        subtopic: subtopic.value,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(err => alert(err.message));

    title.value = url.value = subject.value = subtopic.value = "";
}

/* ---------- DISPLAY ---------- */

function displayLinks(data) {
    list.innerHTML = "";

    data.forEach(link => {
        const li = document.createElement("li");

        const a = document.createElement("a");
        a.href = link.url;
        a.target = "_blank";
        a.textContent = `${link.title} (${link.subject} - ${link.subtopic})`;

        li.appendChild(a);

        if (isAdmin) {
            const del = document.createElement("button");
            del.textContent = "❌";
            del.onclick = () =>
                db.collection("links").doc(link.id).delete();
            li.appendChild(del);
        }

        list.appendChild(li);
    });
}

/* ---------- SEARCH + FILTER ---------- */

function applyFilters() {
    const s = subjectFilter.value;
    const sub = subtopicFilter.value;
    const q = searchInput.value.toLowerCase();

    const filtered = links.filter(l =>
        (s === "all" || l.subject === s) &&
        (sub === "all" || l.subtopic === sub) &&
        (
            l.title.toLowerCase().includes(q) ||
            l.subject.toLowerCase().includes(q) ||
            l.subtopic.toLowerCase().includes(q)
        )
    );

    updateFilterOptions();
    displayLinks(filtered);
}

function updateFilterOptions() {
    subjectFilter.innerHTML = `<option value="all">All Subjects</option>`;
    subtopicFilter.innerHTML = `<option value="all">All Subtopics</option>`;

    [...new Set(links.map(l => l.subject))].forEach(s =>
        subjectFilter.innerHTML += `<option value="${s}">${s}</option>`
    );

    [...new Set(links.map(l => l.subtopic))].forEach(s =>
        subtopicFilter.innerHTML += `<option value="${s}">${s}</option>`
    );
}
