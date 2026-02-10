import * as esbuild from 'esbuild'
import fs from 'node:fs'
import { builtinModules } from 'node:module'
import path from 'node:path'
import pkg from './package.json'

const isProd = process.argv.includes('--prod')

async function runBuild() {
  try {
    const outdir = path.join(import.meta.dirname, './dist')
    if (fs.existsSync(outdir)) fs.rmSync(outdir, { recursive: true, force: true })

    const commonOptions: esbuild.BuildOptions = {
      entryPoints: ['src/index.ts'],

      bundle: true,
      minify: isProd,
      sourcemap: true,
      platform: 'node',
      // format: 'esm',
      target: 'node22',
      // outdir,

      external: [
        ...builtinModules,
        ...builtinModules.map((m) => `node:${m}`),
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.devDependencies || {}),
      ],

      define: {
        'process.env.NODE_ENV': isProd ? '"production"' : '"development"',
      },

      logLevel: 'info',
    }

    await esbuild.build({
      ...commonOptions,
      format: 'cjs',
      outfile: path.join(outdir, 'index.js'),
    })
    await esbuild.build({
      ...commonOptions,
      format: 'esm',
      outfile: path.join(outdir, 'index.mjs'),
    })
  } catch (error) {
    console.error('❌ Build failed:', error)
    process.exit(1)
  }
}

runBuild()
