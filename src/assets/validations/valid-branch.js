import * as Yup from 'yup'
export const validationSchema = Yup.object().shape({
    name: Yup.string().required('This field is required.'),
    email: Yup.string().email('This field is email.'),
    hotline: Yup.string().required('This field is required.')
})