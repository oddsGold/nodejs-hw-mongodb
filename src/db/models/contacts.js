import {model, Schema} from 'mongoose';
import {contactTypeList} from "../../constants/contacts-constants.js";
import {mongooseSaveError, setUpdateSettings} from "./hooks.js";

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
            enum: contactTypeList,
            default: 'personal'
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

contactsSchema.post("save", mongooseSaveError );

contactsSchema.pre("findOneAndUpdate", setUpdateSettings)

contactsSchema.post("findOneAndUpdate", mongooseSaveError );
export const ContactsCollection = model('contacts', contactsSchema);
