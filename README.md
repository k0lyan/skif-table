# Skif-table

## Простая реализация фильтруемой таблицы


### Установка модуля из NPM
`npm install skif-table`

### Запуск для разработки и тестирования
`npm run start`

### Создание билда для публикации в NPM
`npm run build` 

###Simple example

```
state = {
    crud: {
      columns: [
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
          field: '',
          label: 'Действие',
        },
      ],
      pageSize: 40,
    },
    rows: [
      { id: 1, name: 'becka', kind: 'human' },
      { id: 2, name: 'tonya', kind: 'human' },
      { id: 3, name: 'morty', kind: 'dog' },
      { id: 4, name: 'sia', kind: 'cat' },
    ],
  };
```

### Props

| name | value |
| ------ | ------ |
| columns | array of objects (ex. [{id: 1, name: 'john'}]) |
| rows | array of column object |
| groupByField | string to group by column (without pagination) |
| captionComponent | [plugins/onedrive/README.md][PlOd] |
| rowComponent | custom row component |
| summaryComponent | custom summary component |
| groupComponent | custom group component |