// ============================================================
// gulpfile.js — Modern Gulp 5 (ESM) Boilerplate
// Compatible with: Gulp 5+, Node 18+
// ============================================================
// package.json must have: "type": "module"
// Install: npm install -D gulp gulp-sass sass gulp-postcss
//          autoprefixer cssnano gulp-sourcemaps gulp-concat
//          gulp-terser gulp-replace gulp-htmlmin
//          gulp-purgecss browser-sync

import { src, dest, watch, series, parallel } from "gulp";
import gulpSass from "gulp-sass";
import * as sass from "sass";
import concat from "gulp-concat";
import terser from "gulp-terser";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import sourcemaps from "gulp-sourcemaps";
import replace from "gulp-replace";
import htmlMin from "gulp-htmlmin";
import purgecss from "gulp-purgecss";
import browserSync from "browser-sync";

// ─── Sass setup ─────────────────────────────────────────────
const scss = gulpSass(sass);
const bs = browserSync.create();

// ─── Paths ──────────────────────────────────────────────────
const paths = {
  scss: "./scss/**/*.scss",
  vendor: "./vendor/**/*.js",
  js: "./js/**/*.js",
  html: "./*.html",
  dist: "./dist",
};

// Files/folders copied as-is to dist/
const assetGlobs = [
  "images/**/*.*",
  "fonts/**/*.*",
  // "videos/**/*.*",
];

// Vendor JS — listed in the exact order they must be bundled
const vendorFiles = [
  "./vendor/aos.js",
  "./vendor/lenis.js",
  "./vendor/bootstrap.bundle.js",
  "./vendor/swiper-bundle.js",
  "./vendor/fancybox.umd.js",
];

// Non-bundled JS files — moved individually (no concat)
const nonBundledJs = [
  "js/jquery.js",
  "js/jquery-migrate.js",
  "js/home.js",
  "js/app.js",
];

// ─── SCSS → CSS ──────────────────────────────────────────────
export function scssTask() {
  return src(paths.scss, { sourcemaps: true })
    .pipe(scss().on("error", scss.logError))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest(`${paths.dist}/css`, { sourcemaps: "." }));
}

// ─── Vendor JS bundle ────────────────────────────────────────
export function jsTask() {
  return src(vendorFiles, { sourcemaps: true })
    .pipe(concat("vendor.js"))
    .pipe(terser())
    .pipe(dest(`${paths.dist}/js`, { sourcemaps: "." }));
}

// ─── Non-bundled JS (moved individually) ─────────────────────
export function moveNonBundledJsTask() {
  return src(nonBundledJs, { base: "./" }).pipe(dest(paths.dist));
}

// ─── Cache-bust + HTML minify ────────────────────────────────
export function cacheBustTask() {
  const cb = Date.now();
  return src(paths.html)
    .pipe(replace(/cb=\d+/g, `cb=${cb}`))
    .pipe(
      htmlMin({
        collapseWhitespace: true,
        removeComments: true,
        minifyJS: true,
        minifyCSS: true,
      }),
    )
    .pipe(dest(paths.dist));
}

// ─── Purge unused CSS ────────────────────────────────────────
export function purgingTask() {
  return src(`${paths.dist}/css/*.css`)
    .pipe(purgecss({ content: [`${paths.dist}/*.html`] }))
    .pipe(dest(`${paths.dist}/css/purged`));
}

// ─── Copy static assets ──────────────────────────────────────
export function movingTask() {
  return src(assetGlobs, { base: "./", encoding: false }).pipe(
    dest(paths.dist),
  );
}

// ─── BrowserSync ─────────────────────────────────────────────
export function browserSyncServe(cb) {
  bs.init({
    server: { baseDir: "." },
    notify: { styles: { top: "auto", bottom: "0" } },
  });
  cb();
}

export function browserSyncReload(cb) {
  bs.reload();
  cb();
}

// ─── Core build steps (reused in watch pipelines) ────────────
const coreBuild = parallel(scssTask, jsTask, moveNonBundledJsTask);

// ─── Watch (no server) ───────────────────────────────────────
export function watchTask() {
  watch(
    [paths.scss, paths.js, paths.vendor],
    { interval: 1000, usePolling: true },
    series(coreBuild, cacheBustTask),
  );
}

// ─── Watch (with BrowserSync) ────────────────────────────────
export function bsWatchTask() {
  watch(paths.html, browserSyncReload);
  watch(
    [paths.scss, paths.js, paths.vendor],
    { interval: 1000, usePolling: true },
    series(
      coreBuild,
      cacheBustTask,
      purgingTask,
      movingTask,
      browserSyncReload,
    ),
  );
}

// ─── Exported tasks ──────────────────────────────────────────

// npx gulp          → full build + watch
export default series(
  coreBuild,
  cacheBustTask,
  purgingTask,
  movingTask,
  watchTask,
);

// npx gulp bs       → full build + BrowserSync + watch
export const bs2 = series(
  coreBuild,
  cacheBustTask,
  purgingTask,
  movingTask,
  browserSyncServe,
  bsWatchTask,
);

// npx gulp build    → one-off production build (no watch)
export const build = series(coreBuild, cacheBustTask, purgingTask, movingTask);
