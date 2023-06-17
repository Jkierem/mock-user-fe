import { useNavigate } from "react-router-dom";
import Form, { Field } from "../../components/Form";
import Input from "../../components/Input";
import { CreateSchema, CreateUserData } from "../../models/user.model";
import { UserService } from "../../services/user.service";
import { validateUserData } from "../../support/test";

const Register = () => {
    const nav = useNavigate()
    return <div>
        <Form<CreateUserData>
            initialState={{ name: "", username: "", password: "" }}
            onSubmit={(data) => {
                validateUserData(data)
                .fold(e => console.error(e), data => console.info(data))
            }}
            cleanOnChange
        >
            <Input id="name" label="Name"/>
            <Input id="username" label="Username"/>
            <Input id="password" label="Password" type="password"/>
            <Field.Connect>
                {({ submit }) => <button onClick={(e) => {
                    e.preventDefault();
                    submit()
                }}>Register</button>}
            </Field.Connect>
        </Form>
    </div>
}

export default Register;