import LocomotiveScroll from 'locomotive-scroll';

import 'locomotive-scroll/dist/locomotive-scroll.css';

import { gsap } from 'gsap';

import * as THREE from 'three';

import { createIcons, icons } from 'lucide';

import githubIcon from 'simple-icons/icons/github.svg';
import leetcodeIcon from 'simple-icons/icons/leetcode.svg';

import cplusplusIcon from 'simple-icons/icons/cplusplus.svg';

import pythonIcon from 'simple-icons/icons/python.svg';

import javascriptIcon from 'simple-icons/icons/javascript.svg';

import typescriptIcon from 'simple-icons/icons/typescript.svg';

import sqlIcon from 'simple-icons/icons/mysql.svg';

import html5Icon from 'simple-icons/icons/html5.svg';

import cssIcon from 'simple-icons/icons/css.svg';

import reactIcon from 'simple-icons/icons/react.svg';

import nextdotjsIcon from 'simple-icons/icons/nextdotjs.svg';

import tailwindcssIcon from 'simple-icons/icons/tailwindcss.svg';

import nodedotjsIcon from 'simple-icons/icons/nodedotjs.svg';

import expressIcon from 'simple-icons/icons/express.svg';

import mysqlIcon from 'simple-icons/icons/mysql.svg';

import mongodbIcon from 'simple-icons/icons/mongodb.svg';

import googlecloudIcon from 'simple-icons/icons/googlecloud.svg';

import gitIcon from 'simple-icons/icons/git.svg';

import dockerIcon from 'simple-icons/icons/docker.svg';

import postmanIcon from 'simple-icons/icons/postman.svg';




const brandIcons = { github: githubIcon, linkedin: 'https\://cdn.simpleicons.org/linkedin/FFFFFF', leetcode: leetcodeIcon };

const technologyIcons = { cplusplus: cplusplusIcon, python: pythonIcon, javascript: javascriptIcon, typescript: typescriptIcon, sql: sqlIcon, html5: html5Icon, css: cssIcon, react: reactIcon, nextdotjs: nextdotjsIcon, tailwindcss: tailwindcssIcon, nodedotjs: nodedotjsIcon, express: expressIcon, mysql: mysqlIcon, mongodb: mongodbIcon, googlecloud: googlecloudIcon, git: gitIcon, github: githubIcon, docker: dockerIcon, postman: postmanIcon };



// Let Vite manage the frame URLs.  Root-relative paths work while developing,

// but they are not emitted into a production build when the frames live beside

// the source files.

const frameModules = import.meta.glob('./frames/ezgif-frame-*.jpg', {

  eager: true,

  import: 'default',

  query: '?url'

});

const sortedFramePaths = Object.entries(frameModules)

  .sort(([first], [second]) => first.localeCompare(second, undefined, { numeric: true }))

  .map(([, url]) => url);



const TOTAL_FRAMES = sortedFramePaths.length;

const canvas = document.getElementById('hero-canvas');

const ctx = canvas.getContext('2d');

const loader = document.getElementById('loader');

const loaderText = document.getElementById('loader-text');

const loaderBar = document.getElementById('loader-bar');

const scrollContainer = document.getElementById('scroll-container');

const ambientCanvas = document.getElementById('ambient-canvas');

const sections = [...document.querySelectorAll('.portfolio-section')];



// Array to store preloaded Image objects

const images = [];

let loadedCount = 0;

let loadingFinished = false;

let framesReady = false;

let displayedProgress = 0;

let targetProgress = 0;

let progressAnimationFrame;

let loadingStartedAt = performance.now();

let locomotiveScroll;



// Animation State Variables

let targetFrameIndex = 0;

let currentFrameIndex = 0;

let renderedFrameIndex = -1;

let isLoaded = false;

let scrollProgress = 0;

let hasScrolledAwayFromTop = false;

const INTRO_SEQUENCE_DURATION = 14000;

const MINIMUM_LOADER_DURATION = 1100;



// Canvas Resize & High DPI handling

const resizeCanvas = () => {

  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = window.innerWidth * dpr;

  canvas.height = window.innerHeight * dpr;

  if (isLoaded) {

    drawFrame(Math.round(currentFrameIndex), true);

  }

};



// Draw frame to canvas with responsive 'cover' fitting

const drawFrame = (frameIndex, force = false) => {

  if (!force && renderedFrameIndex === frameIndex) return;



  const img = images[frameIndex];

  if (!img || !img.complete || img.naturalWidth === 0) return;



  const canvasWidth = canvas.width;

  const canvasHeight = canvas.height;



  ctx.clearRect(0, 0, canvasWidth, canvasHeight);



  // Calculate aspect ratio fit (cover mode)

  const hRatio = canvasWidth / img.naturalWidth;

  const vRatio = canvasHeight / img.naturalHeight;

  const ratio = Math.max(hRatio, vRatio);



  const renderWidth = img.naturalWidth * ratio;

  const renderHeight = img.naturalHeight * ratio;

  const offsetX = (canvasWidth - renderWidth) / 2;

  const offsetY = (canvasHeight - renderHeight) / 2;



  ctx.imageSmoothingEnabled = true;

  ctx.imageSmoothingQuality = 'high';

  ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, offsetX, offsetY, renderWidth, renderHeight);

  renderedFrameIndex = frameIndex;

};



// Locomotive provides normalized progress for the whole scroll track.

