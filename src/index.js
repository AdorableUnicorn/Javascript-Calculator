import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { evaluate } from "mathjs";

import "./index.css";
import "bootstrap/dist/css/bootstrap.css";

const buttonStyle = {
  buttonPrimary: "btn btn-outline-primary w-100",
  buttonDanger: "btn btn-outline-danger w-100",
  buttonInfo: "btn btn-outline-secondary w-100",
  buttonSuccess: "btn btn-outline-success w-100 h-100",
};

function col(num) {
  return `col-${num} nopadding`;
}

function Button(value, id, action, clas = buttonStyle.buttonPrimary) {
  return (
    <button
      type="button"
      className={clas}
      value={value}
      id={id}
      onClick={action}
    >
      {value}
    </button>
  );
}

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: "",
      numInput: "0",
      opInput: "",
      viewInput: "0",
      result: false,
    };
    this.addToStack = this.addToStack.bind(this);
    this.addNum = this.addNum.bind(this);
    this.addDecimal = this.addDecimal.bind(this);
    this.reset = this.reset.bind(this);
    this.equals = this.equals.bind(this);
  }

  /* below code is adding number to the stach(count)*/
  addNum(el) {
    const number = el.target.value;
    const inpute = this.state.numInput;
    const count = this.state.result ? "" : this.state.count;
    const array = ["+", "/", "*"];

    if (inpute === "0" && number === "0") {
      console.log("Cannot enter two zeros in a row");
    } else {
      const newNumInput =
        inpute === "0" || this.state.result ? number : inpute + number;
      const newCount =
        array.some((x) => count === x) || this.state.result
          ? number
          : count + number;
      this.setState({
        numInput: newNumInput,
        opInput: "",
        count: newCount,
        viewInput: newNumInput,
        result: false,
      });
    }
  }

  /*  addDecimal is adding a "." creating decimal */

  addDecimal(el) {
    const inpute = this.state.numInput;
    const operator = el.target.value;
    const count = this.state.result ? "0" : this.state.count;

    if (!inpute.includes(".")) {
      const newCount = !this.state.result
        ? inpute === "0"
          ? count + inpute + operator
          : count + operator
        : "0.";
      const newInput = !this.state.result ? inpute + operator : "0.";
      this.setState({
        numInput: newInput,
        opInput: "",
        count: newCount,
        viewInput: newInput,
        result: false,
      });
    }
  }
  /*adding operator to stack (count) */

  addToStack(el) {
    const inpute = this.state.opInput;
    const operator = el.target.value;
    const count = this.state.count;
    const array = ["+", "/", "*", "-"];

    if (count.length <= 1 && inpute.length) {
      this.setState({
        opInput: operator,
        numInput: "0",
        count: "",
        viewInput: operator,
        result: false,
      });
    } else if (array.some((x) => inpute.includes(x))) {
      if (!inpute.includes("-") && el.target.value === "-") {
        return this.setState({
          opInput: inpute + operator,
          numInput: "0",
          count: count + operator,
          viewInput: operator,
          result: false,
        });
      } else {
        this.setState({
          opInput: operator,
          numInput: "0",
          count: count.slice(0, -1 * inpute.length) + operator,
          viewInput: operator,
          result: false,
        });
      }
    } else {
      this.setState({
        opInput: operator,
        numInput: "0",
        count: count + operator,
        viewInput: operator,
        result: false,
      });
    }
  }

  reset() {
    return this.setState({
      count: "",
      numInput: "0",
      opInput: "",
      viewInput: "0",
      result: false,
    });
  }

  equals() {
    const opCount = this.state.opInput;
    const count = this.state.count;
    if (count.length === 0) {
      return this.setState({
        count: "0=0",
        viewInput: "0",
      });
    }
    const newCount =
      opCount.length !== 0 ? count.slice(0, -1 * opCount.length) : count;
    const result = Number.isInteger(evaluate(newCount))
      ? evaluate(newCount)
      : parseFloat(evaluate(newCount).toPrecision(4));

    this.setState({
      count: "" + result,
      viewInput: result,
      result: true,
    });
  }

  render() {
    return (
      <div className="container" id="container">
        <div className="row" id="monitor">
          <div className="row" id="count">
            <p className="display">{this.state.count}</p>
          </div>
          <div className="row" id="display">
            <p className="display">{this.state.viewInput}</p>
          </div>
        </div>
        <div className="row">
          <div className={col(6)}>
            {Button("AC", "clear", this.reset, buttonStyle.buttonDanger)}
          </div>
          <div className={col(3)}>
            {Button("/", "divide", this.addToStack, buttonStyle.buttonInfo)}
          </div>
          <div className={col(3)}>
            {Button("*", "multiply", this.addToStack, buttonStyle.buttonInfo)}
          </div>
        </div>
        <div className="row">
          <div className={col(3)}>{Button(7, "seven", this.addNum)}</div>
          <div className={col(3)}>{Button(8, "eight", this.addNum)}</div>
          <div className={col(3)}>{Button(9, "nine", this.addNum)}</div>
          <div className={col(3)}>
            {Button("-", "subtract", this.addToStack, buttonStyle.buttonInfo)}
          </div>
        </div>
        <div className="row">
          <div className={col(3)}>{Button(4, "four", this.addNum)}</div>
          <div className={col(3)}>{Button(5, "five", this.addNum)}</div>
          <div className={col(3)}>{Button(6, "six", this.addNum)}</div>
          <div className={col(3)}>
            {Button("+", "add", this.addToStack, buttonStyle.buttonInfo)}
          </div>
        </div>
        <div className="row">
          <div className="col-9">
            <div className="row">
              <div className={col(4)}>{Button(1, "one", this.addNum)}</div>
              <div className={col(4)}>{Button(2, "two", this.addNum)}</div>
              <div className={col(4)}>{Button(3, "three", this.addNum)}</div>
            </div>
            <div className="row">
              <div className={col(8)}>{Button(0, "zero", this.addNum)}</div>
              <div className={col(4)}>
                {Button(
                  ".",
                  "decimal",
                  this.addDecimal,
                  buttonStyle.buttonInfo
                )}
              </div>
            </div>
          </div>
          <div className={col(3)}>
            {Button("=", "equals", this.equals, buttonStyle.buttonSuccess)}
          </div>
        </div>
      </div>
    );
  }
}

const root = createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter basename="/Javascript-Calculator">
    <Calculator />
  </BrowserRouter>
);
