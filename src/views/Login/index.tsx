import { useCallback, useState } from "react";
import Form, { Field } from "../../components/Form";
import Input from "../../components/Input";
import { UserService } from "../../services/user.service";
import { Credentials, CredentialsSchema } from "../../models/user.model";
import { useNavigate } from "react-router-dom";

const formInit = { username: "", password: "" }

const Login = () => {
    const [error, setError] = useState<string | false>(false);

    const nav = useNavigate()

    const attemptLogin = ({ username, password }: Credentials) => {
        UserService
            .login(username, password)
            .then((user) => {
                nav("/home")
            })
            .catch((e) => {
                if( e.status === 401 ){
                    setError("Failed login")
                } else {
                    setError("Unknown error ocurred")
                }
            })
    }

    const handleChange = useCallback(() => setError(false), [setError])

    return <div>
        <Form<Credentials>
            initialState={formInit}
            schema={CredentialsSchema}
            onSubmit={attemptLogin}
            onChange={handleChange}
            cleanOnChange
        >
            <Input id="username" label="Username" />
            <Input id="password" label="Password" type="password"/>
            <Field.Connect>
                {({ submit }) => <button onClick={(e) => {
                    e.preventDefault();
                    submit()
                }}>Login</button>}
            </Field.Connect>
            {error && <span>{error}</span>}
            <button onClick={(e) => {
                e.preventDefault();
                nav("/register")
            }}>Register</button>
        </Form>
    </div>
}

export default Login;