const updateTargetFrame = (progress) => {

  if (TOTAL_FRAMES < 2) return;

  const introProgress = (performance.now() % INTRO_SEQUENCE_DURATION) / INTRO_SEQUENCE_DURATION;

  const activeProgress = typeof progress === 'number'

    ? progress

    : hasScrolledAwayFromTop

      ? scrollProgress

      : introProgress;

  const clampedProgress = Math.max(0, Math.min(1, activeProgress));

  targetFrameIndex = clampedProgress * (TOTAL_FRAMES - 1);

};



// Render loop with lerp interpolation for smooth motion

const animationLoop = () => {

  if (isLoaded) {

    updateTargetFrame();



    const diff = targetFrameIndex - currentFrameIndex;

    if (Math.abs(diff) > 0.001) {

      currentFrameIndex += diff * 0.09;

    } else {

      currentFrameIndex = targetFrameIndex;

    }



    const frameToDraw = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(currentFrameIndex)));

    drawFrame(frameToDraw);

  }



  requestAnimationFrame(animationLoop);

};



// Preload all frames

const preloadImages = () => {

  console.log(`Starting preload: TOTAL_FRAMES = ${TOTAL_FRAMES}`);



  if (TOTAL_FRAMES === 0) {

    console.error('No frames found');

    // Immediately show the portfolio

    setTimeout(onAllImagesLoaded, 500);

    return;

  }



  const renderLoaderProgress = () => {

    if (loaderText) loaderText.textContent = `${Math.round(displayedProgress)}%`;

    if (loaderBar) loaderBar.style.width = `${displayedProgress}%`;

  };



  const completeLoadingWhenReady = () => {

    if (!framesReady || loadingFinished || displayedProgress < 100) return;

    const remainingDelay = Math.max(0, MINIMUM_LOADER_DURATION - (performance.now() - loadingStartedAt));

    setTimeout(onAllImagesLoaded, remainingDelay);

  };



  const animateLoaderProgress = () => {

    const difference = targetProgress - displayedProgress;

    if (difference > 0.05) {

      // Pacing makes a cached sequence read as a real 0–100% load.

      displayedProgress = Math.min(targetProgress, displayedProgress + Math.max(0.9, difference * 0.12));

      renderLoaderProgress();

      progressAnimationFrame = requestAnimationFrame(animateLoaderProgress);

      return;

    }



    displayedProgress = targetProgress;

    renderLoaderProgress();

    progressAnimationFrame = undefined;

    completeLoadingWhenReady();

  };



  const updateLoaderProgress = (progress) => {

    targetProgress = Math.max(targetProgress, progress);

    if (!progressAnimationFrame) progressAnimationFrame = requestAnimationFrame(animateLoaderProgress);

  };



  const finishFramePreload = () => {

    if (framesReady) return;

    framesReady = true;

    clearTimeout(loadTimeout);

    updateLoaderProgress(100);

  };



  // Never leave the site behind a loading overlay when the connection is slow.

  const loadTimeout = setTimeout(() => {

    console.warn('Frame loading timeout');

    finishFramePreload();

  }, 8000);



  sortedFramePaths.forEach((src, index) => {

    const img = new Image();

    img.crossOrigin = 'anonymous';



    const handleLoad = () => {

      loadedCount++;

      updateLoaderProgress((loadedCount / TOTAL_FRAMES) * 100);



      if (loadedCount === TOTAL_FRAMES) {

        finishFramePreload();

      }

    };



    const handleError = () => {

      console.warn(`Unable to load frame ${index + 1}:`, src);

      loadedCount++;

      updateLoaderProgress((loadedCount / TOTAL_FRAMES) * 100);

      if (loadedCount === TOTAL_FRAMES) {

        finishFramePreload();

      }

    };



    img.onload = handleLoad;

    img.onerror = handleError;

    images[index] = img;

    // Bind events before assigning src so cached files cannot complete before

    // their handlers are registered.

    img.src = src;

  });

};



const onAllImagesLoaded = () => {

  if (loadingFinished) return;

  loadingFinished = true;

  isLoaded = true;

  resizeCanvas();

  drawFrame(0, true);

  locomotiveScroll?.resize();



  // Fade out loader screen

  setTimeout(() => {

    if (loader) loader.classList.add('loaded');

    window.dispatchEvent(new Event('portfolio-ready'));

  }, 180);

};



const setupGsapEnhancements = () => {

  const revealElements = gsap.utils.toArray('.reveal');



  const revealObserver = new IntersectionObserver((entries, observer) => {

    entries.forEach((entry) => {

      if (!entry.isIntersecting) return;

      gsap.from(entry.target, {

        y: 24,

        duration: 0.8,

        delay: Math.min(entry.target.closest('.portfolio-section')?.querySelectorAll('.reveal').length || 0, 4) * 0.02,

        ease: 'power3.out'

      });

      observer.unobserve(entry.target);

    });

  }, { threshold: 0.16 });



  revealElements.forEach((element) => revealObserver.observe(element));



  gsap.utils.toArray('.project-card, .certification-row').forEach((card) => {

    const arrow = card.querySelector('b');

    card.addEventListener('mouseenter', () => {

      gsap.to(card, { x: 8, duration: 0.35, ease: 'power2.out' });

      if (arrow) gsap.to(arrow, { x: 6, duration: 0.25, ease: 'power2.out' });

    });

    card.addEventListener('mouseleave', () => {

      gsap.to(card, { x: 0, duration: 0.45, ease: 'power3.out' });

      if (arrow) gsap.to(arrow, { x: 0, duration: 0.3, ease: 'power2.out' });

    });

  });



};



