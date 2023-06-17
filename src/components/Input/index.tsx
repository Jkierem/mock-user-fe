import { RefObject, useRef } from "react"
import { Formatted, Formatter } from "../../support/formatter"
import { Iso } from "../../support/optics/iso"
import { Field } from "../Form"

export interface InputProps {
    id: string
    label: string
    name?: string
    formatter?: Formatter
    type?: string
}
  
const Input = ({
    id,
    label,
    name = id,
    formatter = Iso.id(),
    type = "text"
}: InputProps) => {
    const inputRef = useRef(null) as RefObject<HTMLInputElement>
    // const [_focus, setFocused] = useState(false)
  
    return (
      <Field name={name}>
        {({ value, error, setValue }) => {
          return (
              <div onClick={() => inputRef.current?.focus()}>
                <label htmlFor={id}>
                  {label}
                </label>
                <input
                  id={id}
                  name={name}
                  ref={inputRef}
                  type={type}
                  value={formatter.view(value as string)}
                  onChange={(e) => setValue(formatter.review(e.target.value as Formatted))}
                  // onFocus={() => setFocused(true)}
                  // onBlur={() => setFocused(false)}
                />
                {Boolean(error) && <span>{error}</span>}
              </div>
          )
        }}
      </Field>
    )
  }
  
  export default Input
  