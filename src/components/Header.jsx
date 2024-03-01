import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";
import { logout } from "../auth/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../auth/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

const Header = () => {
  const [user] = useAuthState(auth);
  const [loggedUsername, setLoggedUsername] = useState("");
  
  useEffect(() => {
    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("uid", "==", user?.uid));

      const getUserData = async () => {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setLoggedUsername(doc.data().name);
        });
      };
      if (user) {
        getUserData()
      }
    }
    catch (error) {
      console.log(error)
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setLoggedUsername("")
    }
  },[user])

  return (
    <Container fluid>
      <Row>
        <Navbar bg="light" variant="light">
          <Container className="justify-content-end">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav>
                {user ? (
                  <p >
                    Logged in as <strong>{loggedUsername}</strong>
                  </p>
                ) : null}
                <Link to="/">
                  <Button variant="contained">Home</Button>
                </Link>
                <Link to="/countries">
                  <Button variant="contained">Countries</Button>
                </Link>
                <Link to="/favourites">
                  <Button variant="contained">Favourites</Button>
                </Link>
                {!user ? (
                  <>
                    <Link to="/register">
                      <Button variant="contained">Register</Button>
                    </Link>
                    <Link to="/login">
                      <Button variant="contained">Login</Button>
                    </Link>
                  </>
                ) : (
                  <Button onClick={logout}>Sign out</Button>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </Row>
    </Container>
  );
};

export default Header;
