import React from 'react';
import PropTypes from 'prop-types';
import sort from 'fast-sort';
import Pagination from 'react-js-pagination';

class DefaultRowComponent extends React.PureComponent {
  render() {
  const { columns, item } = this.props;
  return (
    <tr>
      {
        columns.map((e, index) => <td key={`i_${index}`}>{item[e.field]}</td>)
      }
    </tr>
    );
  }
}
DefaultRowComponent.propTypes = {
  columns: PropTypes.array,
  item: PropTypes.any,
};

class DefaultGroupComponent extends React.PureComponent {
  render() {
    const { name } = this.props;
    return (
      <tr className="group">
        <td colSpan="12">{name}</td>
      </tr>
    );
  }
}
DefaultGroupComponent.propTypes = {
  name: PropTypes.string,
};

const PageSize = ({ pages, value, onChange }) => {
  const selected = (value) || pages[0];

  return (
    <select onChange={onChange} value={selected} className="crud-pagesize form-control" name="page_size">
      {
        pages.map((value) => <option key={value}>{value}</option>)
      }
    </select>
  );
};

const FILTER_LIKE = 'like';

class SkifTable extends React.Component {

  pages = [50, 100, 500, 1000, 10000];

  constructor(props) {
    super(props);

    if (props.pages && props.pages.length > 0) {
      this.pages = props.pages;
    }

    this.state = {
      pageNumber: 1,
      filterValues: {},
      sortAsc: true,
      sortField: 'id',
      pageSize: this.pages[0],
    };
  }

  handleSort = (field) => {
    const { sortField, sortAsc } = this.state;
    let newSortAsc = true;

    if (field === sortField) {
      newSortAsc = !sortAsc;
    }

    this.setState({
      sortField: field,
      sortAsc: newSortAsc,
    });
  };

  handleFilter = (e, field) => {
    const { filterValues } = this.state;
    this.setState({
      filterValues: {
        ...filterValues,
        ...{ [field]: e.target.value },
      },
      pageNumber: 1, // Reset page
    });
  };

  handlePageSize = (e) => {
    const size = e.target.value;

    this.setState({
      pageSize: parseInt(size, 10),
      pageNumber: 1, // Reset page
    });
  };

  handlePageChange = (pageNumber) => {
    this.setState({
      pageNumber,
    });
  };

  getFilteredItems = () => {
    const { filterValues } = this.state;
    const { rows, columns } = this.props;
    const columnsLike = columns
      .filter((item) => item.filter === FILTER_LIKE)
      .map((item) => item.field);

    return rows.filter((item) => {
      let founded = true;
      Object.keys(item).forEach((key) => {
        if (columnsLike.includes(key)) {
          if (filterValues[key] !== undefined) {
            if (!(item[key] !== null
              && filterValues[key] != null
              && item[key]
                .toString()
                .toLowerCase()
                .indexOf(filterValues[key].toString().toLowerCase()) > -1)) {
              founded = false;
            }
          }
        }
      });
      return founded;
    });
  };

  getCalc = (items) => {
    const { columns, groupByField } = this.props;

    const calcColumns = columns.filter((item) => item.calc)
      .map((item) => ({ name: item.field, calc: item.calc }));

    const result = {};
    const resultGroup = {};
    const resultGroupCount = {};

    if (calcColumns.length > 0) {
      // Проходим по всем записям
      items.forEach((item) => {
        // Проходим по всем полям
        calcColumns.forEach((col) => {
          const value = item[col.name];

          if (result[col.name] === undefined) {
            result[col.name] = 0;
          }

          if (col.calc === 'sum' || col.calc === 'avg') {
            result[col.name] += value;
          }

          if (groupByField) {
            if (resultGroup[item[groupByField]] === undefined) {
              resultGroup[item[groupByField]] = {};
            }

            if (resultGroup[item[groupByField]][col.name] === undefined) {
              resultGroup[item[groupByField]][col.name] = 0;
            }

            if (col.calc === 'sum' || col.calc === 'avg') {
              resultGroup[item[groupByField]][col.name] += value;
            }
          }
        });

        if (groupByField) {
          if (resultGroupCount[item[groupByField]] === undefined) {
            resultGroupCount[item[groupByField]] = 0;
          }
          // Считаем кол-во записей для каждой группы
          resultGroupCount[item[groupByField]] += 1;
        }
      });

      // Высчитаем среднее значение для полей avg
      const size = items.length;
      calcColumns.forEach((col) => {
        if (col.calc === 'avg') {
          result[col.name] = result[col.name] / size;
        }

        if (groupByField) {
          Object.keys(resultGroup).forEach((dep_name) => {
            if (col.calc === 'avg') {
              resultGroup[dep_name][col.name] = resultGroup[dep_name][col.name] / resultGroupCount[dep_name];
            }
          });
        }
      });
    }
    return { all: result, group: resultGroup };
  };

  // Make array group by field
  groupBy = (xs, key) => xs.reduce((rv, x) => {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});

  // Array pagination
  paginateArray = (array, pageSize, pageNumber) => {
    const number = pageNumber - 1; // because pages logically start with 1, but technically with 0
    return array.slice(number * pageSize, (number + 1) * pageSize);
  };

