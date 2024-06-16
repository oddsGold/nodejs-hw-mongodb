import {model, Schema} from 'mongoose';

const contactsSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        phoneNumber : {
            type: String,
            required: true,
        },
        isFavourite : {
            type: Boolean,
            default: false
        },
        email : {
            type: String,
            required: false,
            validate: {
                validator: function (v) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
                },
                message: props => `${props.value} is not a valid email address!`
            }
        },
        contactType : {
            type: String,
            required: true,
            enum: ['work', 'home', 'personal'],
            default: 'personal'
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const ContactsCollection = model('contacts', contactsSchema);
