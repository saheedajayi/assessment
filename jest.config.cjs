module.exports = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
    moduleNameMapping: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    testMatch: ["<rootDir>/src/**/__tests__/**/*.(ts|tsx|js)", "<rootDir>/src/**/?(*.)(spec|test).(ts|tsx|js)"],
    collectCoverageFrom: ["src/**/*.(ts|tsx)", "!src/**/*.d.ts", "!src/index.tsx", "!src/setupTests.ts"],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70,
        },
    },
    globals: {
        "ts-jest": {
            tsconfig: {
                jsx: "react-jsx",
                esModuleInterop: true,
                allowSyntheticDefaultImports: true,
                types: ["jest", "@testing-library/jest-dom", "node"],
            },
        },
    },
    transformIgnorePatterns: ["node_modules/(?!(.*\\.mjs$))"],
}


