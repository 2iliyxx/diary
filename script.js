const input = document.querySelector("#input");
const createButton = document.querySelector("#create");
const list = document.querySelector("#diary");
const filterBtn = document.querySelector("#filterByDate");
const searchInput = document.querySelector("#searchInput");
const searchBtn = document.querySelector("#searchButton");
const tagsGroup = document.querySelector(".tags");
const filterByTags = document.querySelector(".filter");
const noteDate = document.querySelector("#noteDate");
const noteTime = document.querySelector("#noteTime");
let notes = [];
let visibleNotes = notes;
let mode = 1;
let definingTags = [];

function dataCorrect(date) {
  const dateToCorrect = date.split(" ")[0].split("-");
  dateToCorrect.reverse();
  return dateToCorrect.join(".");
}

createButton.addEventListener("click", () => {
  if (input.value !== "") {
    var personalTag = tagsGroup.querySelector("#btn-check");
    var workTag = tagsGroup.querySelector("#btn-check-2");
    var studyingTag = tagsGroup.querySelector("#btn-check-3");
    var travelingTag = tagsGroup.querySelector("#btn-check-4");
    var funTag = tagsGroup.querySelector("#btn-check-5");
    const date = new Date();
    if (noteDate.value == "" && noteTime.value == "") {
      var localDate =
        date.toLocaleDateString() + " " + date.toLocaleTimeString();
    } else if (noteDate.value == "" && noteTime.value !== "") {
      var localDate = date.toLocaleDateString() + " " + noteTime.value + ":00";
    } else if (noteDate.value !== "" && noteTime.value == "") {
      correctDate = dataCorrect(noteDate.value);
      var localDate = correctDate + " " + date.toLocaleTimeString();
    } else if (noteDate.value !== "" && noteTime.value !== "") {
      var localDate =
        dataCorrect(noteDate.value) + " " + noteTime.value + ":00";
    }
    noteObject = {
      note: input.value,
      date: localDate,
      tags: {
        personal: personalTag.checked,
        work: workTag.checked,
        studying: studyingTag.checked,
        traveling: travelingTag.checked,
        fun: funTag.checked,
      },
    };
    notes.push(noteObject);
    personalTag.checked =
      workTag.checked =
      studyingTag.checked =
      travelingTag.checked =
      funTag.checked =
        false;
    input.value = "";
    render(notes);
  } else {
    alert("Note can not be blank");
  }
});

function getHtml(note, noteDate, index, tags) {
  return `<li class="list-group-item" data-date="${noteDate}" data-index=${index}>
  <span class="note-date">${noteDate}</span>
  <span class='note-text'>${note}</span>
  <span class='note-tags'><img src="label.png" alt="tags: " height='20'> ${tags}</span>
  <div class="note-actions">
          <button class="btn btn-info edit-btn" data-type='edit'  data-index=${index}'>Edit</button>
          <button class="btn btn-success save-btn" data-type='save'  data-index=${index} disabled>Save</button>
          <button class="btn btn-danger delete-btn" data-type='delete'  data-index=${index}'>Delete</button>
        </div>
  </li>`;
}

function stringToDate(stringDate) {
  const [day, month, year, hours, minutes, seconds] =
    stringDate.split(/[\s.:]+/);
  const dateObject = new Date(year, month - 1, day, hours, minutes, seconds);
  return dateObject;
}

// Sort
filterBtn.addEventListener("click", () => {
  let sortedNotes = [];
  if (visibleNotes.length < notes.length) {
    sortedNotes = visibleNotes.sort((a, b) => {
      const dateA = stringToDate(a.date);
      const dateB = stringToDate(b.date);
      return mode == -1 ? dateA - dateB : dateB - dateA;
    });
  } else {
    sortedNotes = notes.sort((a, b) => {
      const dateA = stringToDate(a.date);
      const dateB = stringToDate(b.date);
      return mode == -1 ? dateA - dateB : dateB - dateA;
    });
  }
  mode *= -1;
  render(sortedNotes);
});

// Search
searchBtn.addEventListener("click", function () {
  const request = searchInput.value.toLowerCase();
  if (request !== "") {
    const filteredNotes = notes.filter((el) => {
      return (
        el.note.toLowerCase().includes(request) ||
        el.date.toLowerCase().includes(request)
      );
    });
    visibleNotes = filteredNotes;
    render(filteredNotes);
  } else {
    visibleNotes = notes;
    render(notes);
  }
});

function render(arr) {
  list.innerHTML = "";
  for (let i = 0; i < arr.length; i++) {
    const { note, date, tags } = arr[i];
    const keys = Object.keys(tags);
    const activeKeys = keys.filter((el) => tags[el] == true);
    const showTags = activeKeys.length > 0 ? activeKeys : "No tags";
    list.insertAdjacentHTML("beforeend", getHtml(note, date, i, showTags));
  }
}

// Edit
list.addEventListener("click", function (event) {
  const listItem = event.target.closest(".list-group-item");
  if (!listItem) return;
  const index = listItem.dataset.index;
  const editButton = listItem.querySelector(".edit-btn");
  const saveButton = listItem.querySelector(".save-btn");
  const deleteButton = listItem.querySelector(".delete-btn");
  const noteText = listItem.querySelector(".note-text");
  const noteDate = listItem.querySelector(".note-date");
  const dateRageEx = /^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}:\d{2}$/;
  if (event.target == editButton) {
    noteText.contentEditable = true;
    noteDate.contentEditable = true;
    editButton.disabled = true;
    saveButton.disabled = false;
  } else if (event.target == saveButton) {
    const enteredDate = noteDate.textContent.trim();
    if (!dateRageEx.test(enteredDate)) {
      alert("Invalid date format.Please use format like DD.MM.YYYY HH:MM:SS");
      return;
    }
    noteText.contentEditable = false;
    noteDate.contentEditable = false;
    editButton.disabled = false;
    saveButton.disabled = true;
    const noteIndex = Array.from(list.children).indexOf(listItem);
    notes[noteIndex].note = noteText.textContent;
    notes[noteIndex].date = noteDate.textContent;
  } else if (event.target == deleteButton) {
    if (confirm("Are you sure?")) {
      notes.splice(index, 1);
      render(notes);
    }
  }
});

input.addEventListener("keyup", function (event) {
  event.preventDefault();
  if (event.keyCode == 13 && input.value.trim() !== "") {
    createButton.click();
  } else if (event.keyCode == 13 && input.value.trim() == "") {
    alert("Note can not be blank");
    input.value = "";
  }
});

filterByTags.addEventListener("input", function (event) {
  const checkBox = event.target.closest(".form-check-input");
  if (checkBox.checked) {
    if (!definingTags.includes(checkBox.value)) {
      definingTags.push(checkBox.value);
    } else {
      return;
    }
  } else {
    const index = definingTags.indexOf(checkBox.value);
    definingTags.splice(index, 1);
  }
  const filteredNotes = notes.filter((note) => {
    for (let defTag of definingTags) {
      if (!note.tags[defTag.toLowerCase()]) {
        return false;
      }
    }
    return true;
  });
  visibleNotes = filteredNotes;
  render(filteredNotes);
  console.log(filteredNotes);
});
