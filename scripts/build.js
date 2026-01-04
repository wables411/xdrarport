#!/usr/bin/env node

/**
 * Build script for static HTML site
 * Copies all necessary files to dist/ directory for Cloudflare Pages deployment
 */

import { mkdir, cp } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

const distDir = join(process.cwd(), 'dist');

async function build() {
  try {
    // Create dist directory
    if (!existsSync(distDir)) {
      await mkdir(distDir, { recursive: true });
    }

    // Files and directories to copy
    const filesToCopy = [
      'index.html',
      'clients',
      'work',
      'branding',
      'visuals',
      'personal.html',
      'archive.html',
      'script.js',
      'styles.css',
      'XDRAR.mp4',
      'public',
      'fonts',
      'functions'
    ];

    console.log('📦 Building static site...');

    // Copy each file/directory
    for (const item of filesToCopy) {
      const source = join(process.cwd(), item);
      const dest = join(distDir, item);

      if (existsSync(source)) {
        await cp(source, dest, { recursive: true });
        console.log(`  ✅ Copied ${item}`);
      } else {
        console.log(`  ⚠️  Skipped ${item} (not found)`);
      }
    }

    // Copy _redirects file to root of dist (required for Cloudflare Pages)
    const redirectsSource = join(process.cwd(), 'public', '_redirects');
    const redirectsDest = join(distDir, '_redirects');
    if (existsSync(redirectsSource)) {
      await cp(redirectsSource, redirectsDest);
      console.log('  ✅ Copied _redirects to root');
    }

    console.log('✨ Build complete!');
    console.log(`📁 Output directory: ${distDir}`);
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();
