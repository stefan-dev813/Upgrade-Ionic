import { ContactFormFactory } from './ContactForm';
import { ContactsFormFactory } from './ContactsForm';
import { CustomFormFactory } from './CustomForm';
import { DetailsFormFactory } from './DetailsForm';
import { MiscFormFactory } from './MiscForm';
import { ServicesFormFactory } from './ServicesForm';
import { TodoListFormFactory } from './TodoListForm';
import { TravelFormFactory } from './TravelForm';
import { AddNoteFormFactory } from './AddNoteForm';
import { EmailCoworkersFormFactory } from './EmailCoworkersForm';
import { ProductFormFactory } from './ProductForm';
import { ServiceFormFactory } from './ServiceForm';
import { StageTimeFormFactory } from './StageTimeForm';
import { TodoFormFactory } from './TodoForm';
import { ForgotPasswordFormFactory } from './ForgotPasswordForm';
import { LoginFormFactory } from './LoginForm';
import { NewEventFormFactory } from './NewEventForm';

const eventForms = {
    ContactFormFactory,
    ContactsFormFactory,
    CustomFormFactory,
    DetailsFormFactory,
    MiscFormFactory,
    ServicesFormFactory,
    TodoListFormFactory,
    TravelFormFactory
};

const subForms = {
    AddNoteFormFactory,
    EmailCoworkersFormFactory,
    ProductFormFactory,
    ServiceFormFactory,
    StageTimeFormFactory,
    TodoFormFactory
};

const mainForms = {
    ForgotPasswordFormFactory,
    LoginFormFactory,
    NewEventFormFactory
};

export {
    eventForms,
    subForms,
    mainForms,
    ContactFormFactory,
    ContactsFormFactory,
    CustomFormFactory,
    DetailsFormFactory,
    MiscFormFactory,
    ServicesFormFactory,
    TodoListFormFactory,
    TravelFormFactory,
    AddNoteFormFactory,
    EmailCoworkersFormFactory,
    ProductFormFactory,
    ServiceFormFactory,
    StageTimeFormFactory,
    TodoFormFactory,
    ForgotPasswordFormFactory,
    LoginFormFactory,
    NewEventFormFactory
}