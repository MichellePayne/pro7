import React from 'react';

export default class GoalCard extends React.Component {
	constructor() {
		super();
		this.state = {
			editing: false,
			goal: {}
		};
		this.save = this.save.bind(this);
	}
	save(e){
		e.preventDefault();
		const userId= firebase.auth().currentUser.uid;
		const dbRef= firebase.database().ref(`users/${userId}/goals/${this.state.goal.key}`);
		dbRef.update({
			title: this.goalTitle.value,
			deadline: this.goalDeadline.value,
			text: this.goalText.value
		});
		this.setState({
			editing: false
		});
	}
	render() {
		let editingTemp = (
			<span>
				<h4>{this.props.goal.title}</h4>
				<h4>{this.props.goal.deadline}</h4>
				<p>{this.props.goal.text}</p>
			</span>	
		)
		if(this.state.editing){
			editingTemp = (
				<form onSubmit={this.save}>
					<div>
						<input type="text" defaultValue={this.props.goal.title} name="title" ref={ref => this.goalTitle = ref}/>
					</div>
					<div>	
						<input type="text" defaultValue={this.props.goal.deadline} name="deadline" ref={ref => this.goalDeadline = ref}/>
					</div>
					<div>
						<input type="text" defaultValue={this.props.goal.text} name="text" ref={ref => this.goalText = ref}/>
					</div>
					<input type="submit" value="Done Editing!"/>
				</form>
			)
		}
		return (
			<div className="goalsCard">
				<i className="fa fa-edit" onClick={() => this.setState({editing: true})}></i>
				<i className="fa fa-times" onClick={() => this.props.removeGoal(this.props.goal.key)}></i>
				{editingTemp}
			</div>
		)
	}
}