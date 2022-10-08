import Joi from 'joi';
import { UserProfile } from './UserProfile';

export class FormState<T> {

    constructor(formState?: FormState<T>) {
        if (formState) {
            this.form = formState.form;
            this.errors = formState.errors;
            this.validation = formState.validation;
        }
    }

    public form: T;
    public validation?: Joi.ValidationError;
    public errors?: Map<string, string> = new Map<string, string>();

    validate(schema: Joi.ObjectSchema<T>) : FormState<T> {
        let { error, value } = schema.validate(this.form, { abortEarly: false });
        if (value) {
            this.form = value;
            this.validation = error;
            this.errors = FormState.KeyValuErrors(error as any);
        }

        return this;
    }

    static from<T>(form: T, schema?: Joi.ObjectSchema<T>) : FormState<T>{
        let formState = new FormState<T>();
        formState.form = form;
        if (schema) {
            formState.validate(schema);
        }
        return formState;
    }

    static KeyValuErrors(error: Joi.ValidationError): Map<string, string> {
        return (error?.details || []).reduce((previousValue, currentValue) => {
            if (currentValue.context?.key) {
                previousValue.set(currentValue.context?.key, currentValue.message);
            }
            return previousValue;
        }, new Map<string, string>());
    }


}
