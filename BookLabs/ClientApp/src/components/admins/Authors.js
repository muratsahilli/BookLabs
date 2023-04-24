import axios from '../../api/axios';
import React, { useEffect, useState } from 'react';
import {  Form, Button,Modal, Container } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import Navigation from './Navigation';

export default function Authors() {
  const [id, setId] = useState("");
  const [authorName, setName] = useState("");
  const [birthDate, setDate] = useState("");
  const [authors, setAuthors] = useState([]);
  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = () => setShowEdit(true);

  useEffect(() => {
    (async () => await Load())();
  }, []);
  async function Load() {
    const result = await axios.get("/Authors");
    setAuthors(result.data);
  }
  async function Add() {

    await axios.post("/Authors", {
      authorName: authorName,
      birthDate: birthDate
    }).then((result) => {
      setShow(false);
      Load();
      alert("success")
    })
      .catch((error) => {
        alert("error")
      })
  }

  async function editAuthor(authors) {
    setId(authors.authorId);
    setName(authors.authorName);
    setDate(authors.birthDate);
    handleShowEdit();
  }

  async function deleteAuthor(id) {

    await axios.delete("/Authors/" + id);
    alert("Author deleted Successfully");
    setName("");
    setDate("");
    Load();
  }

  async function updateAuthor() {

    try {
      await axios.put("/Authors/" + id,
        {
          authorId: id,
          authorName: authorName,
          birthDate: birthDate
        }
      );
      alert("Author Informations Updated");
      setName("");
      setDate("");

      Load();
    } catch (err) {
      alert(err);
    }
  }
  const columns = [
    {
      name: 'Id',
      selector: (row) => row.authorId,
      sortable: true,
    },
    {
      name: 'Author Name',
      selector: (row) => row.authorName,
      sortable: true,
    },
    {
      name: 'Birth Date',
      selector: (row) => row.birthDate.split("T")[0],
      sortable: true,
    },
    {
      name: 'Books',
      selector: (row) => row.books.map(book => book.title).join(', '),
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div>
          <button className="btn btn-warning me-1" onClick={() => editAuthor(row)}>
            Edit
          </button>
          <button className="btn btn-danger" onClick={() => deleteAuthor(row.authorId)}>
            Delete
          </button>
        </div>
      ),
    },
  ];

  // Define the DataTable styles
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
      <h3>Author List</h3>
      <button className="btn btn-primary" onClick={handleShow}>Add</button>
    </div>
  );
  return (
    <div style={{ minHeight: '100vh', paddingBottom: '60px'}}>
      <Navigation />

        <br></br><br></br>
        <Container >
          <DataTable
          title={customHeader}
            columns={columns}
            data={authors}
            keyField="authorId"
            pagination={true}
            paginationPerPage={10}
            paginationRowsPerPageOptions={[5, 10, 20, 50]}
            customStyles={customStyles}
          />

          <Modal show={show} onHide={handleClose} id="modalAdd">
            <Modal.Header closeButton>
              <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>Author Name</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={(e => setName(e.target.value))}
                    autoFocus
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput3"
                >
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    onChange={(e => setDate(e.target.value))}
                    autoFocus
                    required
                  />
                </Form.Group>

              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={Add}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal show={showEdit} onHide={handleCloseEdit} id="modalEdit">
            <Modal.Header closeButton>
              <Modal.Title>Edit Author</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>Author Name</Form.Label>
                  <Form.Control
                    value={authorName}
                    onChange={(e => setName(e.target.value))}
                    type="text"
                    autoFocus
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput3"
                >
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    value={birthDate.split("T")[0]}
                    onChange={(e => setDate(e.target.value))}
                    type="date"
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
              <Button variant="primary" onClick={updateAuthor}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
       
    </div>
  )

}