const setupAchievementShowcase = () => {

  const showcase = document.querySelector('.leetcode-showcase');

  if (!showcase) return;



  const countValues = [...showcase.querySelectorAll('[data-count-to]')];

  const metrics = [...showcase.querySelectorAll('.leetcode-metric')];

  let hasAnimated = false;



  const renderCount = (element, value) => {

    element.textContent = `${Math.round(value)}${element.dataset.suffix || ''}`;

  };



  const startAnimation = () => {

    if (hasAnimated) return;

    hasAnimated = true;



    if (prefersReducedMotion) {

      countValues.forEach((element) => renderCount(element, Number(element.dataset.countTo)));

      return;

    }



    gsap.timeline()

      .from(showcase.querySelector('.leetcode-intro'), { y: 28, opacity: 0, duration: 0.8, ease: 'power3.out' })

      .from(showcase.querySelector('.guardian-feature'), { y: 24, opacity: 0, duration: 0.75, ease: 'power3.out' }, '-=0.52')

      .from(metrics, { y: 22, opacity: 0, duration: 0.62, stagger: 0.11, ease: 'power3.out' }, '-=0.32')

      .from(showcase.querySelector('.leetcode-quote'), { y: 12, opacity: 0, duration: 0.48, ease: 'power2.out' }, '-=0.22');



    countValues.forEach((element) => {

      const counter = { value: 0 };

      gsap.to(counter, {

        value: Number(element.dataset.countTo),

        duration: 1.35,

        delay: 0.34,

        ease: 'power2.out',

        onUpdate: () => renderCount(element, counter.value)

      });

    });

  };



  const observer = new IntersectionObserver(([entry]) => {

    if (!entry.isIntersecting) return;

    startAnimation();

    observer.disconnect();

  }, { threshold: 0.2 });

  observer.observe(showcase);



  metrics.forEach((metric) => {

    metric.addEventListener('pointermove', (event) => {

      const bounds = metric.getBoundingClientRect();

      metric.style.setProperty('--shine-x', `${((event.clientX - bounds.left) / bounds.width) * 100}%`);

    });

  });

};



const setupPortfolioIconsAndSkills = () => {

  document.querySelectorAll('[data-brand-icon]').forEach((image) => {

    image.src = brandIcons[image.dataset.brandIcon] || '';

  });



  document.querySelectorAll('[data-tech]').forEach((item) => {

    const source = technologyIcons[item.dataset.tech];

    if (!source) return;

    const image = document.createElement('img');

    image.className = 'technology-icon';

    image.src = source;

    image.alt = '';

    item.prepend(image);

  });



  const skills = document.querySelector('.skills-showcase');

  const panels = [...document.querySelectorAll('.skill-panel')];

  if (skills && !prefersReducedMotion) {

    const observer = new IntersectionObserver(([entry]) => {

      if (!entry.isIntersecting) return;

      gsap.from(skills.querySelector('.skills-intro'), { y: 30, opacity: 0, duration: 0.75, ease: 'power3.out' });

      gsap.from(panels, { y: 28, opacity: 0, scale: 0.98, duration: 0.55, stagger: 0.09, delay: 0.12, ease: 'power3.out' });

      gsap.from(panels.flatMap((panel) => [...panel.querySelectorAll('.skill-items > span')]), { scale: 0.82, duration: 0.46, stagger: 0.025, delay: 0.35, ease: 'back.out(1.5)' });

      observer.disconnect();

    }, { threshold: 0.16 });

    observer.observe(skills);

  }



  panels.forEach((panel) => panel.addEventListener('pointermove', (event) => {

    const bounds = panel.getBoundingClientRect();

    panel.style.setProperty('--glow-x', `${((event.clientX - bounds.left) / bounds.width) * 100}%`);

    panel.style.setProperty('--glow-y', `${((event.clientY - bounds.top) / bounds.height) * 100}%`);

  }));

};



const setupContentsExperience = () => {

  const section = document.querySelector('.contents-section');

  const navItems = [...document.querySelectorAll('.contents-nav a')];

  if (!section || prefersReducedMotion) return;

  const observer = new IntersectionObserver(([entry]) => {

    if (!entry.isIntersecting) return;

    const heading = section.querySelector('h2');

    gsap.from(section.querySelector('.section-header'), { y: -12, opacity: 0, duration: 0.5, ease: 'power2.out' });

    gsap.from(heading?.children || [], { y: 42, opacity: 0, filter: 'blur(9px)', duration: 0.76, stagger: 0.13, ease: 'power3.out', delay: 0.12 });

    gsap.from(section.querySelector('.body-copy'), { y: 16, opacity: 0, duration: 0.55, delay: 0.46, ease: 'power2.out' });

    gsap.from(navItems, { x: 58, opacity: 0, scale: 0.97, duration: 0.55, stagger: 0.09, delay: 0.42, ease: 'power3.out' });

    observer.disconnect();

  }, { threshold: 0.15 });

  observer.observe(section);

  navItems.forEach((item) => item.addEventListener('pointermove', (event) => {

    const bounds = item.getBoundingClientRect();

    const x = ((event.clientX - bounds.left) / bounds.width - .5) * 5;

    const y = ((event.clientY - bounds.top) / bounds.height - .5) * 3;

    gsap.to(item, { x, y, duration: .28, ease: 'power2.out', overwrite: 'auto' });

  }));

  navItems.forEach((item) => item.addEventListener('pointerleave', () => gsap.to(item, { x: 0, y: 0, duration: .45, ease: 'power3.out' })));

};



