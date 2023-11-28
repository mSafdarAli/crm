import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class ValidatorMessageService {
	public getValidatorErrorMessage(validatorName: string | null, validatorValue?: any) {
		let config: any = {
			'required': 'Required',
			'minlength': `Minimum length ${validatorValue.requiredLength}`,
			'maxlength': `Maximum length ${validatorValue.requiredLength}`,
			'email': 'Invalid email address',
			'userTaken': 'Username Already Taken',
			'duplicateId': 'Record already exist',
			'duplicateCode': 'Record Already Exists',
			'max': `Max Value ${validatorValue.max}`,
			'min': `Min Value ${validatorValue.min}`,
			'dropdownSelect': 'Please select option from dorpdown',
			'password': '1 U Case, 1 no, 1 L Case and special char. ie "!sTrong9ass"',
			'color': 'Please Enter correct Color Hex. ie "#F00F00"',
			'username': 'Only digits and aphabits are allowed',
			'mustMatch': 'Password doesn\'t match',
			'emailTaken': 'Email already exists',
			'usernameTaken': 'Username already exists',
			'fileType': `Only (${validatorValue}) types are allowed`,
		};
		if(validatorName) {
			return config[validatorName];
		}
		return null;
	}
	
}
