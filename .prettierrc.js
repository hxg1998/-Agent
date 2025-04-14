/**
 * Prettier配置文件
 * 定义代码格式化规则
 */
module.exports = {
  // 每行最大长度
  printWidth: 100,
  // 使用单引号
  singleQuote: true,
  // 末尾使用分号
  semi: true,
  // 对象属性引号只在必要时使用
  quoteProps: 'as-needed',
  // jsx中使用双引号
  jsxSingleQuote: false,
  // 多行时使用尾逗号
  trailingComma: 'all',
  // 在对象花括号内部使用空格
  bracketSpacing: true,
  // 将>放在最后一行的末尾，而不是单独放在下一行
  bracketSameLine: false,
  // 箭头函数参数在必要时使用括号
  arrowParens: 'avoid',
  // 缩进2个空格
  tabWidth: 2,
  // 使用空格而不是tab进行缩进
  useTabs: false,
  // 换行符使用lf
  endOfLine: 'lf',
  // 不格式化嵌入的代码
  embeddedLanguageFormatting: 'auto'
};