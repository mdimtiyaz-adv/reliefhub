// ------------------
// Firebase v8 Init
// ------------------
const firebaseConfig = {
  apiKey: "AIzaSyBlXpH8lSzHY_KiqfU9yuxdDaKY1B2Vamo",
  authDomain: "reliefhub-941e8.firebaseapp.com",
  projectId: "reliefhub-941e8",
  storageBucket: "reliefhub-941e8.firebasestorage.app",
  messagingSenderId: "764429613401",
  appId: "1:764429613401:web:26b537e3f6996513887448",
  measurementId: "G-EYJS121F7B"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ------------------
// Resource Form
// ------------------
document.getElementById("resourceForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const title = form.title.value;
  const type = form.type.value;
  const contact = form.contact.value;
  const description = form.description.value;
  const latitude = parseFloat(form.latitude.value);
  const longitude = parseFloat(form.longitude.value);

  try {
    await db.collection("resources").add({
      title,
      type,
      contact,
      description,
      latitude,
      longitude,
      approved: false,
      createdAt: new Date()
    });
    alert("Resource added successfully!");
    form.reset();
  } catch (err) {
    alert("Error: " + err.message);
  }
});

// ------------------
// Leaflet Map
// ------------------
const map = L.map('mapid').setView([26.45, 87.28], 7);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Firestore markers
db.collection("resources").onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    if(change.type === "added") {
      const data = change.doc.data();
      const lat = parseFloat(data.latitude);
      const lon = parseFloat(data.longitude);
      if(!isNaN(lat) && !isNaN(lon)) {
        L.marker([lat, lon])
          .addTo(map)
          .bindPopup(`<b>${data.title}</b><br>${data.type}<br>${data.contact}`);
      }
    }
  });
});

// ------------------
// News Section
// ------------------
async function loadNews() {
  try {
    const res = await fetch("https://gnews.io/api/v4/top-headlines?token=demo&q=disaster&lang=en");
    const data = await res.json();
    const newsContainer = document.getElementById("newsContainer");
    newsContainer.innerHTML = "";
    data.articles.slice(0, 6).forEach(article => {
      const div = document.createElement("div");
      div.className = "news-item";
      div.innerHTML = `
        <h3>${article.title}</h3>
        <p>${article.description || ""}</p>
        <a href="${article.url}" target="_blank">Read more</a>
      `;
      newsContainer.appendChild(div);
    });
  } catch (err) {
    console.error("Error loading news:", err);
  }
}

// Load news on page load
loadNews();