const setupAboutExperience = () => {

  const section = document.querySelector('.about-section');

  const index = section?.querySelector('.large-index');

  const card = section?.querySelector('.about-profile-card');

  if (!section || !index || !card || prefersReducedMotion) return;



  const observer = new IntersectionObserver(([entry]) => {

    if (!entry.isIntersecting) return;

    const headingParts = card.querySelectorAll('.about-heading > span');

    const paragraphs = card.querySelectorAll('.body-copy, .education-mark');

    gsap.timeline()

      .from(index, { y: 46, opacity: 0, duration: 1, ease: 'power3.out' })

      .from(card, { x: 44, opacity: 0, filter: 'blur(7px)', duration: .82, ease: 'power3.out' }, '-=.74')

      .from(headingParts, { y: 30, opacity: 0, duration: .6, stagger: .13, ease: 'power3.out' }, '-=.42')

      .from(paragraphs, { y: 15, opacity: 0, duration: .42, stagger: .11, ease: 'power2.out' }, '-=.26');

    observer.disconnect();

  }, { threshold: .18 });

  observer.observe(section);



  section.addEventListener('pointermove', (event) => {

    const sectionBounds = section.getBoundingClientRect();

    section.style.setProperty('--about-x', `${((event.clientX - sectionBounds.left) / sectionBounds.width) * 100}%`);

    section.style.setProperty('--about-y', `${((event.clientY - sectionBounds.top) / sectionBounds.height) * 100}%`);

    const cardBounds = card.getBoundingClientRect();

    const rotateY = ((event.clientX - cardBounds.left) / cardBounds.width - .5) * 2;

    const rotateX = ((event.clientY - cardBounds.top) / cardBounds.height - .5) * -2;

    gsap.to(card, { rotateX, rotateY, duration: .35, ease: 'power2.out', overwrite: 'auto' });

  });

  section.addEventListener('pointerleave', () => gsap.to(card, { rotateX: 0, rotateY: 0, duration: .65, ease: 'power3.out' }));

};



const setupHeroModel = () => {
  const modelCanvas = document.querySelector('#hero-model-canvas');
  if (!modelCanvas || modelCanvas.dataset.initialized === 'true') return;
  modelCanvas.dataset.initialized = 'true';

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: modelCanvas,
      alpha: true,
      antialias: true,
      powerPreference: 'low-power'
    });
  } catch (error) {
    console.warn('3D hero model is unavailable:', error);
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 7);

  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  scene.add(new THREE.AmbientLight(0xffe6d2, 1.7));

  const keyLight = new THREE.PointLight(0xffe5c5, 38);
  keyLight.position.set(3, 4, 5);
  scene.add(keyLight);

  const redLight = new THREE.PointLight(0xe43f50, 30);
  redLight.position.set(-4, -1, 2);
  scene.add(redLight);

  const rimLight = new THREE.PointLight(0xffffff, 25);
  rimLight.position.set(1, 2, -4);
  scene.add(rimLight);

  const sculpture = new THREE.Group();
  scene.add(sculpture);

  const knotGeometry = new THREE.TorusKnotGeometry(1.05, 0.28, 160, 20, 2, 3);
  const knotMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xe8d8c5,
    metalness: 0.82,
    roughness: 0.23,
    clearcoat: 1,
    clearcoatRoughness: 0.15
  });
  const knot = new THREE.Mesh(knotGeometry, knotMaterial);
  sculpture.add(knot);

  const orbitGeometry = new THREE.TorusGeometry(1.65, 0.025, 10, 120);
  const orbitMaterial = new THREE.MeshStandardMaterial({
    color: 0xb91f37,
    metalness: 0.65,
    roughness: 0.25,
    emissive: 0x38000b,
    emissiveIntensity: 0.8
  });
  const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
  orbit.rotation.set(0.8, 0.3, 0.5);
  sculpture.add(orbit);

  const accentGeometry = new THREE.TorusGeometry(1.38, 0.012, 8, 100);
  const accentMaterial = new THREE.MeshBasicMaterial({ color: 0xffc9a3 });
  const accent = new THREE.Mesh(accentGeometry, accentMaterial);
  accent.rotation.set(1.2, 0.4, -0.5);
  sculpture.add(accent);

  sculpture.position.set(0.35, 0, 0);
  sculpture.scale.setScalar(0.92);

  const pointer = { x: 0, y: 0 };
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const resize = () => {
    const width = Math.max(modelCanvas.clientWidth, 1);
    const height = Math.max(modelCanvas.clientHeight, 1);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  const onPointerMove = (event) => {
    pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
    pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
  };

  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', onPointerMove, { passive: true });

  renderer.setAnimationLoop((time) => {
    if (!reducedMotion.matches) {
      const t = time * 0.001;
      sculpture.rotation.y += (pointer.x * 0.18 - sculpture.rotation.y) * 0.012;
      sculpture.rotation.x += (-pointer.y * 0.12 - sculpture.rotation.x) * 0.012;
      knot.rotation.z = Math.sin(t * 0.35) * 0.12;
      orbit.rotation.z += 0.0018;
      accent.rotation.y += 0.001;
      sculpture.position.y = Math.sin(t * 0.7) * 0.08;
    }
    renderer.render(scene, camera);
  });

  window.addEventListener('beforeunload', () => {
    renderer.setAnimationLoop(null);
    window.removeEventListener('resize', resize);
    window.removeEventListener('pointermove', onPointerMove);
    knotGeometry.dispose();
    knotMaterial.dispose();
    orbitGeometry.dispose();
    orbitMaterial.dispose();
    accentGeometry.dispose();
    accentMaterial.dispose();
    renderer.dispose();
  }, { once: true });
};


