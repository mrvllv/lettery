document.addEventListener("DOMContentLoaded", function () {
  const envelope = document.getElementById("openLetter");
  const letterSection = document.getElementById("letterSection");
  const openText = document.getElementById("openText");
  const petalsLayer = document.getElementById("petalsLayer");
  const burstLayer = document.getElementById("burstLayer");
  const bgMusic = document.getElementById("bgMusic");
  const musicButton = document.getElementById("musicButton");
  const jakartaTime = document.getElementById("jakartaTime");
  const baliTime = document.getElementById("baliTime");

  const isMobile = window.matchMedia("(max-width: 720px)").matches;
  let letterOpened = false;
  let musicPlaying = false;

  document.documentElement.classList.toggle("is-mobile", isMobile);

  /* ==============================
     CLOCK — updates once per minute
  ============================== */
  function updateClock() {
    const now = new Date();

    if (jakartaTime) {
      jakartaTime.textContent = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      }).format(now);
    }

    if (baliTime) {
      baliTime.textContent = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Makassar",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      }).format(now);
    }
  }

  updateClock();
  setInterval(updateClock, 60000);

  /* ==============================
     BACKGROUND PETALS
     Fewer elements on phones.
  ============================== */
  function createBackgroundPetal() {
    if (!petalsLayer) return;

    const petal = document.createElement("span");
    petal.className = "falling-petal";

    const size = Math.random() * 8 + 9;
    petal.style.width = `${size}px`;
    petal.style.height = `${size * 1.55}px`;
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.animationDuration = `${Math.random() * 8 + 11}s`;
    petal.style.animationDelay = `${Math.random() * 8}s`;

    petalsLayer.appendChild(petal);
  }

  const backgroundPetalCount = isMobile ? 7 : 20;
  for (let i = 0; i < backgroundPetalCount; i++) {
    createBackgroundPetal();
  }

  /* ==============================
     PETAL BURST
  ============================== */
  function createPetalBurst() {
    if (!burstLayer || !envelope) return;

    const rect = envelope.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const burstCount = isMobile ? 8 : 18;

    for (let i = 0; i < burstCount; i++) {
      const petal = document.createElement("span");
      petal.className = "burst-petal";
      petal.style.left = `${centerX}px`;
      petal.style.top = `${centerY}px`;

      const x = Math.random() * (isMobile ? 150 : 260) - (isMobile ? 75 : 130);
      const y = -(Math.random() * (isMobile ? 110 : 170) + 40);
      const rotate = Math.random() * 520 - 260;
      const size = Math.random() * 7 + 10;

      petal.style.width = `${size}px`;
      petal.style.height = `${size * 1.5}px`;
      petal.style.setProperty("--x", `${x}px`);
      petal.style.setProperty("--y", `${y}px`);
      petal.style.setProperty("--r", `${rotate}deg`);

      burstLayer.appendChild(petal);
      setTimeout(() => petal.remove(), 1400);
    }
  }

  /* ==============================
     MUSIC
  ============================== */
  function startMusic() {
    if (!bgMusic) return;

    bgMusic.volume = 0.24;
    const playPromise = bgMusic.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          musicPlaying = true;
          if (musicButton) musicButton.classList.add("playing");
        })
        .catch(() => {
          // The letter still works if a phone blocks audio playback.
          musicPlaying = false;
        });
    }
  }

  function stopMusic() {
    if (!bgMusic) return;
    bgMusic.pause();
    musicPlaying = false;
    if (musicButton) musicButton.classList.remove("playing");
  }

  if (musicButton) {
    musicButton.addEventListener("click", function () {
      if (musicPlaying) stopMusic();
      else startMusic();
    });
  }

  /* ==============================
     OPEN LETTER
  ============================== */
  if (envelope) {
    envelope.addEventListener("click", function (event) {
      event.preventDefault();

      if (letterOpened) {
        if (letterSection) {
          letterSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        return;
      }

      letterOpened = true;

      if (openText) openText.textContent = "breaking the seal...";
      envelope.classList.add("cracking");

      // Audio is optional; it must never block the envelope animation.
      startMusic();

      setTimeout(createPetalBurst, isMobile ? 180 : 250);

      setTimeout(() => {
        envelope.classList.remove("cracking");
        envelope.classList.add("open");
        if (openText) openText.textContent = "opening your letter...";
      }, isMobile ? 500 : 600);

      setTimeout(() => {
        if (letterSection) letterSection.classList.add("show");
        if (openText) openText.textContent = "the letter is yours";
      }, isMobile ? 850 : 1000);

      setTimeout(() => {
        if (letterSection) {
          letterSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, isMobile ? 1150 : 1450);
    });
  }

  /* ==============================
     LETTER PARAGRAPH REVEAL
     Phones render them immediately to avoid jank.
  ============================== */
  const paragraphs = document.querySelectorAll(".letter-body p");

  if (isMobile || !("IntersectionObserver" in window)) {
    paragraphs.forEach((paragraph) => {
      paragraph.style.opacity = "1";
      paragraph.style.transform = "none";
    });
    return;
  }

  paragraphs.forEach((paragraph) => {
    paragraph.style.opacity = "0";
    paragraph.style.transform = "translateY(12px)";
    paragraph.style.transition = "opacity .8s ease, transform .8s ease";
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  paragraphs.forEach((paragraph) => observer.observe(paragraph));
});
