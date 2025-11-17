module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Tipos permitidos
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'refactor',
        'perf',
        'docs',
        'style',
        'test',
        'chore',
        'build',
        'ci',
        'revert',
      ],
    ],
    // Scope opcional, pero si existe debe ser lower-case, camelCase o kebab-case
    'scope-case': [2, 'always', ['lower-case', 'camel-case', 'kebab-case']],
    // Subject debe estar en minúsculas (excepto nombres propios)
    'subject-case': [2, 'never', ['upper-case', 'pascal-case', 'start-case']],
    // Subject no debe terminar en punto
    'subject-full-stop': [2, 'never', '.'],
    // Longitud mínima del subject
    'subject-min-length': [2, 'always', 10],
    // Longitud máxima del subject
    'subject-max-length': [2, 'always', 100],
    // Longitud máxima del header completo (type + scope + subject)
    'header-max-length': [2, 'always', 100],
    // Type es obligatorio
    'type-empty': [2, 'never'],
    // Subject es obligatorio
    'subject-empty': [2, 'never'],
    // Type debe estar en minúsculas
    'type-case': [2, 'always', 'lower-case'],
  },
}
