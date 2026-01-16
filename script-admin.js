firebase.auth().onAuthStateChanged(user => {
    if (user) {
        loginCard.style.display = "none";
        adminPanel.style.display = "block";
    } else {
        loginCard.style.display = "block";
        adminPanel.style.display = "none";
    }
});

function login() {
    firebase.auth().signInWithEmailAndPassword(email.value, password.value)
        .catch(err => alert(err.message));
}

function logout() {
    firebase.auth().signOut();
}

function addLink() {
    db.collection("links").add({
        title: title.value,
        url: url.value,
        subject: subject.value,
        subtopic: subtopic.value,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
}
