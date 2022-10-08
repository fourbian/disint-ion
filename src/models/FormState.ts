import Joi from 'joi';

export class FormState {
    public validation?: Joi.ValidationError;
    public errors?: Map<string, string> = new Map<string, string>();

    static KeyValuErrors(error: Joi.ValidationError): Map<string, string> {
        return (error?.details || []).reduce((previousValue, currentValue) => {
            if (currentValue.context?.key) {
                previousValue.set(currentValue.context?.key, currentValue.message);
            }
            return previousValue;
        }, new Map<string, string>());
    }


}
