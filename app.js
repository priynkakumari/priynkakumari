// lenis
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

gsap.registerPlugin(ScrollTrigger);

lenis.on("scroll", ScrollTrigger.update);

// cursor
const cursor = document.getElementById("cursor");
const follower = document.getElementById("cursor-follower");

let mX = 0,
  mY = 0,
  pX = 0,
  pY = 0,
  fX = 0,
  fY = 0;

document.addEventListener("mousemove", (e) => {
  mX = e.clientX;
  mY = e.clientY;
});

function animateCursor() {
  pX += (mX - pX) * 0.2;
  pY += (mY - pY) * 0.2;

  fX += (mX - fX) * 0.1;
  fY += (mY - fY) * 0.1;

  cursor.style.left = `${pX}px`;
  cursor.style.top = `${pY}px`;

  follower.style.left = `${fX}px`;
  follower.style.top = `${fY}px`;

  requestAnimationFrame(animateCursor);
}

animateCursor();

// cursor hover
document.addEventListener("mouseover", (e) => {
  const target = e.target.closest("a, button, li");

  if (!target) return;

  cursor.style.transform = "translate(-50%, -50%) scale(4)";
  cursor.style.backgroundColor = "transparent";
  cursor.style.border = "1px solid var(--accent-color)";
});

document.addEventListener("mouseout", (e) => {
  const target = e.target.closest("a, button, li");

  if (!target) return;

  cursor.style.transform = "translate(-50%, -50%) scale(1)";
  cursor.style.backgroundColor = "var(--accent-color)";
  cursor.style.border = "none";
});

// projects
const projectsList = document.getElementById("projects-list");

function initProjectAnimations() {
  document.querySelectorAll(".reveal-img").forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: "top 80%",
      onEnter: () => el.classList.add("in-view"),
      onLeaveBack: () => el.classList.remove("in-view"),
    });
  });

  document.querySelectorAll(".parallax-img").forEach((img) => {
    gsap.to(img, {
      y: "15%",
      scrollTrigger: {
        trigger: img.parentElement,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });

  ScrollTrigger.refresh();
}

async function loadProjects() {
  try {
    const response = await fetch("./works.json");

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const projects = await response.json();

    projectsList.innerHTML = projects
      .map((project) => {
        return `
                    <article class="project-item ${project.reverse ? "reverse" : ""}">

                        ${
                          !project.reverse
                            ? `
                                    <div class="p-image-wrap reveal-img">
                                        <img
                                            src="${project.image}"
                                            alt="${project.alt}"
                                            class="p-image parallax-img"
                                        />
                                    </div>
                                `
                            : ""
                        }

                        <div class="p-info">
                            <div class="p-meta">
                                <span class="mono">${project.id}</span>
                                <span class="p-tags">${project.tags}</span>
                            </div>

                            <h3 class="big-text">
                                ${project.titleLines.join("<br />")}
                            </h3>

                            <p class="p-desc">
                                ${project.description}
                            </p>

                            <a
                                href="${project.url}"
                                class="mono link-underline"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                View Project &rarr;
                            </a>
                        </div>

                        ${
                          project.reverse
                            ? `
                                    <div class="p-image-wrap reveal-img">
                                        <img
                                            src="${project.image}"
                                            alt="${project.alt}"
                                            class="p-image parallax-img"
                                        />
                                    </div>
                                `
                            : ""
                        }

                    </article>
                `;
      })
      .join("");

    // initialize project animations
    initProjectAnimations();
  } catch (error) {
    console.error("Failed to load projects:", error);

    projectsList.innerHTML = `
            <p class="mono">
                Unable to load projects.
            </p>
        `;
  }
}

loadProjects();

// text animations
if (document.querySelector(".char-anim")) {
  new SplitType(".char-anim", {
    types: "chars",
  });

  gsap.from(".char-anim .char", {
    y: 100,
    opacity: 0,
    duration: 1.2,
    stagger: 0.02,
    ease: "power4.out",
    delay: 0.5,
  });
}

if (document.querySelector(".fade-in-up")) {
  gsap.from(".fade-in-up", {
    y: 40,
    opacity: 0,
    duration: 1.2,
    ease: "power3.out",
    delay: 1,
  });
}

// identity
const identityText = document.querySelector(".id-text");
if (identityText) {
  const split = new SplitType(identityText, { types: "lines" });
  split.lines.forEach((line) => {
    gsap.set(line, { yPercent: 100, opacity: 0 });
  });
  function animateIdentity() {
    gsap.fromTo(
      split.lines,
      { yPercent: 100, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.08,
        ease: "power4.out",
      },
    );
  }
  ScrollTrigger.create({
    trigger: identityText,
    start: "top 80%",
    onEnter: animateIdentity,
    onEnterBack: animateIdentity,
  });
}
