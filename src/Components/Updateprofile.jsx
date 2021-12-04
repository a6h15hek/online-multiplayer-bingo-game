import React, { useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../authcontext"
import { Link, useHistory } from "react-router-dom"
import Spinner from '../Components/UIElements/LoadingSpinner'

export default function UpdateProfile() {
  
  const { currentUser, updatePassword, updateEmail ,updateUserName} = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const [email,setEmail] = useState(currentUser.email)
  const[username, setUserName] = useState(currentUser.displayName);
  const [password,setPassword] = useState("")
  const [confirmPassword,setConfirmPassword] = useState("")

  function handleSubmit(e) {
    e.preventDefault()
    if (password !== confirmPassword) {
      return setError("Passwords do not match")
    }

    const promises = []
    setLoading(true)
    setError("")


    if (username!== currentUser.displayName) {
      promises.push(updateUserName(username))
    }
    if (email !== currentUser.email) {
      promises.push(updateEmail(email))
    }
    if (confirmPassword) {
      promises.push(updatePassword(confirmPassword))
    }

    Promise.all(promises)
      .then(() => {
        history.push("/")
      })
      .catch(() => {
        setError("Failed to update account")
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <React.Fragment>
      {loading ? <Spinner asOverlay /> : ''}
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Update Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
          <Form.Group id="userName">
              <Form.Label>User Name</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                required
                defaultValue={currentUser.displayName}
              />
            </Form.Group>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                required
                defaultValue={currentUser.email}
              />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep the same"
              />
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Leave blank to keep the same"
              />
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Update
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Link to="/">Cancel</Link>
      </div>
    </React.Fragment>
  )
}
