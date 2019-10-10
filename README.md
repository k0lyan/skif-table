# Skif-table

## Простая реализация фильтруемой таблицы

### Установка модуля из NPM
`npm install skif-table`

### Запуск для разработки и тестирования
`npm run start`

### Создание билда для публикации в NPM
`npm run build` 

### Публикация в NPM
`npm publish` 

### Простой пример

```
state = {
  rows: [
    { id: 1, name: 'becka', kind: 'human' },
    { id: 2, name: 'tonya', kind: 'human' },
    { id: 3, name: 'morty', kind: 'dog' },
    { id: 4, name: 'sia', kind: 'cat' },
  ],
};

<SkifTable
  columns={[
    {
      field: 'name',
      label: 'Имя',
      sort: true,
      filter: 'like',
    },
    {
      field: 'name',
      label: 'Имя',
      sort: true,
      filter: 'like',
    },
    {
      field: 'price', // Имя поля
      label: 'Стоимость', // Имя которое выводим
      sort: true, // Разрешить сортировку
      filter: 'like', // Разрешить фильтр по типу like
      calc: 'avg', // avg - посчитать среднее значение, sum - посчитать сумму
    },
    {
      field: '',
      label: 'Действие',
    },
  ]}
  rows={this.state.rows}
  groupByField="kind" // Группируем по полю
  pageSize={[10, 20, 30]} // Выборки для pagination, первое значение по умолчанию
/>
```

### Props

| name | value |
| ------ | ------ |
| columns | array of objects (ex. [{id: 1, name: 'john'}]) |
| rows | array of column object |
| groupByField | string to group by column (without pagination) |
| captionComponent | custom caption |
| rowComponent | custom row component |
| summaryComponent | custom summary component |
| groupComponent | custom group component |