const input = document.querySelector("#input");
const createButton = document.querySelector("#create");
const list = document.querySelector("#diary");
const filterBtn = document.querySelector("#filterByDate");
const searchInput = document.querySelector("#searchInput");
const searchBtn = document.querySelector("#searchButton");
let notes = [];
let visibleNotes = [];
let mode = 1;

createButton.addEventListener("click", () => {
  if (input.value !== "") {
    const date = new Date();
    const localDate =
      date.toLocaleDateString() + " " + date.toLocaleTimeString();
    notes.push({ note: input.value, date: localDate });
    input.value = "";
    render(notes);
  }
});

function getHtml(note, noteDate) {
  return `<li class="list-group-item" data-date="${noteDate}">
  <span class="note-date">${noteDate}</span>
  ${note}
</li>`;
}

function stringToDate(stringDate) {
  const [day, month, year, hours, minutes, seconds] =
    stringDate.split(/[\s.:]+/);
  const dateObject = new Date(year, month - 1, day, hours, minutes, seconds);
  return dateObject;
}

filterBtn.addEventListener("click", () => {
  if (visibleNotes.length < notes.length) {
    const sortedNotes = visibleNotes.sort((a, b) => {
      const dateA = stringToDate(a.date);
      const dateB = stringToDate(b.date);
      return mode == -1 ? dateA - dateB : dateB - dateA;
    });
  } else {
    const sortedNotes = notes.sort((a, b) => {
      const dateA = stringToDate(a.date);
      const dateB = stringToDate(b.date);
      return mode == -1 ? dateA - dateB : dateB - dateA;
    });
  }
  mode *= -1;
  render(sortedNotes);
});

searchBtn.addEventListener("click", function () {
  const request = searchInput.value;
  const filteredNotes = notes.filter((el) => {
    return el.note.includes(request);
  });
  visibleNotes = filteredNotes;
  render(filteredNotes);
});

function render(arr) {
  list.innerHTML = "";
  arr.forEach((element) => {
    const { note, date } = element;
    const listItem = document.createElement("li");
    listItem.classList.add("list-group-item");
    listItem.dataset.date = date;
    const dateSpan = document.createElement("span");
    dateSpan.classList.add("note-date");
    dateSpan.textContent = date.slice(0, -3);
    const noteText = document.createTextNode(note);
    listItem.appendChild(dateSpan);
    listItem.appendChild(noteText);
    list.appendChild(listItem);
  });
}
