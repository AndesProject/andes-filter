# Andes Filter

### Description

This project aims to develop a filtering library that allows developers to apply complex filters and
conditions to data collections in an intuitive and programmatic way. By using objects to define
conditions, users can combine logical and relational operators, making it easy to construct queries
and manage data efficiently and at scale. The library is developed in TypeScript, ensuring type
safety and modern JavaScript features for enhanced developer experience and performance.

### Features

Features

- Intuitive Conditionals: Define complex filters using objects.
- Logical and Relational Operators: Combine multiple conditions for advanced queries.
- Scalability: Designed to handle large data volumes with high performance.
- Ease of Use: Clear and consistent syntax to improve developer productivity.

### Coverage

<div align="center">
  <a href="https://codecov.io/github/AndesProject/andes-filter">
    <img src="https://codecov.io/github/AndesProject/andes-filter/branch/master/graph/badge.svg?token=KT8REBY8K1" alt="codecov">
  </a>
  <br>
  <a href="https://codecov.io/github/AndesProject/andes-filter">
    <img src="https://codecov.io/github/AndesProject/andes-filter/branch/master/graphs/sunburst.svg?token=KT8REBY8K1" alt="codecov">
  </a>
</div>



### Operadores

#### Operadores de Comparación

- equals: Igual a un valor específico.
- not: No igual a un valor específico.
- in: Dentro de un conjunto de valores.
- notIn: No dentro de un conjunto de valores.
- lt: Menor que.
- lte: Menor o igual que.
- gt: Mayor que.
- gte: Mayor o igual que.

#### Operadores de Fecha y Hora

- equals: Igual a una fecha específica.
- not: No igual a una fecha específica.
- in: Dentro de un conjunto de fechas.
- notIn: No dentro de un conjunto de fechas.
- lt: Menor que una fecha específica.
- lte: Menor o igual que una fecha específica.
- gt: Mayor que una fecha específica.
- gte: Mayor o igual que una fecha específica.

#### Operadores Numéricos

- equals: Igual a un número.
- not: No igual a un número.
- in: Dentro de un conjunto de números.
- notIn: No dentro de un conjunto de números.
- lt: Menor que un número.
- lte: Menor o igual que un número.
- gt: Mayor que un número.
- gte: Mayor o igual que un número.

#### Operadores de String

- contains: Contiene una subcadena específica.
- startsWith: Comienza con una subcadena específica.
- endsWith: Termina con una subcadena específica.
- mode: Define si la comparación debe ser sensible o insensible a mayúsculas/minúsculas.

#### Operadores de Relación

- some: Al menos un elemento en la relación cumple con la condición.
- every: Todos los elementos en la relación cumplen con la condición.
- none: Ningún elemento en la relación cumple con la condición.

#### Operadores de Array

- has: Contiene un valor específico.
- hasEvery: Contiene todos los valores especificados.
- hasSome: Contiene al menos uno de los valores especificados.
- isEmpty: El array está vacío.

#### Operadores Booleanos

- equals: Igual a un valor booleano (true o false).
