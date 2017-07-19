import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Formik } from 'formik';
import Yup from 'yup';
import Firebase from 'firebase'
import ReactMixin from 'react-mixin'
import ReactFireMixin from 'reactfire'
import termsOfUseDoc from '../assets/ParticipationAgreement.pdf'
import codeOfConductDoc from '../assets/CodeofConductandHarassmentPolicy.pdf'

 export default class RegistrationForm extends Component {
    render() {
        console.log(this.props)
        return ( 
        <div className='Content'>
            <h2>Almost There!</h2>
            <div className="center-text">
              {
                
                  ((this.props.match.params.id === "individual") ? 
                      <div>
                        <h3>You are registering as an Individual</h3>
                        <h4>Trying to join a team that already exists? Go <Link className="whiteLink" to="/registerTeam/join/join-team" >here</Link>.</h4>
                      </div> :
                      <h3>You are registering with Team {this.props.match.params.id}</h3>) 
              }
            </div>
        <div className="register_form">
            <Form 
              user={{ 
                email: '',
                firstName: '',
                lastName: '',
                teamName: this.props.match.params.id,
                termsOfUse: false
              }}
              history={this.props.history}
             /> 
        </div>
        </div>
     )
    }
 }

 ReactMixin(RegistrationForm.prototype, ReactFireMixin)

const formikEnhancer = Formik({
  validationSchema: Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required!'),
    firstName: Yup.string()
      .required('First name is required!'),
    lastName: Yup.string()
      .required('Last name is required!'),
    termsOfUse: Yup.boolean()
      .required('Please accept the Participation Agreement and Code of Conduct.')
  }),
  mapPropsToValues: props => ({ 
      email: props.user.email,
      firstName: props.user.firstName,
      lastName: props.user.lastName,
      team: props.user.teamName,
      termsOfUse: props.user.termsOfUse
  }),
  handleSubmit: (payload, {props, setErrors, setSubmitting}) => {
    var userData = payload;
    console.log(userData.termsOfUse)
    if(userData.termsOfUse) {

    } else {
       setErrors({ termsOfUse: "Please accept the Participation Agreement and Code of Conduct." })
       return
    }
    console.log("submitting to firebase dawg")
    delete userData["termsOfUse"]
    var newUserKey = Firebase.database().ref().child('users').push().key;

    var updates = {};
    updates['/users/' + newUserKey] = userData;

    Firebase.database().ref().update(updates)
      .then(props.history.push('/registered'))
      .catch(err => console.log('err', err));
  },
  displayName: 'RegistrationForm',
});

const MyForm = ({
  values,
  touched,
  errors,
  handleChange,
  handleBlur,
  handleSubmit,
}) =>
  <form onSubmit={handleSubmit}>
    {/* First Name */}
    <label htmlFor="firstName" style={{ display: 'block' }}>
      First Name
    </label>
    <input
      id="firstName"
      placeholder="First name"
      type="text"
      value={values.firstName}
      onChange={handleChange}
      onBlur={handleBlur}
      className={
        errors.firstName && touched.firstName ? 'text-input error textInput' : 'text-input textInput'
      }
    />
    {errors.firstName &&
      touched.firstName &&
      <div className="input-feedback">
        {errors.firstName}
      </div>}
    {/* Last Name */}
    <label htmlFor="lastName" style={{ display: 'block' }}>
      Last Name
    </label>
    <input
      id="lastName"
      placeholder="Last name"
      type="text"
      value={values.lastName}
      onChange={handleChange}
      onBlur={handleBlur}
      className={
        errors.lastName && touched.lastName ? 'text-input error textInput' : 'text-input textInput'
      }
    />
    {errors.lastName &&
      touched.lastName &&
      <div className="input-feedback">
        {errors.lastName}
      </div>}
    {/* Email */}
    <label htmlFor="email" style={{ display: 'block' }}>
      Email
    </label>
    <input
      id="email"
      placeholder="Email"
      type="text"
      value={values.email}
      onChange={handleChange}
      onBlur={handleBlur}
      className={
        errors.email && touched.email ? 'text-input error textInput' : 'text-input textInput'
      }
    />
    {errors.email &&
      touched.email &&
      <div className="input-feedback">
        {errors.email}
      </div>}
   
    
      <label><input 
      id="termsOfUse" 
      type="checkbox"
      className=""
      onBlur={handleBlur}
      onChange={handleChange}
      value={values.termsOfUse}/>I accept the <a href={termsOfUseDoc} target="_blank" rel="noopener noreferrer" className="register_form_checkboxLabel">Participation Agreement</a> and <a href={codeOfConductDoc} target="_blank" rel="noopener noreferrer" className="register_form_checkboxLabel">Code of Conduct</a>.</label>
      {errors.termsOfUse &&
      touched.termsOfUse &&
      <div className="input-feedback">
        {errors.termsOfUse}
      </div>}
 
    <button type="submit" className="button">Register</button>
  </form>;

const Form = formikEnhancer(MyForm);