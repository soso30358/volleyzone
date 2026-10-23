document.documentElement.classList.add("js-ready");

document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const menuToggle = document.getElementById("menuToggle");
  const overlay = document.getElementById("sidebarOverlay");
  const navLinks = [...document.querySelectorAll(".nav-link")];

  // MOBILE NAVIGATION
  function setMenu(open) {
    sidebar.classList.toggle("open", open);
    overlay.classList.toggle("visible", open);
    document.body.classList.toggle("menu-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute(
      "aria-label",
      open ? "Close navigation" : "Open navigation"
    );
    menuToggle.textContent = open ? "✕" : "☰";
  }

  menuToggle.addEventListener("click", () => {
    setMenu(!sidebar.classList.contains("open"));
  });

  overlay.addEventListener("click", () => setMenu(false));

  navLinks.forEach(link => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") setMenu(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) setMenu(false);
  });

  // ACTIVE NAVIGATION LINK
  const sections = navLinks
    .map(link => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        navLinks.forEach(link => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      });
    }, {
      rootMargin: "-20% 0px -65% 0px",
      threshold: 0
    });

    sections.forEach(section => sectionObserver.observe(section));
  }

  // SUBTLE REVEAL ANIMATIONS
 const revealItems = document.querySelectorAll(
  ".hero-content, .hero-image, .hero-visual, .hero-copy, " +
  ".stat-card, .rule-row, .skill-card, .exercise-card, " +
  ".rotation-panel, .rotation-info, .program-list, " +
  ".day-detail, .final-cta"
);

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    revealItems.forEach(item => {
      item.classList.add("reveal");
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
  }

  // EXERCISE TRACKER
  const drillButtons = [...document.querySelectorAll(".complete-btn")];
  const progressText = document.getElementById("drillProgressText");
  const progressBar = document.getElementById("drillProgressBar");
  const resetDrills = document.getElementById("resetDrills");

  function updateDrillProgress() {
    const completed = drillButtons.filter(button =>
      button.classList.contains("completed")
    ).length;

    progressText.textContent = `${completed} / ${drillButtons.length}`;
    progressBar.style.width =
      `${drillButtons.length ? completed / drillButtons.length * 100 : 0}%`;
  }

  drillButtons.forEach(button => {
    button.addEventListener("click", () => {
      const completed = button.classList.toggle("completed");

      button.setAttribute("aria-pressed", String(completed));
      button.innerHTML = completed
        ? 'Completed <span>✓</span>'
        : 'Mark complete <span>＋</span>';

      updateDrillProgress();
    });
  });

  resetDrills.addEventListener("click", () => {
    drillButtons.forEach(button => {
      button.classList.remove("completed");
      button.setAttribute("aria-pressed", "false");
      button.innerHTML = 'Mark complete <span>＋</span>';
    });

    updateDrillProgress();
  });

  updateDrillProgress();

  // 7-DAY TRAINING PLAN
  const trainingDays = [
    {
      title: "Passing fundamentals",
      description: "Build a reliable first touch with controlled, repeatable technique.",
      time: 20,
      tasks: [
        "Warm-up and mobility",
        "Practise forearm passing",
        "Cool down and reflect"
      ]
    },
    {
      title: "Setting & coordination",
      description: "Improve hand positioning, body balance and consistent ball control.",
      time: 20,
      tasks: [
        "Warm up your fingers and shoulders",
        "Practise controlled overhead sets",
        "Review your accuracy"
      ]
    },
    {
      title: "Serving practice",
      description: "Develop a consistent serving routine and aim for a safe target area.",
      time: 25,
      tasks: [
        "Warm up your shoulder",
        "Practise your serving technique",
        "Record your successful serves"
      ]
    },
    {
      title: "Movement & footwork",
      description: "Work on balanced movement, ready position and efficient court coverage.",
      time: 15,
      tasks: [
        "Dynamic warm-up",
        "Practise lateral footwork",
        "Finish with light mobility"
      ]
    },
    {
      title: "Spiking & approach",
      description: "Practise your approach rhythm, arm swing and timing without forcing jumps.",
      time: 20,
      tasks: [
        "Warm up and rehearse steps",
        "Practise approach footwork",
        "Cool down your legs"
      ]
    },
    {
      title: "Defence & reaction",
      description: "Improve your ready position, reaction and controlled defensive movement.",
      time: 20,
      tasks: [
        "Warm up with easy movement",
        "Practise defensive positioning",
        "Review your reactions"
      ]
    },
    {
      title: "Review & recovery",
      description: "Reflect on your progress and give your body time to recover.",
      time: 15,
      tasks: [
        "Light mobility",
        "Review your strongest skill",
        "Plan your next practice"
      ]
    }
  ];

  const dayButtons = [...document.querySelectorAll(".day-row")];
  const detailDay = document.getElementById("detailDay");
  const detailTitle = document.getElementById("detailTitle");
  const detailDescription = document.getElementById("detailDescription");
  const detailTime = document.getElementById("detailTime");
  const sessionList = document.getElementById("sessionList");
  const completeDayButton = document.getElementById("completeDay");

  let selectedDay = 0;

  function renderDay(index) {
    selectedDay = index;
    const day = trainingDays[index];

    dayButtons.forEach((button, buttonIndex) => {
      const selected = buttonIndex === index;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });

    detailDay.textContent =
      `DAY ${String(index + 1).padStart(2, "0")} / 07`;
    detailTitle.textContent = day.title;
    detailDescription.textContent = day.description;
    detailTime.textContent = `${day.time} minutes`;

    sessionList.replaceChildren();

    day.tasks.forEach(task => {
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      const text = document.createElement("span");

      checkbox.type = "checkbox";
      checkbox.className = "session-checkbox";
      checkbox.setAttribute("aria-label", task);
      text.textContent = task;

      label.append(checkbox, text);
      sessionList.appendChild(label);
    });

    updateSessionButton();
  }

  function updateSessionButton() {
    const checks = [...sessionList.querySelectorAll("input[type='checkbox']")];
    const allDone = checks.length > 0 && checks.every(check => check.checked);

    completeDayButton.innerHTML = allDone
      ? 'Session completed <span>✓</span>'
      : 'Complete session <span>✓</span>';

    completeDayButton.classList.toggle("session-completed", allDone);
  }

  dayButtons.forEach(button => {
    button.addEventListener("click", () => {
      renderDay(Number(button.dataset.day));
    });
  });

  sessionList.addEventListener("change", updateSessionButton);

  completeDayButton.addEventListener("click", () => {
    const checks = [...sessionList.querySelectorAll("input[type='checkbox']")];

    if (checks.every(check => check.checked)) {
      checks.forEach(check => {
        check.checked = false;
      });
    } else {
      checks.forEach(check => {
        check.checked = true;
      });
    }

    updateSessionButton();
  });

  renderDay(0);
});
