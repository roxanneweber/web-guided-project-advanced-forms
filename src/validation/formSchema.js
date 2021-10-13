// Here goes the schema for the form
import * as yup from 'yup';

const formSchema = yup.object().shape({
    username: yup
        .string()
        .trim()
        .required('Username is required ya chump!')
        .min(3, 'Username must be 3 or more characters long ya chump!'),
    email: yup
        .string()
        .email('Must be a valid email address!')
        .required('Email is required!'),
    role: yup
        .string()
        .oneOf(['instructor', 'student', 'alumni', 'tl'], 'Role is required!'),
    civil: yup
        .string()
        .oneOf(['married', 'single'], 'Civil status is required!'),
    coding: yup.boolean(),
    reading: yup.boolean(),
    hiking: yup.boolean()
});

export default formSchema;