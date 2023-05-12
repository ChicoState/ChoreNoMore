//to run with detailed reporter: npx eslint . -f node_modules/eslint-detailed-reporter/lib/detailed.js -o report.html
module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true,
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "lcom"
    ],
    "rules": {
        "react/prop-types": "warn",
        "react/jsx-key": "warn",
        "lcom/lcom4": "warn",
        "complexity": ["warn", 10]
    }
}
