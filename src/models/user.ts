import * as mongoose from 'mongoose'
import { _User } from '../index.d'
import * as bcrypt from 'bcrypt'

const UserSchema = new mongoose.Schema(
	{
		email: { type: String, required: true },
		password: { type: String, required: true },
		token: { type: String, required: false }
	},
	{ timestamps: true }
)

UserSchema.methods = {
	encryptPassword: function (password: string): string {
		if (!password) {
			return ''
		} else {
			const salt = bcrypt.genSaltSync(10)
			return bcrypt.hashSync(password, salt)
		}
	}
}

UserSchema.pre('save', function (next): void {
	if (this.isModified('password')) {
		this.password = this.encryptPassword(this.password)
	}
	next()
})

export default mongoose.model<_User>('User', UserSchema, 'users')