// Scroll-driven portrait: keeps the cutout present across the portfolio and
// changes its scale, position and visibility with the overall page progress.
const setupScrollPortrait = () => {
  const portraitWrap = document.querySelector('.hero-portrait-wrap');
  const portrait = portraitWrap?.querySelector('.hero-portrait');
  if (!portraitWrap || !portrait) return () => {};

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lastProgress = -1;
  let currentProgress = 0;
  let pointerX = 0;
  let pointerY = 0;
  let currentPointerX = 0;
  let currentPointerY = 0;
  let pointerFrame = 0;

  const clamp01 = (value) => Math.max(0, Math.min(1, value));
  const smoothstep = (a, b, value) => {
    const t = clamp01((value - a) / (b - a));
    return t * t * (3 - 2 * t);
  };

  const render = (progress = 0) => {
    const p = clamp01(progress);
    if (Math.abs(p - lastProgress) < 0.002) return;
    lastProgress = p;

    if (reducedMotion) {
      gsap.set(portraitWrap, { clearProps: 'transform,opacity' });
      gsap.set(portrait, { clearProps: 'transform' });
      return;
    }

    // The portrait grows and drifts inward as the visitor moves through the site.
    const growIn = smoothstep(0.02, 0.46, p);
    const growOut = smoothstep(0.58, 0.98, p);
    const fadeOut = 1 - smoothstep(0.97, 1, p);
    const opacity = Math.max(0, 0.9 * fadeOut);
    const x = -window.innerWidth * (0.015 + 0.06 * growIn - 0.025 * growOut);
    const y = -window.innerHeight * (0.01 + 0.025 * growIn - 0.012 * growOut);
    const scale = 1.02 + growIn * 0.46 - growOut * 0.32;
    const rotateY = -2.5 - growIn * 5 + growOut * 3.5 + currentPointerX * 3.2;
    const rotateX = currentPointerY * -2.4;
    const pointerDriftX = currentPointerX * 10;
    const pointerDriftY = currentPointerY * 7;

    gsap.set(portraitWrap, {
      x: x + pointerDriftX,
      y: y + pointerDriftY,
      autoAlpha: Math.max(0, opacity),
      transformOrigin: 'right bottom',
      force3D: true
    });
    gsap.set(portrait, {
      scale,
      rotateY,
      rotateX,
      transformOrigin: 'right bottom',
      force3D: true
    });
  };

  const getNativeProgress = () => {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    return clamp01(window.scrollY / maxScroll);
  };

  // Use one scroll source at a time. Locomotive's eased progress and native
  // window.scrollY can disagree during smooth scrolling; alternating between
  // them made the portrait appear to bounce or "ping-pong".
  const onNativeScroll = () => {
    if (locomotiveScroll) return;
    currentProgress = getNativeProgress();
    render(currentProgress);
  };
  const onPortfolioScroll = (event) => {
    if (typeof event.detail?.progress !== 'number') return;
    currentProgress = clamp01(event.detail.progress);
    render(currentProgress);
  };

  const animatePointer = () => {
    pointerFrame = 0;
    currentPointerX += (pointerX - currentPointerX) * 0.12;
    currentPointerY += (pointerY - currentPointerY) * 0.12;
    lastProgress = -1;
    render(currentProgress);
    if (!reducedMotion &&
        (Math.abs(pointerX - currentPointerX) > 0.003 ||
         Math.abs(pointerY - currentPointerY) > 0.003)) {
      pointerFrame = requestAnimationFrame(animatePointer);
    }
  };

  const onPointerMove = (event) => {
    if (reducedMotion || event.pointerType === 'touch') return;
    pointerX = (event.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
    pointerY = (event.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
    if (!pointerFrame) pointerFrame = requestAnimationFrame(animatePointer);
  };
  const onPointerLeave = () => {
    pointerX = 0;
    pointerY = 0;
    if (!pointerFrame && !reducedMotion) pointerFrame = requestAnimationFrame(animatePointer);
  };
  const onResize = () => {
    lastProgress = -1;
    currentProgress = locomotiveScroll ? currentProgress : getNativeProgress();
    render(currentProgress);
  };

  // Locomotive Scroll drives the page; native scroll is only a true fallback.
  currentProgress = getNativeProgress();
  window.addEventListener('portfolio-scroll-progress', onPortfolioScroll);
  window.addEventListener('scroll', onNativeScroll, { passive: true });
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerleave', onPointerLeave, { passive: true });
  window.addEventListener('resize', onResize);
  render(currentProgress);

  return () => {
    window.removeEventListener('portfolio-scroll-progress', onPortfolioScroll);
    window.removeEventListener('scroll', onNativeScroll);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerleave', onPointerLeave);
    if (pointerFrame) cancelAnimationFrame(pointerFrame);
    window.removeEventListener('resize', onResize);
  };
};

const setupHeroExperience = () => {
  const section = document.querySelector('.hero-section');
  const title = section?.querySelector('.hero-title');
  if (!section || !title) return;

  const animateHero = () => {
    if (prefersReducedMotion) return;

    const characters = 'ARMAN';
    title.innerHTML = '<span class="hero-name-fragment"></span>';
    const fragment = title.querySelector('.hero-name-fragment');

    gsap.set(title, { y: 44, opacity: 0, filter: 'blur(16px)' });
    gsap.to(title, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.15, ease: 'power4.out' });

    gsap.fromTo(
      section.querySelector('.hero-one-liner'),
      { y: 28, opacity: 0, filter: 'blur(8px)' },
      { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8, delay: 0.5, ease: 'power3.out' }
    );

    let index = 0;
    const revealLetter = () => {
      const visible = characters.slice(0, index += 1);
      fragment.innerHTML = `${visible.slice(0, 3)}<span class="hero-name-accent">${visible.slice(3)}</span>`;
      if (index < characters.length) window.setTimeout(revealLetter, 130);
    };
    revealLetter();

    gsap.from(
      [section.querySelector('.hero-summary'), section.querySelector('.hero-note'), section.querySelector('.hero-skill-line')],
      { y: 24, opacity: 0, duration: 0.62, stagger: 0.14, delay: 0.72, ease: 'power3.out' }
    );
  };

  window.addEventListener('portfolio-ready', animateHero, { once: true });
  if (loadingFinished) animateHero();

  section.addEventListener('pointermove', (event) => {
    if (prefersReducedMotion) return;
    const bounds = section.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    gsap.to(canvas, { x: x * -16, y: y * -12, scale: 1.035, duration: 0.7, ease: 'power2.out', overwrite: 'auto' });
    gsap.to(section.querySelector('.hero-copy'), { rotateY: x * 2, rotateX: y * -1.5, transformPerspective: 1000, duration: 0.55, ease: 'power2.out', overwrite: 'auto' });
  });

  section.addEventListener('pointerleave', () => {
    gsap.to(canvas, { x: 0, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' });
    gsap.to(section.querySelector('.hero-copy'), { rotateX: 0, rotateY: 0, duration: 0.65, ease: 'power3.out' });
  });
};

const setupEducationAnimations = () => {

  const section = document.querySelector('.education-section');

  const panel = section?.querySelector('.education-panel');

  const heading = section?.querySelector('.education-heading');

  const headingH2 = heading?.querySelector('h2');

  const headingSpans = headingH2?.querySelectorAll('span');

  const entries = [...(section?.querySelectorAll('.education-entry') || [])];

  const progressLine = section?.querySelector('.timeline-progress');

  const journeyBtn = section?.querySelector('.journey-button');

  const pageIndicator = section?.querySelector('.education-page-indicator');

  const icons = entries.map(e => e.querySelector('.education-entry-icon'));



  if (!section || !panel || !entries.length || prefersReducedMotion) return;



  const scoreAnimations = new WeakSet();

  let hasAnimated = false;



  // Enhanced intro animation with staggered reveals

  const introObserver = new IntersectionObserver(([entry]) => {

    if (!entry.isIntersecting || hasAnimated) return;

    hasAnimated = true;



    // Heading container

    gsap.from(heading, { 

      y: 38, 

      autoAlpha: 0, 

      duration: 0.85, 

      ease: 'power3.out' 

    });



    // Panel slides in from right with premium easing

    gsap.from(panel, { 

      x: 48, 

      autoAlpha: 0, 

      duration: 0.95, 

      delay: 0.12, 

      ease: 'power3.out' 

    });



    // Heading spans reveal line by line

    if (headingSpans && headingSpans.length > 0) {

      gsap.from(headingSpans, { 

        y: 24, 

        autoAlpha: 0, 

        duration: 0.7, 

        stagger: {

          amount: 0.24,

          ease: 'power2.inOut'

        },

        delay: 0.18, 

        ease: 'power3.out' 

      });

    }



    // Education entries with enhanced stagger

    gsap.from(entries, { 

      y: 20, 

      duration: 0.75, 

      stagger: {

        amount: 0.3,

        ease: 'power2.inOut'

      },

      delay: 0.35, 

      ease: 'power3.out' 

    });



    // Timeline progress animation

    if (progressLine) {

      gsap.from(progressLine, {

        scaleY: 0,

        transformOrigin: 'top',

        duration: 1.2,

        delay: 0.5,

        ease: 'power2.out'

      });

    }



    introObserver.disconnect();

  }, { threshold: 0.22 });



  introObserver.observe(section);



  // Enhanced entry animations with individual icon handling

  entries.forEach((entry, entryIndex) => {

    const score = Number(entry.dataset.score);

    const scoreValue = entry.querySelector('[data-score-value]');

    const icon = entry.querySelector('.education-entry-icon');

    const divContent = entry.querySelector(':scope > div:last-child');



    const onEntryVisible = new IntersectionObserver(([visible]) => {

      if (!visible.isIntersecting) return;



      entry.classList.add('is-active');



      // Icon scale with premium easing

      if (icon) {

        gsap.fromTo(icon, 

          { scale: 0.85 }, 

          { scale: 1, duration: 0.6, ease: 'back.out(2.2)' }

        );

      }



      // Score counter animation with premium ease

      if (!scoreAnimations.has(entry) && scoreValue) {

        scoreAnimations.add(entry);

        const counter = { value: 0 };

        const decimalPlaces = (String(entry.dataset.score).split('.')[1] || '').length;

        gsap.to(counter, { 

          value: score, 

          duration: 1.3, 

          ease: 'power2.out', 

          delay: 0.2,

          onUpdate: () => { 

            scoreValue.textContent = `${counter.value.toFixed(decimalPlaces)}%`; 

          } 

        });

      }



      onEntryVisible.disconnect();

    }, { threshold: 0.55 });



    onEntryVisible.observe(entry);



    // Enhanced hover effects with premium easing

    entry.addEventListener('mouseenter', () => {

      gsap.to(entry, { 

        y: -4, 

        duration: 0.3, 

        ease: 'power2.out' 

      });



      if (divContent) {

        gsap.to(divContent, {

          borderBottomColor: 'rgba(239, 133, 104, 0.3)',

          duration: 0.3,

          ease: 'power2.out'

        });

      }

    });



    entry.addEventListener('mouseleave', () => {

      gsap.to(entry, { 

        y: 0, 

        duration: 0.45, 

        ease: 'power3.out' 

      });



      if (divContent) {

        gsap.to(divContent, {

          borderBottomColor: 'rgba(240, 228, 202, 0.12)',

          duration: 0.45,

          ease: 'power3.out'

        });

      }

    });

  });



  // Enhanced 3D parallax on education card

  const movePanel = (event) => {

    const bounds = panel.getBoundingClientRect();

    const centerX = bounds.left + bounds.width / 2;

    const centerY = bounds.top + bounds.height / 2;

    const mouseX = event.clientX - centerX;

    const mouseY = event.clientY - centerY;



    const rotateY = (mouseX / bounds.width) * 1.5;

    const rotateX = (mouseY / bounds.height) * -1.5;

    const translateX = (mouseX / bounds.width) * 4;

    const translateY = (mouseY / bounds.height) * 4;



    gsap.to(panel, { 

      rotateX, 

      rotateY, 

      translateX,

      translateY,

      transformPerspective: 1000, 

      duration: 0.6, 

      ease: 'power2.out' 

    });

  };



  const resetPanel = () => {

    gsap.to(panel, { 

      rotateX: 0, 

      rotateY: 0,

      translateX: 0,

      translateY: 0,

      duration: 0.9, 

      ease: 'power3.out' 

    });

  };



  panel.addEventListener('pointermove', movePanel, { passive: true });

  panel.addEventListener('pointerleave', resetPanel);



  // Journey button hover animation

  if (journeyBtn) {

    journeyBtn.addEventListener('mouseenter', () => {

      gsap.to(journeyBtn, {

        scale: 1.04,

        duration: 0.3,

        ease: 'power2.out'

      });

    });



    journeyBtn.addEventListener('mouseleave', () => {

      gsap.to(journeyBtn, {

        scale: 1,

        duration: 0.4,

        ease: 'power3.out'

      });

    });

  }



  // Page indicator animation

  if (pageIndicator) {

    gsap.from(pageIndicator, {

      opacity: 0,

      x: 20,

      duration: 0.8,

      delay: 0.6,

      ease: 'power3.out'

    });

  }



  // Cleanup function

  section._educationCleanup = () => {

    panel.removeEventListener('pointermove', movePanel);

    panel.removeEventListener('pointerleave', resetPanel);

  };



  // Scroll-triggered timeline progress animation

  section._educationProgress = (progress) => {

    if (progressLine) {

      // Smooth progress line animation

      gsap.to(progressLine, {

        scaleY: progress,

        transformOrigin: 'top',

        duration: 0.3,

        ease: 'power1.out'

      });

    }



    // Sequential entry activation with smooth transition

    let currentEntryIndex = -1;

    entries.forEach((entry, index) => {

      if (progress >= (index + 0.4) / entries.length) currentEntryIndex = index;

    });



    entries.forEach((entry, index) => {

      const entryThreshold = (index + 0.4) / entries.length;

      const isActive = progress >= entryThreshold;

      entry.classList.toggle('is-current', index === currentEntryIndex);



      if (isActive && !entry.classList.contains('is-active')) {

        entry.classList.add('is-active');



        const icon = entry.querySelector('.education-entry-icon');

        if (icon) {

          gsap.fromTo(icon, 

            { scale: 0.8 }, 

            { scale: 1, duration: 0.5, ease: 'back.out(2)' }

          );

        }

      }

    });

  };

};



const updateScrollMotion = () => {

  sections.forEach((section) => {

    const progressFromViewport = section.getBoundingClientRect().top / window.innerHeight;

    const drift = Math.max(-18, Math.min(18, progressFromViewport * -14));

    section.style.setProperty('--section-drift', `${drift}px`);

  });

};



const updateEducationProgress = () => {

  const section = document.querySelector('.education-section');

  if (!section?._educationProgress) return;

  const rect = section.getBoundingClientRect();

  const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (rect.height + window.innerHeight * 0.35)));

  section._educationProgress(progress);

};



const setupFooterExperience = () => {

  const footer = document.querySelector('.footer-experience');

  if (!footer) return;



  const revealFooter = () => {

    footer.classList.add('is-revealed');

    if (prefersReducedMotion) return;



    const headingWords = footer.querySelectorAll('.footer-heading-word');

    const footerColumns = footer.querySelectorAll('.footer-columns > *');

    gsap.timeline()

      .from(footer.querySelector('.footer-quote'), { opacity: 0, x: -22, duration: 0.7, ease: 'power3.out' })

      .from(footer.querySelector('.footer-cta .eyebrow'), { opacity: 0, y: 14, duration: 0.45, ease: 'power2.out' }, '-=0.35')

      .from(headingWords, { opacity: 0, y: 28, filter: 'blur(7px)', duration: 0.72, stagger: 0.12, ease: 'power3.out' }, '-=0.2')

      .from(footer.querySelector('.footer-cta > p:not(.eyebrow)'), { opacity: 0, y: 14, duration: 0.55, ease: 'power2.out' }, '-=0.36')

      .from(footer.querySelectorAll('.footer-actions .footer-button'), { opacity: 0, y: 18, scale: 0.96, duration: 0.55, stagger: 0.1, ease: 'back.out(1.5)' }, '-=0.28')

      .from(footerColumns, { opacity: 0, y: 22, duration: 0.6, stagger: 0.14, ease: 'power3.out' }, '-=0.1');

  };



  if (prefersReducedMotion) {

    revealFooter();

  } else {

    const observer = new IntersectionObserver(([entry]) => {

      if (!entry.isIntersecting) return;

      revealFooter();

      observer.disconnect();

    }, { threshold: 0.18 });

    observer.observe(footer);

  }



  footer.querySelectorAll('.footer-button').forEach((button) => {

    button.addEventListener('pointermove', (event) => {

      if (prefersReducedMotion) return;

      const bounds = button.getBoundingClientRect();

      const x = (event.clientX - bounds.left - bounds.width / 2) * 0.08;

      const y = (event.clientY - bounds.top - bounds.height / 2) * 0.12;

      gsap.to(button, { x, y, duration: 0.32, ease: 'power2.out', overwrite: 'auto' });

    });

    button.addEventListener('pointerleave', () => gsap.to(button, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1, 0.45)' }));

    button.addEventListener('click', (event) => {

      const ripple = document.createElement('span');

      const bounds = button.getBoundingClientRect();

      ripple.className = 'footer-ripple';

      ripple.style.left = `${event.clientX - bounds.left}px`;

      ripple.style.top = `${event.clientY - bounds.top}px`;

      button.append(ripple);

      ripple.addEventListener('animationend', () => ripple.remove(), { once: true });

    });

  });

};



const setupAmbientScene = () => {

  if (!ambientCanvas || prefersReducedMotion || !window.WebGLRenderingContext) return () => {};



  let renderer;

  try {

    renderer = new THREE.WebGLRenderer({ canvas: ambientCanvas, alpha: true, antialias: true });

  } catch {

    return () => {};

  }



  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);

  camera.position.z = 7;



  const starCount = 54;

  const positions = new Float32Array(starCount * 3);

  const speeds = new Float32Array(starCount);

  for (let index = 0; index < starCount; index += 1) {

    positions[index * 3] = (Math.random() - 0.5) * 14;

    positions[index * 3 + 1] = (Math.random() - 0.5) * 10;

    positions[index * 3 + 2] = (Math.random() - 0.5) * 3;

    speeds[index] = 0.004 + Math.random() * 0.012;

  }

  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({ color: 0xef5b62, size: 0.034, transparent: true, opacity: 0.38, sizeAttenuation: true });

  const stars = new THREE.Points(geometry, material);

  scene.add(stars);

  const resize = () => {

    const width = window.innerWidth;

    const height = window.innerHeight;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

    renderer.setSize(width, height, false);

    camera.aspect = width / height;

    camera.updateProjectionMatrix();

  };

  let animationFrame;

  const render = () => {

    const starPositions = geometry.attributes.position.array;

    for (let index = 0; index < starCount; index += 1) {

      const yIndex = index * 3 + 1;

      starPositions[yIndex] -= speeds[index];

      if (starPositions[yIndex] < -5) starPositions[yIndex] = 5;

    }

    geometry.attributes.position.needsUpdate = true;

    stars.rotation.z += 0.00035;

    renderer.render(scene, camera);

    animationFrame = requestAnimationFrame(render);

  };



  window.addEventListener('resize', resize);

  resize();

  render();



  return () => {

    cancelAnimationFrame(animationFrame);

    window.removeEventListener('resize', resize);

    geometry.dispose();

    material.dispose();

    renderer.dispose();

  };

};



const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;



// Load the primary visual before initializing optional enhancements. That way a

// browser capability issue cannot keep the portfolio at the loading screen.

resizeCanvas();

preloadImages();

requestAnimationFrame(animationLoop);



try {

  locomotiveScroll = new LocomotiveScroll({

    lenisOptions: {

      lerp: prefersReducedMotion ? 1 : 0.1,

      smoothWheel: !prefersReducedMotion,

      syncTouch: false

    },

    scrollCallback: ({ progress }) => {

      scrollProgress = progress;

      window.dispatchEvent(new CustomEvent('portfolio-scroll-progress', { detail: { progress } }));

      hasScrolledAwayFromTop ||= progress > 0.001;

      updateTargetFrame();

      updateScrollMotion();

      updateEducationProgress();

    }

  });

} catch (error) {

  console.warn('Smooth scrolling is unavailable; using native scrolling.', error);

}



if (!window.location.hash) {

  locomotiveScroll?.scrollTo(0, { immediate: true });

}



// Keep the frame sequence responsive even when smooth scrolling is unavailable.

window.addEventListener('scroll', () => {

  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

  scrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;

  hasScrolledAwayFromTop ||= scrollProgress > 0.001;

  updateTargetFrame();

}, { passive: true });



// Event Listeners

window.addEventListener('resize', resizeCanvas);

const disposeAmbientScene = setupAmbientScene();

setupGsapEnhancements();

setupEducationAnimations();

setupAchievementShowcase();

setupPortfolioIconsAndSkills();

setupContentsExperience();

setupAboutExperience();

const disposeScrollPortrait = setupScrollPortrait();

setupHeroExperience();

setupFooterExperience();


createIcons({ icons });

updateScrollMotion();

updateEducationProgress();

window.addEventListener('beforeunload', () => {

  locomotiveScroll?.destroy();

  disposeAmbientScene();

  disposeScrollPortrait();

}, { once: true });
