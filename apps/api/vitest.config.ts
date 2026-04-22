import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: 'postgresql://spatiumai:test@localhost:5432/spatiumai_test',
      JWT_SECRET: 'test_secret_that_is_long_enough_for_jwt_32_chars_min',
    },
  },
});
