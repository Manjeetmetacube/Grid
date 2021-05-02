import "./styles.css";
export default class DynamicGrid {
  _columns = [];
  get columns() {
    return this._columns;
  }
  set columns(value) {
    // if (value < 0) {
    //     value = 0;
    // }
    this._columns = value;
    this.createHeader();
  }

  _data = [];
  _clickedHeader = "";
  get data() {
    return this._data;
  }
  set data(value) {
    debugger;
    // if (value < 0) {
    //     value = 0;
    // }

    if (value.length > 0 && this._columns.length <= 0) {
      alert("Invalid data");
      return;
    } else {
      // this._originalData=value;
      //Handle the filter function here
      if (this._filteredData && this._pageSize && this._pageSize != 0)
        this._totalPage = Math.ceil(this._filteredData.length / this._pageSize);
      //Remove if the page size is changed
      if (
        this.tableNode &&
        this.tableNode.tBodies[0] &&
        this.tableNode.tBodies[0].children.length > this._pageSize
      ) {
        var i = dynamicGrid.tableNode.tBodies[0].children.length - 1;
        while (i >= this._pageSize) {
          this.tableNode.tBodies[0].children[i].remove();
          i--;
        }
      }
      this.filterDataForPagination();
      this.formatData();
    }
  }
  _paginatedData = [];
  _pageSize;
  get pageSize() {
    return this._pageSize;
  }

  set pageSize(value) {
    //if there is change in page size compared to previous one
    if (this._pageSize > 0 && this._pageSize > value) {
      this._previousPageSize = this._pageSize;
    }
    this._pageSize = value;
  }

  _filterFunction;
  get filterFunction() {
    return this._filterFunction;
  }
  set filterFunction(value) {
    // if (value < 0) {
    //     value = 0;
    // }
    this._filterFunction = value;
    this.setData(null, false);
  }

  _totalPage;
  get totalPage() {
    return this._totalPage;
  }
  set totalPage(value) {
    // if (value < 0) {
    //     value = 0;
    // }
    this._totalPage = value;
  }
  _filteredData = [];
  get filteredData() {
    return this._filteredData;
  }
  set filteredData(value) {
    // if (value < 0) {
    //     value = 0;
    // }
    this._filteredData = value;
  }

  _recordClick;
  _targetDom = "body";
  _tableNumber = 0;
  _currentPage = 1;

