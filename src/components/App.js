import React, { useState, useEffect } from 'react';
import Friend from './Friend';
import FriendForm from './FriendForm';
// 🔥 STEP 1- CHECK THE ENDPOINTS IN THE README
// 🔥 STEP 2- FLESH OUT FriendForm.js
// 🔥 STEP 3- FLESH THE SCHEMA IN ITS OWN FILE
// 🔥 STEP 4- IMPORT THE SCHEMA, AXIOS AND YUP
import schema from '../validation/formSchema';
import axios from 'axios';
import * as yup from 'yup';
import { validate } from 'uuid';
//////////// INITIAL STATES ////////////////
//////////// INITIAL STATES ////////////////
//////////// INITIAL STATES ////////////////
const initialFormValues = {
	///// TEXT INPUTS /////
	username: '',
	email: '',
	///// DROPDOWN /////
	role: '',
	///// RADIO BUTTONS /////
	civil: '',
	///// CHECKBOXES /////
	hiking: false,
	reading: false,
	coding: false,
};
const initialFormErrors = {
	username: '',
	email: '',
	role: '',
	civil: '',
};
const initialFriends = [];
const initialDisabled = true;

export default function App() {
	//////////////// STATES ////////////////
	//////////////// STATES ////////////////
	//////////////// STATES ////////////////
	const [friends, setFriends] = useState(initialFriends); // array of friend objects
	const [formValues, setFormValues] = useState(initialFormValues); // object
	const [formErrors, setFormErrors] = useState(initialFormErrors); // object
	const [disabled, setDisabled] = useState(initialDisabled); // boolean

	//////////////// HELPERS ////////////////
	//////////////// HELPERS ////////////////
	//////////////// HELPERS ////////////////
	const getFriends = () => {
		axios
			.get('http://buddies.com/api/friends')
			.then((res) => {
				//console.log(res.data);
				setFriends(res.data);
			})
			.catch((err) => console.error(err));

		// // 🔥 STEP 5- IMPLEMENT! ON SUCCESS PUT FRIENDS IN STATE
		// //    helper to [GET] all friends from `http://buddies.com/api/friends`
		// const myFriends = await axios.get('http://buddies.com/api/friends'); // more modern code that replaces the .then and .catch code
	};

	/* 

  this code allows you to make multiple calls; perhaps you pull an ID on the first call, then based on that ID you want to call another database and pull names, then based on the name you want to make another call, etc.
  try { 
    const myData = await axios.get('loremipusum');
    const allData = await axios.get('loremipsum.com/${myData.id}')
    const allOtherData = await axios.get('loremipsum.com/${allData.blah')
  } catch (err) {
    console.log(err)
  }
*/

	const postNewFriend = (newFriend) => {
		// 🔥 STEP 6- IMPLEMENT! ON SUCCESS ADD NEWLY CREATED FRIEND TO STATE
		//    helper to [POST] `newFriend` to `http://buddies.com/api/friends`
		//    and regardless of success or failure, the form should reset
		axios
			.post('http://buddies.com/api/friends', newFriend)
			.then((res) => {
				setFriends([res.data, ...friends]); // neat and clean way to set these values
			})
			.catch((err) => console.error(err))
			.finally(() => {
				setFormValues(initialFormValues);
			});
	};

	const validate = (name, value) => {
		yup.reach(schema, name)
			.validate(value)
			.then(() => setFormErrors({ ...formErrors, [name]: '' }))
			.catch((err) =>
				setFormErrors({ ...formErrors, [name]: err.errors[0] })
			);
	};
	//////////////// EVENT HANDLERS ////////////////
	//////////////// EVENT HANDLERS ////////////////
	//////////////// EVENT HANDLERS ////////////////
	const inputChange = (name, value) => {
		// 🔥 STEP 10- RUN VALIDATION WITH YUP
		validate(name, value);
		setFormValues({
			...formValues,
			[name]: value, // NOT AN ARRAY
		});
	};

	const formSubmit = () => {
		const newFriend = {
			username: formValues.username.trim(),
			email: formValues.email.trim(),
			role: formValues.role.trim(),
			civil: formValues.civil.trim(),
			// 🔥 STEP 7- WHAT ABOUT HOBBIES?
			hobbies: ['hiking', 'reading', 'coding'].filter(
				(hobby) => !!formValues[hobby] // this !! is a way to find a boolean value from a string
			),
			/* 
        !true -> !false -> true
        !'Casey' -> !false -> true
        !null -> !true -> false 
      */
		};
		// 🔥 STEP 8- POST NEW FRIEND USING HELPER
		postNewFriend(newFriend);
	};

	//////////////// SIDE EFFECTS ////////////////
	//////////////// SIDE EFFECTS ////////////////
	//////////////// SIDE EFFECTS ////////////////
	useEffect(() => {
		getFriends();
	}, []);

	useEffect(() => {
		// 🔥 STEP 9- ADJUST THE STATUS OF `disabled` EVERY TIME `formValues` CHANGES
		schema.isValid(formValues).then((valid) => setDisabled(!valid));
	}, [formValues]);

	return (
		<div className='container'>
			<header>
				<h1>Friends App</h1>
			</header>

			<FriendForm
				values={formValues}
				change={inputChange}
				submit={formSubmit}
				disabled={disabled}
				errors={formErrors}
			/>

			{friends.map((friend) => {
				return <Friend key={friend.id} details={friend} />;
			})}
		</div>
	);
}
