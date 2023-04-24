import React, { useEffect, useState } from 'react';
import {  Form, Modal, Button, Dropdown, Container } from 'react-bootstrap';
import axios from '../../api/axios';
import DataTable from 'react-data-table-component';
import Select from 'react-select';
import Navigation from './Navigation';

export default function Books() {
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [pages, setPages] = useState("");
  const [publishedDate, setDate] = useState("");
  

  const [books, setBooks] = useState([]);
  const [optionList, setOptionList] = useState([])
  const [selectedOptions, setSelectedOptions] = useState();

  const [show, setShow] = useState(false);
  const handleClose = () => { setShow(false); setSelectedOptions() };
  const handleShow = () => setShow(true);

  const [showEdit, setShowEdit] = useState(false);
  const handleCloseEdit = () => { setShowEdit(false); setSelectedOptions() };
  const handleShowEdit = () => setShowEdit(true);

  

  useEffect(() => {
    (async () => await Load())();
  });
  async function Load() {
    const result = await axios.get("/Books");
    setBooks(result.data);
    getAuthors();    
  }

  async function Add() {
    var query = "";
    
    if (selectedOptions.length !== 0) {      
      selectedOptions.forEach(element => {
        query = query + "mylist=" + element.value + "&"
      });
    } else query = "";
    query = query.slice(0, -1)
    try {
      await axios.post("/Books?" + query, {
      Title: title,
      totalPages: pages,
      publishedDate: publishedDate

    });
    setShow(false);
      
    Load();
    alert("success");
    } catch (error) {
      alert("error")
    }
  }
  
  async function updateBook() {
    var query = "";
    if (selectedOptions.length !== 0) {
      selectedOptions.forEach(element => {
        query = query + "mylist=" + element.value + "&"

      });
    } else query = "";
    try {
      await axios.put("/Books/" + id + "?" + query, {
      bookId: id,
      Title: title,
      totalPages: pages,
      publishedDate: publishedDate

    });
    setShow(false);
      
    Load();
    alert("success")
    } catch (error) {
      alert("error")
    }
  }

  async function deleteBook(id) {
    await axios.delete("/Books/" + id);
    alert("Book deleted Successfully");
    setId("");
    setTitle("");
    setPages("");
    setDate("");

    Load();
  }  

  async function getAuthors() {
    await axios.get("/Authors/")
      .then(response => {
                
        const authorList = response.data.map(author => ({ value: author.authorId, label: author.authorName }));
        
        setOptionList(authorList)       
        
      });
  }
  function getBook(book) {

    setId(book.bookId);
    setTitle(book.title);
    setPages(book.totalPages);
    setDate(book.publishedDate);
    const authorList = book.authors.map(author => ({ value: author.authorId, label: author.authorName }));
    setSelectedOptions(authorList)
    handleShowEdit();
  }
  function handleSelect(data) {
    setSelectedOptions(data);
  }
  const columns = [
    {
      name: 'Id',
      selector: (row) => row.bookId,
      sortable: true,
    },
    {
      name: 'Title',
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: 'Page',
      selector: (row) => row.totalPages,
      sortable: true,
    },
    {
      name: 'Published Date',
      selector: (row) => row.publishedDate.split("T")[0],
      sortable: true,
    },
    {
      name: 'Authors',
      selector: (row) => row.authors.map(a => a.authorName).join(', '),
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div>
          <button className="btn btn-warning me-1" onClick={() => getBook(row)}>
            Edit
          </button>
          <button className="btn btn-danger" onClick={() => deleteBook(row.authorId)}>
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
      <h3>Book List</h3>
      <button className="btn btn-primary" onClick={handleShow}>Add</button>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '60px'}}>
      <Navigation/>
      <Container>
      <br></br><br></br>
      <DataTable
          title={customHeader}
            columns={columns}
            data={books}
            keyField="bookId"
            pagination={true}
            paginationPerPage={10}
            paginationRowsPerPageOptions={[5, 10, 20, 50]}
            customStyles={customStyles}
          />
        <Modal show={show} onHide={handleClose} id="AddBook">
          <Modal.Header closeButton>
            <Modal.Title>Add Book</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1"
                onChange={(e => setTitle(e.target.value))} required>
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  autoFocus
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput2"
                onChange={(e => setPages(e.target.value))} required>
                <Form.Label>Total Pages</Form.Label>
                <Form.Control
                  type="number"
                  autoFocus
                />
              </Form.Group>
              <Dropdown key={"dropkey1"}>
              <Form.Label>Select Authors</Form.Label>
                <Select
          options={optionList}
          placeholder="Select Author"
          value={selectedOptions}
          onChange={handleSelect}
          isSearchable={true}
          isMulti
        />
              </Dropdown>
              <br></br>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput3"
                onChange={(e => setDate(e.target.value))}>
                <Form.Label>Published Date</Form.Label>
                <Form.Control
                  type="date"
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


        <Modal show={showEdit} onHide={handleCloseEdit} id="updateBook">
          <Modal.Header closeButton>
            <Modal.Title>Edit Book</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1"
                onChange={(e => setTitle(e.target.value))} >
                <Form.Label >Title</Form.Label>
                <Form.Control
                  value={title}
                  type="text"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput2"
                onChange={(e => setPages(e.target.value))}>
                <Form.Label>Total Pages</Form.Label>
                <Form.Control
                  value={pages}
                  type="number"
                />
              </Form.Group>              
              <Dropdown key={"dropkey1"}>
                <Form.Label>Select Authors</Form.Label>
                <Select
                  options={optionList}
                  placeholder="Select Author"
                  value={selectedOptions}
                  onChange={handleSelect}
                  isSearchable={true}
                  isMulti
                />
              </Dropdown>
              <br></br>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput3"
                onChange={(e => setDate(e.target.value))}>
                <Form.Label>Published Date</Form.Label>
                <Form.Control
                  value={publishedDate.split("T")[0]}
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
            <Button variant="primary" onClick={updateBook}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  )
}
