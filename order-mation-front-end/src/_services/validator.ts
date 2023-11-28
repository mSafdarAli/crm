import { Validators } from '@angular/forms';

export const ValidationRules = {
	email: [Validators.required, Validators.maxLength(150)],
	name: [Validators.required, Validators.maxLength(200)],
	url: [Validators.required, Validators.pattern(/^(www\.)[a-z0-9-]+\.[a-z]{2,}(\.[a-z]{2,3})?/)],
	address: [Validators.required, Validators.maxLength(250)],
	password: [Validators.required, Validators.pattern(/(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s)/), Validators.minLength(8), Validators.maxLength(24)],
}