import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        globals: true,
        setupFiles: ['./tests/setup.ts'],
        coverage: {
            enabled: false,
            provider: 'v8',
            exclude: [
                'index.ts',
                'example.ts'
            ],
            thresholds: {
                lines: 85,
                functions: 85,
                branches: 75,
                statements: 85
            }
        }
    }
});


