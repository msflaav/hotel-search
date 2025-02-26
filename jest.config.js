module.exports = {
    projects: [
        {
            displayName: "api",
            preset: "ts-jest",
            testEnvironment: "node",
            roots: ["<rootDir>/packages/api"],
            transform: {
                "^.+\\.tsx?$": "ts-jest",
            },
            globals: {
                "ts-jest": {
                    tsconfig: "<rootDir>/packages/api/tsconfig.json",
                },
            },
        },
        {
            displayName: "client",
            preset: "ts-jest",
            testEnvironment: "jsdom",
            roots: ["<rootDir>/packages/client"],
            transform: {
                "^.+\\.tsx?$": "ts-jest",
            },
            globals: {
                "ts-jest": {
                    tsconfig: "<rootDir>/packages/client/tsconfig.json",
                },
            },
        },
    ],
};