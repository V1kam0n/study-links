let links = [];

db.collection("links").onSnapshot(snapshot => {
    links = [];
    snapshot.forEach(doc => links.push(doc.data()));
    displayLinks(links);
});

function displayLinks(data) {
    list.innerHTML = "";
    data.forEach(l => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = l.url;
        a.textContent = `${l.title} (${l.subject})`;
        a.target = "_blank";
        li.appendChild(a);
        list.appendChild(li);
    });
}

function filterLinks() {
    const s = subjectFilter.value;
    const sub = subtopicFilter.value;

    let result = links;
    if (s !== "all") result = result.filter(l => l.subject === s);
    if (sub !== "all") result = result.filter(l => l.subtopic === sub);

    displayLinks(result);
}
