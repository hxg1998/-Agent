/**
 * Stylelint配置文件
 * 定义CSS代码规范
 */
module.exports = {
  extends: ['stylelint-config-standard'],
  rules: {
    // 允许空源文件
    'no-empty-source': null,
    // 允许厂商前缀
    'property-no-vendor-prefix': null,
    'value-no-vendor-prefix': null,
    // 允许未知规则
    'at-rule-no-unknown': null,
    // 颜色函数
    'color-function-notation': 'legacy',
    'alpha-value-notation': 'number',
    'color-function-alias-notation': null,
    // 颜色值
    'color-hex-length': null,
    // 允许使用!important
    'declaration-no-important': null,
    // 字体族名称引号
    'font-family-name-quotes': 'always-where-recommended',
    // 允许零值单位
    'length-zero-no-unit': null,
    // 允许使用word-break: break-word
    'declaration-property-value-keyword-no-deprecated': null,
    // 允许使用旧的media feature notation
    'media-feature-range-notation': null,
    // 允许规则之间没有空行
    'rule-empty-line-before': null,
    // 允许重复选择器
    'no-duplicate-selectors': null
  },
  ignoreFiles: ['node_modules/**', 'build/**', 'dist/**'],
};