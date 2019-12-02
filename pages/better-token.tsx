import formik, { useFormik } from "formik"
import { requester } from "../components/_common/requester"
import Router from "next/router"
import { FormHelper } from "../components/_common/FormHelper"

export default function PowerToken() {
  const bag = useFormik({
    initialValues: {
      token: ""
    },
    onSubmit(values) {
      requester.authenticateBetter(values.token)
      Router.push("/")
    }
  })
  const h = new FormHelper(bag)

  return (
    <div>
      <h1>Better token</h1>
      <p>Your soul isn&apos;t enough.</p>
      <p>Enter a bearer token from the Spotify Web App.</p>
      <form style={{ margin: "15px" }} onSubmit={bag.handleSubmit}>
        <input type="text" {...h.bindInput("token")} />
        <br />
        <button type="submit">I am enterely yours</button>
      </form>
    </div>
  )
}