  columnsIndexedOnKey = {};
  constructor(config = {}) {
    // var obj2 = (({x,y})=>{let temp = {x,y};console.log(temp);return temp;})(obj);
    this._tableNumber = this._tableNumber + 1;
    this.setData(config.data, false);
    Object.assign(this, config);
    this.createTableSkelton();
    // this._columns = config.columns ? config.columns : [];
    // this._data = config.data ? config.data : [];
    // this._pageSize = config.pageSize ? config.pageSize : 20;
    // this._recordClick = config.recordClick;
    // if (this._data && this._pageSize && this._pageSize != 0)
    //     this._totalPage = Math.ceil(this._data.length / this._pageSize);
    // this._tableNumber = this._tableNumber + 1;

    // this._targetDom = config.target ? config.target : this._targetDom;
    // this.columns.forEach((item, index) => columnsIndexedOnKey[item.ApiKey] = item);
    // this.formatData();
  }
  setData(value, shouldRefresh = "true") {
    if (value) this._data = value;
    if (this._filterFunction && this._data && this._data.length > 0) {
      this._filteredData = this._data.filter((item) =>
        this._filterFunction.call(this, item)
      );
      // this._filterFunction.call(this,{"data" :this.data,"record" : this._columns});
    } else if (!this._filterFunction) {
      this._filteredData = this._data.filter((item) => 1);
    }
    if (shouldRefresh) this.data = this._data;
  }
  formatData() {
    // for () {

    // }
    // let rows = "<tr>";
    // var allRows = document.createElement('div');
    // let columns = "";
    let bodySectionId = `[dynamicGrid-${this._tableNumber}-dynamicGridBodySection='1']`;
    let tBodyElement = document.querySelectorAll(bodySectionId);
    if (!tBodyElement.length > 0) {
      tBodyElement = document.createElement("tbody");
      let key = `dynamicGrid-${this._tableNumber}-dynamicGridBodySection`;
      tBodyElement.setAttribute(key, 1);
    } else {
      tBodyElement = tBodyElement[0];
    }

    this._paginatedData.forEach((rowItem, rowIndex) => {
      let rowId = `[dynamicGrid-${this._tableNumber}-RowId='${rowIndex + 1}']`;
      let tr = document.querySelectorAll(rowId);
      if (!tr.length > 0) {
        tr = document.createElement("tr");
        let key = `dynamicGrid-${this._tableNumber}-RowId`;
        tr.setAttribute(key, rowIndex + 1);
      } else tr = tr[0];
      // let fnToCall = function(rowitem, columnItem, rowIndex, columnindex) {
      //     console.log('This event is fired Now');
      // }.bind({ "rowItem": rowItem, "rowIndex": rowIndex, "columnItem": columnItem, "columnindex": columnindex });

      let clickEvent = new CustomEvent("rowClick", {
        data: rowItem
      });

      tr.addEventListener("click", (e) => {
        if (this._recordClick) {
          this._recordClick.bind({ record: rowItem, rowIndex: rowIndex })(
            rowItem,
            rowIndex
          );
        }
        e.target.dispatchEvent(clickEvent);
      });
      // tr.dispatchEvent(clickEvent);
      // if (trElement) {

      // }
      // tr = document.createElement("tr");
      tr.style.display = "";
      let columns = "";
      this._columns.forEach((columnItem, columnindex) => {
        let temp = rowIndex + 1;
        let colId = `[dynamicGrid-${this._tableNumber}Row-${temp}-ColId='${
          columnindex + 1
        }']`;
        // let colId = `[dynamicGridRow${temp}ColId='${columnindex+1}']`;
        let td = document.querySelectorAll(colId);
        if (!td.length > 0) {
          td = document.createElement("td");
          let key = `dynamicGrid-${this._tableNumber}Row-${temp}-ColId`;
          td.setAttribute(key, columnindex + 1);
        } else td = td[0];
        let fnToCall = function (rowitem, columnItem, rowIndex, columnindex) {
          console.log("This event is fired Now");
        }.bind({ record: rowItem, rowIndex: rowIndex, item: columnItem });
        td.addEventListener("click", fnToCall);
        let formattedHTML = this.formatColumnText(
          rowItem,
          rowIndex,
          columnItem,
          columnindex
        );
        td.innerHTML = formattedHTML; //rowItem[columnItem.ApiKey];
        tr.appendChild(td);
      });
      // tr.innerHTML = row + columns + "</tr>";
      if (tr) tBodyElement.appendChild(tr);
    });
    this.tableNode.appendChild(tBodyElement);
    if (this._paginatedData && this._paginatedData.length < this._pageSize) {
      for (let i = this._paginatedData.length; i <= this._pageSize; i++) {
        let rowId = `[dynamicGrid-${this._tableNumber}-RowId='${i + 1}']`;
        //   let rowId = `[dynamicGrid-${this._tableNumber}-RowId='${i}']`;
        // let rowId = `[dynamicGridRowId='${i}']`;
        let tr = document.querySelectorAll(rowId);
        tr && tr[0] ? (tr[0].style.display = "none") : null;
      }
    }
    this.setFooter();
  }
  formatColumnText(rowItem, rowIndex, columnItem, columnindex) {
    let returnHTML;
    if (columnItem["renderer"]) {
      let dynamicFn = columnItem["renderer"].bind({
        record: rowItem,
        rowIndex: rowIndex,
        item: columnItem
      });
      returnHTML = dynamicFn(rowItem[columnItem.ApiKey], "", rowItem);
    } else {
      returnHTML = rowItem[columnItem.ApiKey];
    }
    return returnHTML;
  }
  createTableSkelton() {
    // let tabel = "<table id = dynamicGrid-" + this.tableNumber + ">" + this.columns.reduce((acc, item) => acc + "<th>" + item.Label + "</th>", '<tr>') + "</tr>";
    let mainTable = document.createElement("table");
    mainTable.id = "dynamicGridTable - " + this._tableNumber;

    let headers = this.createHeader();
    this.tableNode = mainTable;
    // mainTable.innerHTML = headers;
    this.filterDataForPagination();
    this.formatData();
    // this.setFooter();
    let footer = this.createFooter();
    if (footer) this.tableNode.appendChild(footer);
    let targetDom = document.getElementById(this._targetDom)
      ? document.getElementById(this._targetDom)
      : document.body;
    targetDom.appendChild(this.tableNode);
  }
  createHeader() {
    let headers;
    if (this._columns && this._columns.length > 0) {
      let headSectionId = `[dynamicGrid-${this._tableNumber}-dynamicGridHeaderSection='1']`;
      let tHeadElement = document.querySelectorAll(headSectionId);
      if (!tHeadElement.length > 0) {
        tHeadElement = document.createElement("thead");
        let key = `dynamicGrid-${this._tableNumber}-dynamicGridHeaderSection`;
        tHeadElement.setAttribute(key, 1);
      } else {
        tHeadElement = tHeadElement[0];
      }
      headers = this._columns.reduce((acc, item, index) => {
        //Logic to create the thead section
        let rowId = `[dynamicGrid-${this._tableNumber}-dynamicGridHeaderId='${item.ApiKey}']`;
        let headerElement = document.querySelectorAll(rowId);
        if (!headerElement.length > 0) {
          headerElement = document.createElement("th");
          let key = `dynamicGrid-${this._tableNumber}-dynamicGridHeaderId`;
          headerElement.setAttribute(key, item.ApiKey);
          headerElement.classList.add("iconHoverClass");
          let spanElement = document.createElement("span");
          spanElement.classList.add("thSpan");
          spanElement.innerHTML = item.Label ? item.Label : item.ApiKey;
          let linkElement = document.createElement("a");
          linkElement.classList.add("thLink");
          let iconElement = document.createElement("a");
          iconElement.className = "fa fa-fw fa-arrow-up";
          let sortFunction = item.sortFunction;
          headerElement.addEventListener("click", () => {
            this._currentPage = 1;
            let sortAsc = true;

            // if(iconElement.classList.contains('fa-arrow-up')){
            //     sortAsc = false;
            if (!linkElement.classList.contains("showSortIcon")) {
              console.log("Default for first time");
            } else if (iconElement.classList.contains("fa-arrow-up")) {
              sortAsc = false;
              iconElement.classList.remove("fa-arrow-up");
              iconElement.classList.add("fa-arrow-down");
            } else if (iconElement.classList.contains("fa-arrow-down")) {
              iconElement.classList.remove("fa-arrow-down");
              iconElement.classList.add("fa-arrow-up");
            }

            // }
            this.__clickedHeader
              ? this.__clickedHeader.classList.remove("showSortIcon")
              : null;
            linkElement.classList.add("showSortIcon");
            this.__clickedHeader = linkElement;
            if (sortFunction) {
              sortFunction.bind(this);
              sortFunction(item, sortAsc);
              console.log("call The Sort Function");
            } else {
              let data = [];
              if (sortAsc)
                data = this._filteredData.sort((a, b) => {
                  return a[item.ApiKey] > b[item.ApiKey] ? 1 : -1;
                  // sortAsc ? (a[item.ApiKey] > b[item.ApiKey] ? 1 : -1) : (b[item.ApiKey]>a[item.ApiKey] ? 1 : -1);
                });
              else
                data = this._filteredData.sort((a, b) => {
                  return b[item.ApiKey] > a[item.ApiKey] ? 1 : -1;
                  // sortAsc ? (a[item.ApiKey] > b[item.ApiKey] ? 1 : -1) : (b[item.ApiKey]>a[item.ApiKey] ? 1 : -1);
                });
              this._filteredData = data;
              this.refresh();
              console.log("Do default things");
            }
          });
          tHeadElement
            .appendChild(headerElement)
            .appendChild(spanElement)
            .appendChild(linkElement)
            .appendChild(iconElement);
        } else headerElement = headerElement[0];

        acc.appendChild(headerElement);
        return acc;

        // return acc + "<th class = 'iconHoverClass' ><span style='float:left;width:80%;'>" + item.Label + "</span><a style ='float:right;width:10%;'><i class='fa fa-fw fa-arrow-up'></i></a></th>"
      }, tHeadElement); //+ "</tr>";
      this.tableNode.appendChild(headers);
    }
  }
  createFooter() {
    if (this._data.length > 0) {
      let string =
        "<tfoot id =dynamicGridFooter" + this._tableNumber + "/><tr></tr>";
      let footer = document.createElement("tfoot");
      footer.id = "dynamicGridFooter" + this._tableNumber;
      let trFooter = document.createElement("tr");
      let tdFooter = document.createElement("td");
      tdFooter.className = "footerClass";
      tdFooter.colSpan = this._columns.length;
      let nextLink = document.createElement("a");
      nextLink.innerHTML = "Next Page";
      nextLink.className = "blueLink";
      nextLink.setAttribute("buttonName", "Next");
      nextLink.addEventListener("click", () =>
        this.nextHandler(nextLink, prevLink)
      );
      let prevLink = document.createElement("a");
      prevLink.className = "blueLink disableLink";
      prevLink.addEventListener("click", () =>
        this.prevHandler(prevLink, nextLink)
      );
      prevLink.setAttribute("buttonName", "Previous");
      prevLink.innerHTML = "Previous Page  ";
      let div = document.createElement("div");
      div.id = "dynamicGridFooterDiv" + this._tableNumber;
      div.className = "resultsDiv";
      div.innerHTML =
        "Showing page " + this._currentPage + " of " + this._totalPage;
      tdFooter.appendChild(div);
      tdFooter.appendChild(prevLink);
      tdFooter.appendChild(nextLink);
      footer.appendChild(trFooter).appendChild(tdFooter);
      return footer;
    } else null;
  }
  setFooter() {
    let div = document.getElementById(
      "dynamicGridFooterDiv" + this._tableNumber
    );
    if (div) {
      div.innerHTML =
        "Showing page " + this._currentPage + " of " + this._totalPage;
    } else {
      let footer = this.createFooter();
      if (footer) this.tableNode.appendChild(footer);
    }
  }
  prevHandler(element, elementNext) {
    if (this._currentPage == 1) return;
    this._currentPage = this._currentPage - 1;
    if (this._currentPage > 1) {
      element.classList.remove("disableLink");
      elementNext.classList.remove("disableLink");
      element.disable = false;
      elementNext.disable = false;
    } else {
      element.classList.add("disableLink");
      elementNext.classList.remove("disableLink");
      element.disable = true;
      elementNext.disable = false;
    }
    this.filterDataForPagination();
    this.formatData();
    // this.setFooter();
  }
  nextHandler(element, elementPrev) {
    if (this._currentPage == this._totalPage) return;
    this._currentPage = this._currentPage + 1;
    if (this._currentPage < this._totalPage) {
      element.classList.remove("disableLink");
      elementPrev.classList.remove("disableLink");
      elementPrev.disable = false;
      element.disable = false;
    } else {
      element.classList.add("disableLink");
      elementPrev.classList.remove("disableLink");
      elementPrev.disable = false;
      element.disable = true;
    }
    this.filterDataForPagination();
    this.formatData();
    // this.setFooter();
  }
  handleFooterButtons() {
    let div = document.getElementById("dynamicGridFooter" + this._tableNumber);
    let nextKey = `[buttonname='Next']`;
    let previousKey = `[buttonname='Previous']`;
    let nextElement = div.querySelectorAll(nextKey)[0];
    let previousElement = div.querySelectorAll(previousKey)[0];
    previousElement.classList.add("disableLink");
    previousElement.disable = true;
    nextElement.classList.add("disableLink");
    nextElement.disable = true;
    if (this._currentPage == 1 && this._totalPage > 1) {
      nextElement.disable = false;
      nextElement.classList.remove("disableLink");
    }
  }
  filterDataForPagination() {
    if (this._filteredData && this._filteredData.length > 0)
      this._paginatedData = this._filteredData.filter((item, index) => {
        // if (this.currentPage == 1) {
        //     return index > this.currentPage * this.pageSize;
        // } else {
        let temp = index + 1;
        return (
          index < this._currentPage * this._pageSize &&
          index >= (this._currentPage - 1) * this._pageSize
        );
        // }
      });
  }
  refresh() {
    this.data = this._filteredData;
    this._currentPage = 1;
    this.handleFooterButtons();
    this.setFooter();
  }
}
