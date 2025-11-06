// Store mentors, sessions, and progress in localStorage
let mentors = JSON.parse(localStorage.getItem("mentors")) || [];
let sessions = JSON.parse(localStorage.getItem("sessions")) || [];
let progress = JSON.parse(localStorage.getItem("progress")) || [];

// ----- Admin: Add Mentor -----
const mentorForm = document.getElementById("mentorForm");
if (mentorForm) {
  mentorForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let newMentor = document.getElementById("newMentor").value;
    mentors.push(newMentor);
    localStorage.setItem("mentors", JSON.stringify(mentors));
    document.getElementById("newMentor").value = "";
    loadMentors();
  });
}

// ----- Show Mentors -----
function loadMentors() {
  let mentorList = document.getElementById("mentorList");
  let adminMentorList = document.getElementById("adminMentorList");
  if (mentorList) {
    mentorList.innerHTML = mentors.map(m => `<li>${m}</li>`).join("");
  }
  if (adminMentorList) {
    adminMentorList.innerHTML = mentors.map(m => `<li>${m}</li>`).join("");
  }
}
loadMentors();

// ----- Sessions -----
const sessionForm = document.getElementById("sessionForm");
if (sessionForm) {
  sessionForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let mentorName = document.getElementById("mentorName").value;
    let sessionDate = document.getElementById("sessionDate").value;
    sessions.push({ mentor: mentorName, date: sessionDate });
    localStorage.setItem("sessions", JSON.stringify(sessions));
    loadSessions();
    sessionForm.reset();
  });
}

function loadSessions() {
  let sessionList = document.getElementById("sessionList");
  if (sessionList) {
    sessionList.innerHTML = sessions
      .map(s => `<li>${s.mentor} - ${s.date}</li>`)
      .join("");
  }
}
loadSessions();

// ----- Progress -----
function addProgress() {
  let note = prompt("Enter your progress update:");
  if (note) {
    progress.push(note);
    localStorage.setItem("progress", JSON.stringify(progress));
    loadProgress();
  }
}

function loadProgress() {
  let progressList = document.getElementById("progressList");
  if (progressList) {
    progressList.innerHTML = progress.map(p => `<li>${p}</li>`).join("");
  }
}
loadProgress();
