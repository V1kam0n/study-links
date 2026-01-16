let links = [];
const ADMIN_EMAIL = "admin@studylinks.com";

/* ---------- AUTH ---------- */

function loginAdmin() {
    firebase.auth()
        .signInWithEmailAndPassword(adminEmail.value, adminPassword.value)
        .catch(err => alert(err.message));
}

function logoutAdmin() {
    firebase.auth().signOut();
}

firebase.auth().onAuthStateChanged(user => {
    if (user && user.email === ADMIN_EMAIL) {
        userUI.style.display = "none";
        adminUI.style.display = "block";
        loginCard.style.display = "none";
        adminPanel.style.display = "block";
    } else {
        userUI.style.display = "block";
        adminUI.style.display = "none";
        loginCard.style.display = "block";
        adminPanel.style.display = "none";
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
    db.collection("links").add({
        title: title.value,
        url: url.value,
        subject: subject.value,
        subtopic: subtopic.value,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
}

/* ---------- USER DISPLAY ---------- */

function applyFilters() {
    const q = searchInput.value.toLowerCase();
    const s = subjectFilter.value;
    const sub = subtopicFilter.value;

    const filtered = links.filter(l =>
        (s === "all" || l.subject === s) &&
        (sub === "all" || l.subtopic === sub) &&
        (
            l.title.toLowerCase().includes(q) ||
            l.subject.toLowerCase().includes(q) ||
            l.subtopic.toLowerCase().includes(q)
        )
    );

    updateFilters();
    renderLinks(filtered);
}

function renderLinks(data) {
    list.innerHTML = "";

    data.forEach(link => {
        const li = document.createElement("li");

        const a = document.createElement("a");
        a.href = link.url;
        a.target = "_blank";
        a.textContent = `${link.title} (${link.subject} - ${link.subtopic})`;

        li.appendChild(a);
        list.appendChild(li);
    });
}

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
