import React from 'react';
import ReactDOM from 'react-dom';
import GoalsCard from './GoalsCard.js';

const config = {
	apiKey: "AIzaSyD-knO9c8vQUS_WqKk33bgVTsq5uGwauQs",
	authDomain: "video-noted-96c0f.firebaseapp.com",
	databaseURL: "https://video-noted-96c0f.firebaseio.com",
	storageBucket: "video-noted-96c0f.appspot.com",
	messagingSenderId: "66954401384"
 };

 firebase.initializeApp(config);

class App extends React.Component {
	constructor(){
		super();
		this.state={
			goals: [],
			loggedin: false
		}
		this.showSideBar =this.showSideBar.bind(this);
		this.addGoal =this.addGoal.bind(this);
		this.showCreate=this.showCreate.bind(this);
		this.createUser=this.createUser.bind(this);
		this.showLogin=this.showLogin.bind(this);
		this.loginUser = this.loginUser.bind(this);

	}
	componentDidMount() {
		firebase.auth().onAuthStateChanged((user)=>{
			if (user) {
				console.log(user);
				firebase.database().ref(`users/${user.uid}/goals`).on('value',(res) => {
				const userData = res.val();
				const dataArray = [];
				for (let objectKey in userData) {
					userData[objectKey].key = objectKey;
					dataArray.push(userData[objectKey])
				}
				this.setState({
					goals: dataArray,
					loggedin: true
				})
			});
		}
		else{
			this.setState({
				goals:[],
				loggedin:false
			})
		}
	})
}			
	showSideBar(e){
		e.preventDefault();
		this.sidebar.classList.toggle("show");

	}
	addGoal(e){
		e.preventDefault();
		const goal = {
			title: this.goalTitle.value,
			deadline: this.goalDeadline.value,
			text: this.goalText.value
		};
		const userId = firebase.auth().currentUser.uid;
		const dbRef = firebase.database().ref(`users/${userId}/goals/`);

		dbRef.push(goal);

		this.goalTitle.value = "";
		this.goalDeadline.value = "";
		this.goalText.value = "";
		this.showSideBar(e);
	}
	removeGoal(goalId){
		const userId =firebase.auth().currentUser.uid;
		const dbRef = firebase.database().ref(`users/${userId}/goals/${goalId}`);
		dbRef.remove();
	}
	showCreate(e) {
		e.preventDefault();
		this.overlay.classList.toggle('show');
		this.createUserModal.classList.toggle('show');
	}
	createUser(e){
		e.preventDefault();
		const email = this.createEmail.value;
		const password =this.createPassword.value;
		const confirm =this.confirmPassword.value;
		if(password === confirm) {
			firebase.auth()
				.createUserWithEmailAndPassword(email, password)
				.then((res) =>{
					this.showCreate(e);
				})
				.catch((err) =>{
					alert(err.message)
				})

		}
		else {
			alert("Passwords must Match")
		}
	}
	showLogin(e){
		e.preventDefault();
		this.overlay.classList.toggle('show');
		this.loginModal.classList.toggle('show');

	}
	loginUser(e){
		e.preventDefault();
		const email = this.userEmail.value;
		const password =this.userPassword.value;

		firebase.auth()
			.signInWithEmailAndPassword(email,password)
			.then((res)=>{
				this.showLogin(e);
			})
			.catch((err) =>{
				alert(err.message);
			});
	}
	logOut(){
		firebase.auth().signOut();

	}
	renderCards(){
		if(this.state.loggedin) {
			return this.state.goals.map((goal,i) => {
				return (
					<goalCard goal ={goal} key={`goal-${i}`} removeGoal={this.props.removeGoal} />
				)
			}).reverse();
		} 
		else {
			return (<h2>Login to add Goals</h2>);
		}
	}	
	render() {
		return (
			<div>
				<header className="mainHeader">
					<h1>Goal Digger</h1>
					<nav>
						{
							(() => {
								if(this.state.loggedin) {
									return (
										<span>
											<a href=""onClick={this.showSideBar}>Add New Goal</a>
											<a href=""onClick={this.logOut}>Logout</a>
										</span>	
									)	
								}
								else{
									return (
										<span>
											<a href="" onClick={this.showCreate}> Create Account</a>
											<a href=""onClick={this.showLogin}>Login</a>
										</span>	
									)
								}
							})()	
						}						
					</nav>
				</header>
				<div className="overlay" ref={ref => this.overlay = ref}></div>
				<section className="goals">
					{this.renderCards()}
				</section>
				<aside className="sidebar" ref={ref => this.sidebar = ref}>
					<form onSubmit={this.addGoal}>
						<h3>Add New Goal</h3>
						<div className="close-btn" onClick={this.showSideBar}>
							<i className="fa fa-times"></i>
						</div>
						<label htmlFor="goal-title">Goal:</label>
						<input type="text" name="goal-title" ref={ref => this.goalTitle = ref}/>

						<label htmlFor="goal-deadline">Deadline:</label>
						<input type="text" name="goal-deadline" ref={ref => this.goalDeadline = ref}/>

						<label htmlFor="goal-text">Goal Description:</label>
						<textarea name="goal-text" ref={ref => this.goalText = ref}></textarea>
						<input type="submit" value="Add New Goal"/>
					</form>
				</aside>
				<div className="loginModal modal" ref={ref => this.loginModal = ref}>
					<div className="close" onClick={this.showLogin}>
						<i className="fa fa-times"></i>
					</div>
					<form action="" onSubmit={this.loginUser}>
						<div>
							<label htmlFor="email">Email:</label>
							<input type="text" name="email" ref={ref => this.userEmail = ref}/>
						</div>
						<div>
							<label htmlFor="password">Password:</label>
							<input type="password" name="password" ref={ref => this.userPassword =ref}/>
						</div>
						<div>
							<input type="submit" value="Login"/>
						</div>
					</form>
				</div>						

				<div className="createUserModal modal" ref={ref => this.createUserModal = ref}>
					<div className="close" onClick={this.showCreate}>
						<i className="fa fa-times"></i>
					</div>
					<form action="" onSubmit={this.createUser}>
						<div>
							<label htmlFor="createEmail">Email:</label>
							<input type="text" name="createEmail" ref={ref => this.createEmail = ref}/>
						</div>
						<div>
							<label htmlFor="createPassword">Password:</label>
							<input type="password" name="createPassword" ref={ref => this.createPassword = ref}/>
						</div>
						<div>
							<label htmlFor="confirmPassword">Confirm Password:</label>
							<input type="password" name="confirmPassword" ref={ref => this.confirmPassword = ref}/>
						</div>
						<div>
							<input type="submit" value="Create"/>
						</div>
					</form>	
				</div>	
			</div>
		)
	}
}

ReactDOM.render(<App/>, document.getElementById('app'));