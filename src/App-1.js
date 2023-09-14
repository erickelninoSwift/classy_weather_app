import "./App.css";
import React from "react";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { counter: 0 };
    this.handleDecrement = this.handleDecrement.bind(this);
    this.handleIncrement = this.handleIncrement.bind(this);
  }

  handleDecrement() {
    this.setState((current) => {
      return {
        counter: current.counter - 1,
      };
    });
  }

  handleIncrement() {
    this.setState((current) => {
      return {
        counter: current.counter + 1,
      };
    });
  }
  render() {
    const date = new Date("june 21 2027");
    date.setDate(date.getDate() + this.state.counter);
    return (
      <>
        <div>
          <button onClick={this.handleIncrement}>+</button>
          {date.toDateString()} ...[{this.state.counter}]
          <button onClick={this.handleDecrement}>-</button>
        </div>
      </>
    );
  }
}

export default App;
