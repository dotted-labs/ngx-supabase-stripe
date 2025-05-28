import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { readFileSync } from 'fs';

// Modular builds for Edge Functions (Stripe as external dependency)
const modules = [
  'checkout-session',
  'create-subscription', 
  'create-portal-session',
  'session-status'
];

const moduleConfigs = modules.map(moduleName => ({
  input: `src/supabase/functions/${moduleName}/index.ts`,
  output: [
    {
      file: `dist/${moduleName}/index.js`,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: `dist/${moduleName}/index.esm.js`,
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
    }),
  ],
}));


export default [
  ...moduleConfigs,
]; 