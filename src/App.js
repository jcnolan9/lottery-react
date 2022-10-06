import logo from "./logo.svg";
import "./App.css";
import React from "react";
import web3 from "./web3";
import lottery from './lottery'

class App extends React.Component {

  state = {
    manager: '',
    players: [],
    balance: '', //the balance is somehow an object but we can put it in a string
    value: '',
    message: ''
  }
  /* 
    imagine this state object initialization is taking place inside the constructor
    Babel will put convert to older way when it turn ES6 code to ES5
  */

  /*can also do the constructor this older way below
  
  constructor(props) {
    super(props)

    this.state = { manger: ''}
  }
  */
  
  async componentDidMount() {
    const manager = await lottery.methods.manager().call()
    const players = await lottery.methods.getPlayers().call()
    const balance = await web3.eth.getBalance(lottery.options.address) //actually returns an object wrapped in Bignumberjs or something 
    
    
    /*
      when using the metamask provider don't have to do call({ from: accounts[0] })
      because the default account is already set and its the first account 

      if sending a transaction still have to do it

    */

    this.setState({ manager, players, balance })

  }

  onSubmit = async (event) => {
    event.preventDefault()

    const accounts = await web3.eth.getAccounts()

    this.setState({ message: "Waiting on transaction success..." })
    
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    })

    this.setState({ message: "You have been entered" })
  }
  //if you use arrow functions to define class methods don't have to worry about binding the function when getting used in render()

  onClick = async (event) => {
    const accounts = await web3.eth.getAccounts()

    this.setState({ message: "Waiting on transaction success..." })

    await lottery.methods.pickWinner().send({
      from: accounts[0]
      /*
        Not sending money with this transaction so don't have to send any in the function 
        
        But when user clicks the pickWinner button Metamask will still pop up asking
        to confirm the transaction and that confirmation still costs money because sending a transaction of any kind costs
      */
    })

    this.setState({ message: 'A winner has been picked!' })

  }
  
  
  render() {
    //web3.eth.getAccounts().then(console.log); 
    //cannot use async-await with render() method of react 
    //passing console.log with the '()' means console log whatever the promise  returns

    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by {this.state.manager}
        </p>
        <p>
          There are currently {this.state.players.length} people entered, 
          competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether!
        </p>

        <hr />

        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input 
              value = {this.state.value}
              onChange = {event => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enter</button>
        </form>

        <hr />

        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onClick}>Pick a winner!</button>

        <hr />

        <h1>{this.state.message}</h1>

      </div>
    );
  }
}
export default App;

/*
  Available lifecycle methods are given by React but have their implementations defined by the developer band get called 
  once when the component is rendered on the screen
*/