document.addEventListener("DOMContentLoaded", function () {

  /* ==============================
     ELEMENT
  ============================== */

  const envelope = document.getElementById("openLetter");
  const letterSection = document.getElementById("letterSection");
  const openText = document.getElementById("openText");

  const petalsLayer = document.getElementById("petalsLayer");
  const burstLayer = document.getElementById("burstLayer");

  const bgMusic = document.getElementById("bgMusic");
  const musicButton = document.getElementById("musicButton");

  const jakartaTime = document.getElementById("jakartaTime");
  const baliTime = document.getElementById("baliTime");

  let letterOpened = false;
  let musicPlaying = false;


  /* ==============================
     CLOCK
  ============================== */

  function updateClock() {

    const now = new Date();

    if (jakartaTime) {

      jakartaTime.textContent =
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Jakarta",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        }).format(now);

    }

    if (baliTime) {

      baliTime.textContent =
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Makassar",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        }).format(now);

    }

  }

  updateClock();

  setInterval(updateClock, 1000);


  /* ==============================
     BACKGROUND PETALS
  ============================== */

  function createBackgroundPetal() {

    if (!petalsLayer) return;

    const petal = document.createElement("span");

    petal.className = "falling-petal";

    const size = Math.random() * 10 + 10;

    petal.style.width = `${size}px`;
    petal.style.height = `${size * 1.6}px`;

    petal.style.left =
      `${Math.random() * 100}%`;

    petal.style.animationDuration =
      `${Math.random() * 9 + 10}s`;

    petal.style.animationDelay =
      `${Math.random() * 10}s`;

    petalsLayer.appendChild(petal);

  }


  for (let i = 0; i < 20; i++) {
    createBackgroundPetal();
  }


  /* ==============================
     PETAL BURST
  ============================== */

  function createPetalBurst() {

    if (!burstLayer || !envelope) return;

    const rect =
      envelope.getBoundingClientRect();

    const centerX =
      rect.left + rect.width / 2;

    const centerY =
      rect.top + rect.height / 2;

    for (let i = 0; i < 18; i++) {

      const petal =
        document.createElement("span");

      petal.className =
        "burst-petal";

      petal.style.left =
        `${centerX}px`;

      petal.style.top =
        `${centerY}px`;

      const x =
        Math.random() * 260 - 130;

      const y =
        -(Math.random() * 170 + 40);

      const rotate =
        Math.random() * 600 - 300;

      petal.style.setProperty(
        "--x",
        `${x}px`
      );

      petal.style.setProperty(
        "--y",
        `${y}px`
      );

      petal.style.setProperty(
        "--r",
        `${rotate}deg`
      );

      burstLayer.appendChild(petal);

      setTimeout(() => {
        petal.remove();
      }, 1400);

    }

  }


  /* ==============================
     MUSIC
  ============================== */

  function startMusic() {

    if (!bgMusic) return;

    bgMusic.volume = 0.35;

    const playPromise =
      bgMusic.play();

    if (
      playPromise !== undefined
    ) {

      playPromise
        .then(() => {

          musicPlaying = true;

          if (musicButton) {
            musicButton.classList.add("playing");
          }

        })
        .catch(() => {

          /*
            Tidak masalah kalau browser
            menolak musik.
            SURAT TETAP BISA DIBUKA.
          */

          musicPlaying = false;

        });

    }

  }


  function stopMusic() {

    if (!bgMusic) return;

    bgMusic.pause();

    musicPlaying = false;

    if (musicButton) {

      musicButton.classList.remove(
        "playing"
      );

    }

  }


  if (musicButton) {

    musicButton.addEventListener(
      "click",
      function () {

        if (musicPlaying) {
          stopMusic();
        } else {
          startMusic();
        }

      }
    );

  }


  /* ==============================
     OPEN LETTER
  ============================== */

  if (envelope) {

    envelope.addEventListener(
      "click",
      function (event) {

        event.preventDefault();

        console.log(
          "Envelope clicked!"
        );


        /* SUDAH PERNAH DIBUKA */

        if (letterOpened) {

          if (letterSection) {

            letterSection.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });

          }

          return;

        }


        letterOpened = true;


        /* TEXT */

        if (openText) {

          openText.textContent =
            "breaking the seal...";

        }


        /* WAX CRACK */

        envelope.classList.add(
          "cracking"
        );


        /* MUSIC
           Musik tidak boleh menggagalkan surat
        */

        startMusic();


        /* PETAL BURST */

        setTimeout(() => {

          createPetalBurst();

        }, 250);


        /* OPEN ENVELOPE */

        setTimeout(() => {

          envelope.classList.remove(
            "cracking"
          );

          envelope.classList.add(
            "open"
          );

          if (openText) {

            openText.textContent =
              "opening your letter...";

          }

        }, 600);


        /* SHOW LETTER */

        setTimeout(() => {

          if (letterSection) {

            letterSection.classList.add(
              "show"
            );

          }

          if (openText) {

            openText.textContent =
              "the letter is yours";

          }

        }, 1000);


        /* AUTO SCROLL */

        setTimeout(() => {

          if (letterSection) {

            letterSection.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });

          }

        }, 1450);

      }
    );

  }

  else {

    console.error(
      "Tombol amplop #openLetter tidak ditemukan."
    );

  }


  /* ==============================
     LETTER PARAGRAPH
  ============================== */

  const paragraphs =
    document.querySelectorAll(
      ".letter-body p"
    );


  paragraphs.forEach(
    (paragraph) => {

      paragraph.style.opacity =
        "0";

      paragraph.style.transform =
        "translateY(12px)";

      paragraph.style.transition =
        "opacity .8s ease, transform .8s ease";

    }
  );


  const observer =
    new IntersectionObserver(
      (entries) => {

        entries.forEach(
          (entry) => {

            if (entry.isIntersecting) {

              entry.target.style.opacity =
                "1";

              entry.target.style.transform =
                "translateY(0)";

              observer.unobserve(
                entry.target
              );

            }

          }
        );

      },

      {
        threshold: 0.1
      }
    );


  paragraphs.forEach(
    (paragraph) => {

      observer.observe(paragraph);

    }
  );

});