  showHead = () => {
    const { columns } = this.props;
    const { sortField, sortAsc } = this.state;

    return (
      <tr>
        {columns.map((item, index) => {
          if (item.sort) {
            let thClasses = 'sorting';

            if (item.field === sortField) {
              thClasses += ` ${ sortAsc ? 'asc' : 'desc'}`;
            }

            return (
              <th className={thClasses} style={item.styles} onClick={() => this.handleSort(item.field)} key={`l_${index}`}>
                {item.label}
              </th>
            );
          }
          return <th key={`l_${index}`}>{item.label}</th>;
        })}
      </tr>
    );
  };

  showHeadFilters = () => {
    const { columns } = this.props;

    return (
      <tr>
        {columns.map((item, index) => {
            if (item.filter !== undefined && item.filter === FILTER_LIKE) {
              return (
                <th
                  key={`f_${index}`}
                >
                  <input onChange={(e) => this.handleFilter(e, item.field)} type="text" className="form-control" placeholder={item.label} />
                </th>
              );
            }
            return <th key={`f_${ index}`} />;
          })}
      </tr>
    );
  };

  showCaption = (itemsCount) => {
    const { captionComponent } = this.props;

    if (captionComponent) {
      return React.cloneElement(captionComponent, { itemsCount });
    }
    return (
      <div className="row top-table-caption">
        <div className="col-sm-6 left-caption" />
        <div className="col-sm-6 right-caption">
          Всего записей: {itemsCount}
        </div>
      </div>
    );
  };

  showBody = (items, calc) => {
    const {
      columns, rows, rowComponent, groupComponent, groupByField,
    } = this.props;
    const {
      sortAsc, sortField, pageNumber, pageSize,
    } = this.state;

    if (sortAsc) {
      sort(items).asc((u) => u[sortField]);
    } else {
      sort(items).desc((u) => u[sortField]);
    }

    if (groupByField) {
      const unique = [...new Set(rows.map((item) => item[groupByField]))];
      const grouped = this.groupBy(items, groupByField);

      let count = 0;
      const groupedItems = [];
      const idsGroups = [];

      unique.forEach((value, index) => {
        if (grouped[value]) {
          if (!idsGroups.includes(index)) {
            if (groupComponent) {
              groupedItems.push(React.cloneElement(groupComponent, {
                name: value, key: `g_row_${ count}`, values: grouped[value], calc: calc.group[value],
              }));
            } else {
              groupedItems.push(<DefaultGroupComponent key={`row${count}`} name={value} />);
            }
            count += 1;
          }
          idsGroups.push(index);

          grouped[value].forEach((item) => {
            if (rowComponent) {
              groupedItems.push(React.cloneElement(rowComponent, { item, key: `row_${ count}` }));
            } else {
              groupedItems.push(<DefaultRowComponent key={`row${ count}`} columns={columns} item={item} />);
            }
            count += 1;
          }, this);
        }
      }, this);

      return groupedItems;
    }

    return this.paginateArray(items, pageSize, pageNumber).map((item, index) => {
      // if custom row
      if (rowComponent) {
        return React.cloneElement(rowComponent, { item, key: `row_${ index}` });
        // if dont receive custom component, render default
      }
      return (
        <DefaultRowComponent key={`row${ index}`} columns={columns} item={item} />
      );
    });
  };

  render() {
    const { summaryComponent, groupByField } = this.props;
    const { pageNumber, pageSize } = this.state;
    const items = this.getFilteredItems();

    const calcInfo = this.getCalc(items);

    let itemsCount = 0;
    if (Array.isArray(items)) {
      itemsCount = items.length;
    }

    return (
      <div className="crud-table-wrapper">
        { this.showCaption(itemsCount) }
        <table className="table table-bordered table-striped expandable-table">
          <thead>
            {this.showHead()}
            {summaryComponent && React.cloneElement(summaryComponent, { calc: calcInfo.all })}
            {this.showHeadFilters()}
          </thead>
          <tbody>
            {this.showBody(items, calcInfo)}
          </tbody>
        </table>
        <div className="card-footer clearfix">
          <div className="float-right">
            {!groupByField
            && (
              <div className="form-inline">
                {pageSize && (
                  <PageSize
                    onChange={this.handlePageSize}
                    value={pageSize}
                    pages={this.pages}
                  />
                )}
                <Pagination
                  innerClass="pagination crud-pagination"
                  itemClass="page-item"
                  linkClass="page-link"
                  activePage={pageNumber}
                  itemsCountPerPage={pageSize}
                  totalItemsCount={itemsCount}
                  onChange={this.handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

SkifTable.defaultProps = {
  groupByField: null,
  captionComponent: null,
  rowComponent: null,
  summaryComponent: null,
  groupComponent: null,
};

SkifTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  groupByField: PropTypes.string,
  captionComponent: PropTypes.element,
  rowComponent: PropTypes.element,
  summaryComponent: PropTypes.element,
  groupComponent: PropTypes.element,
};

export default SkifTable;
