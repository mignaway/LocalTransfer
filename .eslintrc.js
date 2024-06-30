module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true,
        "es6": true,
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
    ],
    "overrides": [
        {
            "env": {
                "node": true,
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "react/react-in-jsx-scope": "off",
        // allow jsx syntax in js files (for next.js project)
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        "react/jsx-uses-react": "error",   
        "react/jsx-uses-vars": "error",
        'no-unused-vars': 'off',
        'react/prop-types': "off",
        "react/no-unknown-property": ["error", { ignore: ["jsx"] }],
    }
}
