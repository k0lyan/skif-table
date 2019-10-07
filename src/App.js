import React from 'react';
import SkifTable from './components/skif-table/SkitTable';

import './App.css';

const SummaryComponent = ({ calc }) => (
  <tr className="summary-row">
    <td>Итог:</td>
    <td className="text-right">{Number.isNaN(calc.id) ? '' : calc.id}</td>
  </tr>
);

class App extends React.Component {
  state = {
    crud: {
      columns: [
        {
          field: 'id',
          label: 'ID',
          sort: true,
          filter: 'like',
          styles: {
            width: '80px',
            textAlign: 'center',
          },
          calc: 'avg',
        },
        {
          field: 'name',
          label: 'Имя',
          sort: true,
          filter: 'like',
        },
        {
          field: 'kind',
          label: 'Тип',
          sort: true,
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

  render() {
    const { crud, rows } = this.state;
    return (
      <div className="App">
        <SkifTable
          crud={crud}
          rows={rows}
          summaryComponent={<SummaryComponent />}
        />
      </div>
    );
  }
}

export default App;
