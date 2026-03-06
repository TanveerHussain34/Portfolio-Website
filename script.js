import * as THREE from "https://unpkg.com/three@0.161.0/build/three.module.js";

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const roleElement = document.querySelector(".home-role");
if (roleElement && window.Typed) {
  new window.Typed(".home-role", {
    strings: ["Software Engineer", "Full Stack Developer", "MERN Developer"],
    typeSpeed: 48,
    backSpeed: 30,
    backDelay: 900,
    loop: true,
  });
}

const sections = [...document.querySelectorAll("section[id]")];
const navLinks = [...document.querySelectorAll(".navbar a")];
const topBtn = document.getElementById("top");
const sideNav = document.getElementById("mySidenav");
const menuOpen = document.getElementById("menuOpen");
const menuClose = document.getElementById("menuClose");

const setActiveNav = () => {
  const midpoint = window.scrollY + window.innerHeight * 0.35;
  let activeId = sections[0]?.id;

  sections.forEach((section) => {
    const start = section.offsetTop;
    const end = start + section.offsetHeight;
    if (midpoint >= start && midpoint < end) activeId = section.id;
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${activeId}`;
    link.classList.toggle("active", isActive);
  });
};

const toggleTopButton = () => {
  if (!topBtn) return;
  topBtn.style.display = window.scrollY > 220 ? "grid" : "none";
};

window.addEventListener("scroll", () => {
  setActiveNav();
  toggleTopButton();
});

topBtn?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

menuOpen?.addEventListener("click", () => sideNav?.classList.add("open"));
menuClose?.addEventListener("click", () => sideNav?.classList.remove("open"));
sideNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => sideNav.classList.remove("open"));
});

const revealElements = [...document.querySelectorAll(".reveal")];
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.15 }
  );
  revealElements.forEach((el) => revealObserver.observe(el));
} else {
  revealElements.forEach((el) => el.classList.add("visible"));
}

const cardEls = [...document.querySelectorAll(".card-3d")];
if (!prefersReducedMotion) {
  cardEls.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rx = (0.5 - y) * 8;
      const ry = (x - 0.5) * 10;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
    });
  });
}

const mount = document.getElementById("three-root");
if (mount) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 8);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  mount.appendChild(renderer.domElement);

  const group = new THREE.Group();
  scene.add(group);

  const light1 = new THREE.PointLight(0x59dbff, 1.2, 40);
  light1.position.set(6, 4, 8);
  const light2 = new THREE.PointLight(0x45f0df, 1.4, 40);
  light2.position.set(-6, -3, 6);
  scene.add(light1, light2);

  const knot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.2, 0.26, 140, 18),
    new THREE.MeshPhysicalMaterial({
      color: 0x5aa9ff,
      metalness: 0.25,
      roughness: 0.25,
      clearcoat: 1,
      clearcoatRoughness: 0.2,
      transparent: true,
      opacity: 0.85,
    })
  );
  group.add(knot);

  const orb = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.62, 0),
    new THREE.MeshStandardMaterial({
      color: 0x45f0df,
      emissive: 0x0b3a43,
      metalness: 0.25,
      roughness: 0.4,
    })
  );
  orb.position.set(-3.2, 1.1, -1.5);
  group.add(orb);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.95, 0.08, 20, 64),
    new THREE.MeshStandardMaterial({ color: 0x8ec5ff, metalness: 0.3, roughness: 0.4 })
  );
  ring.position.set(3.3, -1.5, -1.8);
  ring.rotation.x = 1.2;
  group.add(ring);

  const starsGeo = new THREE.BufferGeometry();
  const starsCount = 1200;
  const positions = new Float32Array(starsCount * 3);
  for (let i = 0; i < starsCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 28;
    positions[i + 1] = (Math.random() - 0.5) * 20;
    positions[i + 2] = (Math.random() - 0.5) * 28;
  }
  starsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const stars = new THREE.Points(
    starsGeo,
    new THREE.PointsMaterial({
      color: 0xbce4ff,
      size: 0.03,
      transparent: true,
      opacity: 0.75,
    })
  );
  scene.add(stars);

  const mouse = { x: 0, y: 0 };
  window.addEventListener("mousemove", (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const clock = new THREE.Clock();
  const animate = () => {
    const t = clock.getElapsedTime();
    if (!prefersReducedMotion) {
      knot.rotation.x = t * 0.2;
      knot.rotation.y = t * 0.35;
      orb.rotation.y = t * 0.7;
      ring.rotation.z = -t * 0.5;
      stars.rotation.y = t * 0.015;
      group.position.x += (mouse.x * 0.55 - group.position.x) * 0.03;
      group.position.y += (mouse.y * 0.4 - group.position.y) * 0.03;
      camera.position.z = 8 + window.scrollY * 0.0004;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };
  animate();
}

setActiveNav();
toggleTopButton();
