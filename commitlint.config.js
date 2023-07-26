module.exports = {
  extends: ['@commitlint/config-conventional'],
  //  rule由name和配置数组组成，如：'name:[0, 'always', 72]'，
  //  数组中第一位为level，可选0,1,2，0为disable，1为warning，2为error
  //  第二位是 应用与否，可选always|never
  //  第三位该rule的值。
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'wip', // 开发中
        'feat', // 新特性、新功能
        'fix', // 修补某功能的bug
        'refactor', // 重构某个功能
        'docs', // 仅文档新增/改动
        'chore', // 不属于以上类型的其他类型(日常事务)
        'style', // 代码格式修改, 注意不是 css 修改， 不影响程序逻辑的代码修改(修改空白字符，补全缺失的分号等)
        'revert', // 回滚到上一个版本
        'build', // 编译相关的修改，例如发布版本、对项目构建或者依赖的改动
        'perf', // 优化相关，比如提升性能、体验
        'test', // 测试用例修改
      ],
    ],
    // 提交类型的 大小写区分 禁用
    'type-case': [0],
    // 提交类型为空  禁用 就是必须有提交类型
    'type-empty': [0],
    // 提交范围为空 禁用 就是必须有提交的影响范围scope 比如 “fix(学生查看报告): 修复某某功能”
    'scope-empty': [0, 'never'],
    // 提交范围 大小写区分 禁用
    'scope-case': [0],
    // 提交主体内容结尾符号 禁用 可以不写
    'subject-full-stop': [0, 'never'],
    // 提交主体内容大小写区分 禁用
    'subject-case': [0, 'never'],
    // 提交字数最大限度
    'header-max-length': [0, 'always', 72],
  },
}
