// jest.config.js
module.exports = {
    verbose: true,
    testPathIgnorePatterns: ["<rootDir>/src/mobile/", "<rootDir>/core/", "<rootDir>/node_modules/"],
    "moduleNameMapper": {
        "^browser(.*)$": "<rootDir>/src/browser$1",
        "^server(.*)$": "<rootDir>/src/server$1",
        "^shared(.*)$": "<rootDir>/src/shared$1",
    },
    testMatch: [
        "<rootDir>/dist/**/?(*.)(test).{js,jsx,mjs}",
    ],
};