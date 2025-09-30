const form = document.getElementById("workForm");
const workList = document.getElementById("workList");
const filter = document.getElementById("filter");
const search = document.getElementById("search");

let works = JSON.parse(localStorage.getItem("works")) || [];

function saveWorks() {
  localStorage.setItem("works", JSON.stringify(works));
}

function renderWorks() {
  workList.innerHTML = "";
  let filteredWorks = [...works];

  // Apply filter
  if (filter.value === "pending") {
    filteredWorks = filteredWorks.filter(w => !w.done);
  } else if (filter.value === "done") {
    filteredWorks = filteredWorks.filter(w => w.done);
  }

  // Apply search
  if (search.value.trim() !== "") {
    filteredWorks = filteredWorks.filter(w =>
      w.task.toLowerCase().includes(search.value.toLowerCase()) ||
      w.desc.toLowerCase().includes(search.value.toLowerCase())
    );
  }

  filteredWorks.forEach((work, index) => {
    const li = document.createElement("li");
    if (work.done) li.classList.add("done");

    li.innerHTML = `
      <div class="task-info">
        <strong>${work.task}</strong><br>
        ${work.desc}<br>
        <em>Deadline: ${work.date}</em>
      </div>
      <div class="actions">
        <button class="done-btn">✔</button>
        <button class="delete-btn">✖</button>
      </div>
    `;

    // Done button
    li.querySelector(".done-btn").addEventListener("click", () => {
      works[index].done = !works[index].done;
      saveWorks();
      renderWorks();
    });

    // Delete button
    li.querySelector(".delete-btn").addEventListener("click", () => {
      works.splice(index, 1);
      saveWorks();
      renderWorks();
    });

    workList.appendChild(li);
  });
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const task = document.getElementById("task").value;
  const desc = document.getElementById("desc").value;
  const date = document.getElementById("date").value;

  works.push({ task, desc, date, done: false });
  saveWorks();
  renderWorks();

  form.reset();
});

// Filter and Search listeners
filter.addEventListener("change", renderWorks);
search.addEventListener("input", renderWorks);

// Initial render
renderWorks();
