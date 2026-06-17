import { withRslibConfig } from '@rstest/adapter-rslib'
import { defineConfig } from '@rstest/core'

export default defineConfig({
  extends: withRslibConfig(),
  include: ['./tests/lib/**/*.ts?(x)'],
  exclude: ['./tests/**/*.d.ts'],
  setupFiles: ['./rstest.setup.ts'],
  testEnvironment: 'happy-dom',
})
