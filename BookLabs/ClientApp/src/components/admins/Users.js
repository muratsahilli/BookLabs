import axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Modal, Container } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import Navigation from './Navigation';

export default function Users() {

  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const [userList, setUserList] = useState([])
  const localname = localStorage.getItem("username");
  const [userId, setUserId] = useState()
  const [userName, setUserName] = useState("")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [showEdit, setShowEdit] = useState(false);

  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = () => setShowEdit(true);

  useEffect(() => {
    (async () => await Load())();
  }, []);
  async function Load() {
    const result = await axios.get("/Users");
    setUserList(result.data);
  }
  async function editUser(user) {
    setUserId(user.userId);
    setUserName(user.userName);
    setFullName(user.fullName);
    setEmail(user.email);
    handleShowEdit();
  }
  async function updateUser() {
    try {
      await axios.put("/Users/" + userId, {
        userId: userId,
        userName: userName,
        fullName: fullName,
        email: email
      });
      alert("Informations Updated");
      handleCloseEdit();
      Load();
    } catch { alert("eror") }

  }
  async function changeRole(id) {
    try {
      await axios.put("/Users/role/" + id);
      alert("Role Changed");
      Load();
    }
    catch { alert("eror") }
  }
  async function deleteUser(id, name) {
    try {
      await axios.delete("/Users/" + id);
      if (name === localname) {
        setAuth({});
        localStorage.removeItem("auth");
        navigate("../Register")
      }
      alert("User deleted");
      Load();
    } catch (error) {
      alert("eror")
    }
  }

  const columns = [
    {
      name: 'Id',
      selector: (row) => row.userId,
      sortable: true,
    },
    {
      name: 'Username',
      selector: (row) => row.userName,
      sortable: true,
    },
    {
      name: 'Full Name',
      selector: (row) => row.fullName,
      sortable: true,
    },
    {
      name: 'Email',
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: 'Role',
      selector: (row) => row.roles.map(u => u.roleName).join(', '),
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div>
          <button className="btn btn-warning me-1" onClick={() => editUser(row)}>
            Edit
          </button>
          <button className="btn btn-danger" onClick={() => deleteUser(row.userId, row.userName)}>
            Delete
          </button>
        </div>
      ),
    },
    {
      name: 'Role Actions',
      cell: (row) => (
        <div>
          {
            (row.userName !== localname) &&
            <Button color="info" onClick={() => changeRole(row.userId)}>
              Change Role
            </Button>
          }
        </div>
      ),
    },
  ];

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: `rgb(${119}, ${160}, ${169})`,
        color: '#fff',
        fontWeight: 'bold',
      },
    },
    rows: {
      highlightOnHoverStyle: {
        backgroundColor: `rgb(${111}, ${125}, ${140})`,
        color: '#fff',
        cursor: 'pointer',
      },
    },
    pagination: {
      style: {
        backgroundColor: `rgb(${119}, ${160}, ${169})`,
        color: '#fff',
        fontWeight: 'bold',
      },
    },
  };
  const customHeader = (
    <div className="d-flex justify-content-between">
      <h3>User List</h3>
    </div>
  );
  return (
    <div style={{ minHeight: '100vh', paddingBottom: '60px' }}>
      <Navigation />
      <br></br><br></br>
      <Container>
        <DataTable
          title={customHeader}
          columns={columns}
          data={userList}
          keyField="userId"
          pagination={true}
          paginationPerPage={10}
          paginationRowsPerPageOptions={[5, 10, 20, 50]}
          customStyles={customStyles}
        />
        <Modal show={showEdit} onHide={handleCloseEdit} id="modalEdit">
          <Modal.Header closeButton>
            <Modal.Title>Edit Informations</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  value={userName}
                  type="text"
                  onChange={(e => setUserName(e.target.value))}
                  autoFocus
                  disabled
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  value={fullName}

                  onChange={(e => setFullName(e.target.value))}
                  type="text"
                  autoFocus
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  value={email}

                  onChange={(e => setEmail(e.target.value))}
                  type="email"
                  autoFocus
                  required
                />
              </Form.Group>


            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEdit}>
              Close
            </Button>
            <Button variant="primary" onClick={updateUser}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  )
}