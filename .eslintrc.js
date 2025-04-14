/**
 * ESLint配置文件
 * 优化后的React项目ESLint配置
 */
module.exports = {
  extends: [
    "react-app",
    "react-app/jest",
    "eslint:recommended",
    "plugin:prettier/recommended"
  ],
  plugins: [
    "react",
    "import",
    "prettier"
  ],
  rules: {
    // React Hooks规则 - 使用react-app中已有的规则，避免冲突

    // 变量规则
    "no-unused-vars": ["warn", {
      argsIgnorePattern: "^_", // 忽略以_开头的未使用参数
      varsIgnorePattern: "^_"  // 忽略以_开头的未使用变量
    }],
    "no-var": "error",        // 禁用var，使用let/const
    "prefer-const": "warn",   // 如果变量不会被重新赋值，建议使用const

    // 格式规则 - 大部分由Prettier接管
    "prettier/prettier": "warn", // Prettier规则作为ESLint的警告
    "indent": "off", // 由Prettier处理
    "quotes": "off", // 由Prettier处理
    "semi": "off", // 由Prettier处理
    "comma-dangle": "off", // 由Prettier处理

    // React规则
    "react/jsx-uses-react": "off", // 适用于React 17+，不需要导入React
    "react/react-in-jsx-scope": "off", // 适用于React 17+，不需要导入React
    "react/prop-types": "warn", // 建议使用prop-types
    "react/jsx-curly-spacing": "off", // 由Prettier处理

    // 辅助功能规则
    "jsx-a11y/alt-text": "warn", // 图片需要alt属性
    "jsx-a11y/anchor-has-content": "warn" // 链接需要内容
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true
  },
  settings: {
    react: {
      version: "detect" // 自动检测React版本
    },
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  ignorePatterns: [
    "node_modules/",
    "build/",
    "dist/",
    "*.min.js"
  ]
};