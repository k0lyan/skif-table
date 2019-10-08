import React from 'react';
import NumberFormat from 'react-number-format';
import numeral from 'numeral';
import SkifTable from './component/SkifTable';
import peoples from './peoples';

import './App.scss';

const NumberTwo = ({ value }) => (
  <NumberFormat value={numeral(value).format('0[.]00')} displayType="text" thousandSeparator=" " />
);

const CaptionComponent = ({ itemsCount }) => (
  <div className="m-1">
    <div className="row">
      <div className="col text-left">
        Всего записей: {itemsCount}
      </div>
      <div className="col text-right">
        <button onClick={() => alert("some action")} type="button" className="btn btn-danger btn-sm">some action</button>
      </div>
    </div>
  </div>
);

const SummaryComponent = ({ calc }) => (
  <tr className="summary-row">
    <td>Итог:</td>
    <td>-</td>
    <td className="text-right">
      {Number.isNaN(calc.age) ? '' : <NumberTwo value={calc.age} />} (Сред.)
    </td>
    <td className="text-right">
      {Number.isNaN(calc.balance) ? '' : <NumberTwo value={calc.balance} />} (Всего)
    </td>
    <td>-</td>
    <td>-</td>
  </tr>
);

const RowComponent = ({ item }) => (
  <tr>
    <td>{item.id}</td>
    <td>
      <a
        href=""
        onClick={(e) => {
        e.preventDefault();
        alert(`User ${item.id}`);
      }}
      >
        {item.name}
      </a>
    </td>
    <td>{item.balance}</td>
    <td>
      <span className={`badge badge-${(item.gender === 'male' ? 'info' : 'danger')}`}>{ item.gender }</span>
    </td>
    <td>{item.phone}</td>
  </tr>
);

class App extends React.Component {
  state = {
    example1: {
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
          field: 'balance',
          label: 'Баланс',
          sort: true,
        },
        {
          field: 'gender',
          label: 'Пол',
          sort: true,
        },
        {
          field: 'phone',
          label: 'Телефон',
          sort: false,
        },
      ],
    },

    example2: {
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
        },
        {
          field: 'name',
          label: 'Имя',
          sort: true,
          filter: 'like',
        },
        {
          field: 'age',
          label: 'Возраст',
          sort: true,
          filter: 'like',
          calc: 'avg',
        },
        {
          field: 'balance',
          label: 'Баланс',
          sort: true,
          calc: 'sum',
        },
        {
          field: 'gender',
          label: 'Пол',
          sort: true,
        },
        {
          field: 'phone',
          label: 'Телефон',
          sort: false,
        },
      ],
    },

    example3: {
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
        },
        {
          field: 'name',
          label: 'Имя',
          sort: true,
          filter: 'like',
        },
        {
          field: 'balance',
          label: 'Баланс',
          sort: true,
          calc: 'avg',
        },
        {
          field: 'gender',
          label: 'Пол',
          sort: true,
        },
        {
          field: 'phone',
          label: 'Телефон',
          sort: false,
        },
      ],
    },
  };

  render() {
    const { example1, example2, example3 } = this.state;
    return (
      <div className="App">
        <div className="container">
          <div className="card-deck mt-5 mb-5 text-center">
            <div className="card mb-4 shadow-sm">
              <div className="card-header">
                <h4 className="my-0 font-weight-normal">Example 1 (calculate fields, custom pageSize)</h4>
              </div>
              <div className="card-body">
                <SkifTable
                  columns={example1.columns}
                  rows={peoples}
                  pages={[10, 20, 30]}
                />
              </div>
            </div>
          </div>

          <div className="card-deck mb-5 text-center">
            <div className="card mb-4 shadow-sm">
              <div className="card-header">
                <h4 className="my-0 font-weight-normal">Example 2 (calculate fields, custom pageSize)</h4>
              </div>
              <div className="card-body">
                <SkifTable
                  columns={example2.columns}
                  rows={peoples}
                  summaryComponent={<SummaryComponent />}
                  pages={[10, 20, 30]}
                />
              </div>
            </div>
          </div>

          <div className="card-deck mb-5 text-center">
            <div className="card mb-4 shadow-sm">
              <div className="card-header">
                <h4 className="my-0 font-weight-normal">Example 3 (custom row)</h4>
              </div>
              <div className="card-body">
                <SkifTable
                  columns={example3.columns}
                  rows={peoples}
                  rowComponent={<RowComponent />}
                />
              </div>
            </div>
          </div>

          <div className="card-deck mb-5 text-center">
            <div className="card mb-4 shadow-sm">
              <div className="card-header">
                <h4 className="my-0 font-weight-normal">Example 4 (grouped doesn`t have pagination and custom caption)</h4>
              </div>
              <div className="card-body">
                <SkifTable
                  columns={example3.columns}
                  rows={peoples.slice(0, 20)}
                  groupByField="favoriteFruit"
                  captionComponent={<CaptionComponent />}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

export default App;
